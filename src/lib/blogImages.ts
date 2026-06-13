/**
 * Blog image utility mapping to handle post images and fallback styled placeholders.
 */

export function getBlogImage(post: {
  slug: string;
  title: string;
  category?: string;
  image?: string;
}): string {
  if (post.image) return post.image;

  const slug = post.slug.toLowerCase();
  const category = post.category?.toLowerCase() ?? "";

  // Exact slug-based mappings for high-traffic articles
  const exactSlugMap: Record<string, string> = {
    "compress-pdf": "placeholder:pdf",
    "compress-pdf-guide": "placeholder:pdf",
    "image-compressor": "placeholder:image",
    "image-compressor-guide": "placeholder:image",
    "json-formatter": "placeholder:developer",
    "json-formatter-guide": "placeholder:developer",
    "qr-code-generator": "placeholder:qr",
    "qr-code-generator-guide": "placeholder:qr",
    "word-counter": "placeholder:text",
    "word-counter-guide": "placeholder:text",
    "why-online-utility-tools-are-useful": "placeholder:general",
    "who-can-use-singulariti": "placeholder:general",
  };

  if (exactSlugMap[slug]) {
    return exactSlugMap[slug];
  }

  // Category-based mappings
  if (category.includes("pdf")) return "placeholder:pdf";
  if (category.includes("image") || category.includes("editing")) return "placeholder:image";
  if (category.includes("text")) return "placeholder:text";
  if (category.includes("dev") || category.includes("code")) return "placeholder:developer";
  if (category.includes("seo")) return "placeholder:seo";
  if (category.includes("qr")) return "placeholder:qr";
  if (category.includes("calc")) return "placeholder:calculators";
  if (category.includes("prod")) return "placeholder:productivity";
  if (category.includes("general")) return "placeholder:general";

  // Hashed fallback based on slug to ensure stable and distributed placeholder types
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbacks = ["pdf", "image", "text", "developer", "seo", "qr", "calculators", "productivity", "general"];
  const fallbackType = fallbacks[hash % fallbacks.length];

  return `placeholder:${fallbackType}`;
}
