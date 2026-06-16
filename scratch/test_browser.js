const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER LOG:', msg.text());
  });

  await page.goto('http://localhost:3000/tools/editing/certificate-editor');
  
  // Wait for the page/dashboard to load
  await page.waitForTimeout(1000);
  
  // Click on "Classic Navy"
  // According to the DOM, it contains text "Classic Navy"
  await page.click('text=Classic Navy');
  
  // Wait for 2 seconds
  await page.waitForTimeout(2000);
  
  await browser.close();
}

main().catch(err => console.error(err));
