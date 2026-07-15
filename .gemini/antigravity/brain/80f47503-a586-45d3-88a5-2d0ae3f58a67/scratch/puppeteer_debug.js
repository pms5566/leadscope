const puppeteer = require('/Users/parmeetsingh/Desktop/AI Automation/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Log console errors from the page
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]: ${err.message}`);
  });

  const url = 'http://localhost:3000/preview/gym/scr-scx9y1d?name=Powerhouse%20Gym&phone=123&address=USA';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Wait another 3 seconds to let all timeouts fire
  console.log('Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Extract details about the header
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('#header');
    if (!header) return 'Header element #header not found!';
    
    const style = window.getComputedStyle(header);
    return {
      tagName: header.tagName,
      id: header.id,
      className: header.className,
      position: style.position,
      top: style.top,
      bottom: style.bottom,
      offsetHeight: header.offsetHeight,
      dataset: JSON.stringify(header.dataset),
      styleAttribute: header.getAttribute('style')
    };
  });
  
  console.log('--- HEADER INFO ---');
  console.log(JSON.stringify(headerInfo, null, 2));
  console.log('-------------------');
  
  await browser.close();
})();
