import { getAllPosts } from '../src/lib/blog';

const baseUrl = 'http://localhost:3000';

async function checkUrl(url: string, expectedStatuses: number[], retries = 3): Promise<{ success: boolean; status?: number; location?: string; html?: string }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'manual', // do not follow redirects, so we can check redirect status
      });
      
      const status = res.status;
      const location = res.headers.get('location') || undefined;
      let html = '';
      if (status === 200) {
        html = await res.text();
      }
      
      return {
        success: expectedStatuses.includes(status),
        status,
        location,
        html,
      };
    } catch (err: any) {
      if (attempt === retries) {
        return { success: false, html: err.message };
      }
      console.warn(`⚠️ Warning: Fetch failed for ${url} (Attempt ${attempt}/${retries}). Retrying in 1.5s... Error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  return { success: false, html: 'Retry limit reached' };
}

async function main() {
  const posts = getAllPosts();
  const checkTargetsOnly = process.argv.includes('--check-targets-only');
  
  console.log(`Starting validation for ${posts.length} posts...`);
  console.log(`Mode: ${checkTargetsOnly ? 'Check Target URLs Only (No Redirects)' : 'Full Check (Targets + Redirects)'}`);
  
  let passedCount = 0;
  let failedCount = 0;

  for (const post of posts) {
    const slug = post.slug;
    const targetUrl = `${baseUrl}/blog/${slug}`;
    
    // Validate target page (must return 200)
    const targetCheck = await checkUrl(targetUrl, [200]);
    if (!targetCheck.success) {
      console.error(`❌ FAILED: Target URL ${targetUrl} returned status ${targetCheck.status} (expected 200). Error/Details: ${targetCheck.html?.slice(0, 100)}`);
      failedCount++;
      continue;
    }
    
    // Verify canonical tag
    const canonicalLink = `<link rel="canonical" href="https://www.singulariti.in/blog/${slug}">`;
    const canonicalLink2 = `<link rel="canonical" href="https://www.singulariti.in/blog/${slug}/">`; // handle potential trailing slash
    
    const hasCanonical = targetCheck.html && (
      targetCheck.html.includes(`href="https://www.singulariti.in/blog/${slug}"`) ||
      targetCheck.html.includes(`href="https://www.singulariti.in/blog/${slug}/"`) ||
      targetCheck.html.replace(/\s+/g, '').includes(canonicalLink.replace(/\s+/g, '')) ||
      targetCheck.html.replace(/\s+/g, '').includes(canonicalLink2.replace(/\s+/g, ''))
    );
    
    // Verify robots tag (index, follow)
    const hasRobots = targetCheck.html && (
      targetCheck.html.toLowerCase().includes('name="robots"') &&
      targetCheck.html.toLowerCase().includes('index') &&
      targetCheck.html.toLowerCase().includes('follow')
    );
    
    if (!hasCanonical) {
      console.error(`❌ FAILED: Canonical URL check failed on ${targetUrl}. Expected: https://www.singulariti.in/blog/${slug}`);
      failedCount++;
      continue;
    }
    
    if (!hasRobots) {
      console.error(`❌ FAILED: Robots meta tag (index,follow) missing or incorrect on ${targetUrl}.`);
      failedCount++;
      continue;
    }
    
    console.log(`✅ Target OK: /blog/${slug} (Canonical & Robots verified)`);
    
    if (!checkTargetsOnly) {
      // Validate redirects (accept either 301 or 308)
      // 1. Guides path
      const guideUrl = `${baseUrl}/blog/guides/${slug}`;
      const guideCheck = await checkUrl(guideUrl, [301, 308]);
      
      const expectedLocation = `/blog/${slug}`;
      const expectedAbsoluteLocation = `https://www.singulariti.in/blog/${slug}`;
      
      const isGuideRedirectCorrect = guideCheck.success && (
        guideCheck.location === expectedLocation || 
        guideCheck.location === expectedAbsoluteLocation ||
        (guideCheck.location && guideCheck.location.endsWith(`/blog/${slug}`))
      );
      
      if (!isGuideRedirectCorrect) {
        console.error(`❌ FAILED: Redirect from ${guideUrl} returned status ${guideCheck.status} and location ${guideCheck.location} (expected 301/308 to ${expectedLocation})`);
        failedCount++;
        continue;
      }
      
      // 2. Articles path
      const articleUrl = `${baseUrl}/blog/articles/${slug}`;
      const articleCheck = await checkUrl(articleUrl, [301, 308]);
      const isArticleRedirectCorrect = articleCheck.success && (
        articleCheck.location === expectedLocation || 
        articleCheck.location === expectedAbsoluteLocation ||
        (articleCheck.location && articleCheck.location.endsWith(`/blog/${slug}`))
      );
      
      if (!isArticleRedirectCorrect) {
        console.error(`❌ FAILED: Redirect from ${articleUrl} returned status ${articleCheck.status} and location ${articleCheck.location} (expected 301/308 to ${expectedLocation})`);
        failedCount++;
        continue;
      }
      
      // 3. Category path (only if categorySlug exists and is present in the url)
      if (post.categorySlug) {
        const categoryUrl = `${baseUrl}/blog/${post.categorySlug}/${slug}`;
        const categoryCheck = await checkUrl(categoryUrl, [301, 308]);
        const isCategoryRedirectCorrect = categoryCheck.success && (
          categoryCheck.location === expectedLocation || 
          categoryCheck.location === expectedAbsoluteLocation ||
          (categoryCheck.location && categoryCheck.location.endsWith(`/blog/${slug}`))
        );
        
        if (!isCategoryRedirectCorrect) {
          console.error(`❌ FAILED: Redirect from ${categoryUrl} returned status ${categoryCheck.status} and location ${categoryCheck.location} (expected 301/308 to ${expectedLocation})`);
          failedCount++;
          continue;
        }
      }
      console.log(`✅ Redirects OK for: ${slug}`);
    }
    
    passedCount++;
  }
  
  console.log(`\n--- Validation Summary ---`);
  console.log(`Total Checked: ${posts.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  
  if (failedCount > 0) {
    console.error(`❌ Validation failed with ${failedCount} errors.`);
    process.exit(1);
  } else {
    console.log(`🎉 Validation completed successfully! All URLs are correct.`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unhandled error in validation script:', err);
  process.exit(1);
});
