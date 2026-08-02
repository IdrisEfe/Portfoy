const { chromium } = require("playwright");

async function run() {
  const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/laboratory`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await page.locator(".lab-card").first().click({ force: true });
  const target = page.locator(".experiment-canvas");
  await target.dispatchEvent("pointermove", { clientX: 500, clientY: 350 });
  await target.dispatchEvent("pointerdown", { clientX: 500, clientY: 350 });
  await target.press("Space");
  const targetPixels = await target.evaluate((canvas) => canvas.toDataURL().length);
  await page.getByText("Unload").click({ force: true });
  await page.locator(".lab-card").nth(1).click({ force: true });
  const fluid = page.locator(".experiment-canvas");
  const before = await fluid.evaluate((canvas) => canvas.toDataURL());
  for (let step = 0; step < 10; step += 1) await fluid.dispatchEvent("pointermove", { clientX: 250 + step * 45, clientY: 220 + Math.sin(step) * 100 });
  await page.waitForTimeout(700);
  const after = await fluid.evaluate((canvas) => canvas.toDataURL());
  await page.getByText("Unload").click({ force: true });
  await page.locator(".lab-card").nth(2).click({ force: true });
  const fireworks = page.locator(".experiment-canvas");
  await page.waitForTimeout(500);
  const fireworksIdle = await fireworks.getAttribute("data-active-particles");
  await fireworks.click({ position: { x: 500, y: 260 } });
  await page.waitForTimeout(100);
  const fireworksAfterClick = Number(await fireworks.getAttribute("data-active-particles"));
  await page.getByText("Unload").click({ force: true });
  await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const adminHeading = await page.locator("h1").first().innerText();
  await browser.close();
  process.stdout.write(`${JSON.stringify({ targetRendered: targetPixels > 1000, fluidChanged: before !== after, fireworksIdle: fireworksIdle === "0", fireworksAfterClick: fireworksAfterClick > 0, adminHeading, errors }, null, 2)}\n`);
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
