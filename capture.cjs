const { chromium } = require('C:/Users/Zerom/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4396');
  await page.locator('#hero-chart svg').waitFor();
  await page.screenshot({ path: __dirname + '/desktop.png', fullPage: true });
  await page.screenshot({ path: __dirname + '/hero.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: __dirname + '/mobile.png', fullPage: true });
  console.log('Saved desktop.png, hero.png, mobile.png');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
