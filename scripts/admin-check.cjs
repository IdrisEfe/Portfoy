const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3000/admin", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".admin-header", { timeout: 15000 });
  const heading = await page.locator("h1").first().innerText();
  const tabs = await page.locator(".admin-layout > nav button").allInnerTexts();
  await page.getByText("Save draft").click();
  await page.getByText("Preview").click();
  const previewVisible = await page.locator(".admin-preview").isVisible();
  await browser.close();
  process.stdout.write(`${JSON.stringify({ heading, tabs, previewVisible, errors }, null, 2)}\n`);
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
