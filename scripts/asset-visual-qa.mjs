import { chromium } from 'playwright';

const baseUrl = process.env.MVIS_URL ?? 'http://127.0.0.1:5177/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const issues = [];
page.on('console', message => {
  if (message.type() === 'error') issues.push(message.text());
});
page.on('pageerror', error => issues.push(error.message));

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Night inspection' }).waitFor({ timeout: 30000 });
await page.getByRole('button', { name: 'Night inspection' }).click();
await page.getByRole('button', { name: /Begin inspection/i }).click();
await page.getByRole('button', { name: /Open drone view/i }).waitFor({ timeout: 30000 });
await page.getByRole('button', { name: /Open drone view/i }).click();
await page.getByRole('button', { name: 'Drone inspection view' }).click();
await page.getByLabel('Train timeline').fill('0');
await page.getByRole('button', { name: 'Drone train-side view' }).click();
await page.waitForTimeout(3000);
await page.screenshot({ path: '/private/tmp/mvis-night-headlights.png', fullPage: true });

console.log(JSON.stringify({ issues }, null, 2));
await browser.close();
if (issues.length) process.exitCode = 1;
