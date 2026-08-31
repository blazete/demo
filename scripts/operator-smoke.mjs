import { chromium } from 'playwright';

const baseUrl = process.env.MVIS_URL ?? 'http://127.0.0.1:5176/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const checks = [];
const issues = [];
const failedRequests = [];
const check = (name, pass, detail = '') => checks.push({ name, pass, detail });

page.on('console', message => {
  if (!['error', 'warning'].includes(message.type())) return;
  if (message.text().includes('GPU stall due to ReadPixels')) return;
  issues.push(`${message.type()}: ${message.text()}`);
});
page.on('pageerror', error => issues.push(`pageerror: ${error.message}`));
page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`));

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
check('page identity', (await page.title()).includes('MVIS'));
await page.getByRole('button', { name: /Begin inspection/i }).waitFor({ timeout: 30000 });
await page.getByRole('button', { name: /Begin inspection/i }).click();
await page.getByRole('button', { name: /Open drone view/i }).waitFor({ timeout: 30000 });
await page.getByRole('button', { name: /Open drone view/i }).click();
check('explore panel opens', await page.locator('.mvis-drone-panel').isVisible());

await page.getByRole('button', { name: /Open site equipment/i }).click();
check('equipment menu opens', await page.getByRole('complementary', { name: /Site equipment menu/i }).isVisible());
await page.locator('.mvis-equipment-menu button').filter({ hasText: 'CAM-1' }).click();
check('CAM-1 compact preview', await page.getByLabel(/CAM-1 Upper Area Scan.*information/i).isVisible() && await page.getByText(/SIMULATED CAMERA POV/i).isVisible());
await page.getByRole('button', { name: /Open Full POV/i }).click();
check('CAM-1 full POV', await page.getByLabel(/CAM-1 Upper Area Scan.*full point of view/i).isVisible());
await page.getByRole('button', { name: /Return to Site/i }).click();
check('return from POV', await page.getByLabel(/CAM-1 Upper Area Scan.*information/i).isVisible());

await page.getByRole('button', { name: /Open site equipment/i }).click();
await page.locator('.mvis-equipment-menu button').filter({ hasText: 'CAM-5' }).click();
check('CAM-5 line-scan preview', await page.locator('.mvis-simulated-feed.line-scan').isVisible() && await page.getByText(/TRAIN MOVEMENT/i).isVisible());

await page.getByRole('button', { name: /Open site equipment/i }).click();
await page.locator('.mvis-equipment-menu button').filter({ hasText: 'Track LEDs' }).click();
await page.getByRole('button', { name: /Switch lights off/i }).click();
check('lighting toggles off', await page.getByRole('button', { name: /Switch lights on/i }).isVisible());
await page.getByRole('button', { name: /Switch lights on/i }).click();

await page.getByRole('button', { name: /Open site equipment/i }).click();
await page.locator('.mvis-equipment-menu button').filter({ hasText: 'Entry Sensor' }).click();
await page.getByRole('button', { name: /Trigger sequence/i }).click();
check('sensor trigger available', await page.getByRole('button', { name: /Trigger sequence/i }).isVisible());

await page.locator('canvas').hover({ position: { x: 800, y: 400 } });
await page.mouse.wheel(0, -900);
await page.waitForTimeout(500);
await page.getByRole('button', { name: 'Whole site view' }).click();
check('whole-site reset available', await page.getByRole('button', { name: 'Whole site view' }).isVisible());
await page.screenshot({ path: '/private/tmp/mvis-operator-desktop.png', fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: /Open site equipment/i }).click();
await page.locator('.mvis-equipment-menu button').filter({ hasText: 'CAM-3' }).click();
await page.waitForTimeout(1100);
check('mobile inspector fits', await page.locator('.mvis-equipment-inspector').evaluate(element => {
  const rect = element.getBoundingClientRect();
  return rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight && rect.top >= 0;
}));
await page.screenshot({ path: '/private/tmp/mvis-operator-mobile.png', fullPage: true });

check('no failed requests', failedRequests.length === 0, failedRequests.join(' | '));
check('console health', issues.length === 0, issues.join(' | '));
check('no framework overlay', await page.locator('vite-error-overlay').count() === 0);

console.log(JSON.stringify({ checks, issues, failedRequests }, null, 2));
await browser.close();

if (checks.some(item => !item.pass)) process.exitCode = 1;
