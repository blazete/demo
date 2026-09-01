import { chromium } from 'playwright';

const baseUrl = process.env.MVIS_URL ?? 'http://127.0.0.1:5177/';
const browser = await chromium.launch({ headless: true });
const issues = [];
const failedRequests = [];

function monitor(page) {
  page.on('console', message => {
    if (message.type() === 'error') issues.push(message.text());
  });
  page.on('pageerror', error => issues.push(error.message));
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`));
}

const dayPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
monitor(dayPage);
await dayPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await dayPage.getByRole('button', { name: /Begin inspection/i }).waitFor({ timeout: 30000 });
await dayPage.getByRole('button', { name: /Begin inspection/i }).click();
await dayPage.getByRole('button', { name: /Open drone view/i }).waitFor({ timeout: 30000 });
await dayPage.getByRole('button', { name: /Open drone view/i }).click();
await dayPage.getByRole('button', { name: 'Whole site view' }).click();
await dayPage.waitForTimeout(3000);
await dayPage.locator('canvas').click({ position: { x: 800, y: 500 } });
await dayPage.keyboard.down('KeyD');
await dayPage.waitForTimeout(2800);
await dayPage.keyboard.up('KeyD');
await dayPage.keyboard.down('KeyS');
await dayPage.waitForTimeout(1300);
await dayPage.keyboard.up('KeyS');
await dayPage.mouse.wheel(0, 450);
await dayPage.waitForTimeout(800);
await dayPage.screenshot({ path: '/private/tmp/mvis-corrected-office.png', fullPage: true });

await dayPage.getByRole('button', { name: /Open site equipment/i }).click();
await dayPage.locator('.mvis-equipment-menu button').filter({ hasText: 'CAM-5' }).click();
await dayPage.getByLabel(/CAM-5 Under-track Line Scan.*information/i).waitFor({ timeout: 10000 });
await dayPage.locator('.mvis-inspector-actions button').filter({ hasText: 'Locate' }).click();
await dayPage.waitForTimeout(2500);
await dayPage.screenshot({ path: '/private/tmp/mvis-corrected-cam5.png', fullPage: true });

const nightPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
monitor(nightPage);
await nightPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await nightPage.getByRole('button', { name: 'Night inspection' }).waitFor({ timeout: 30000 });
await nightPage.getByRole('button', { name: 'Night inspection' }).click();
await nightPage.getByRole('button', { name: /Begin inspection/i }).click();
await nightPage.getByRole('button', { name: /Open drone view/i }).waitFor({ timeout: 30000 });
await nightPage.getByRole('button', { name: /Open drone view/i }).click();
await nightPage.getByLabel('Train timeline').fill('0');
await nightPage.getByRole('button', { name: 'Drone train-side view' }).click({ force: true });
await nightPage.waitForTimeout(3000);
await nightPage.screenshot({ path: '/private/tmp/mvis-night-headlights.png', fullPage: true });

console.log(JSON.stringify({ issues, failedRequests }, null, 2));
await browser.close();
if (issues.length || failedRequests.length) process.exitCode = 1;
