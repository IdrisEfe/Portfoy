const { chromium } = require("playwright");

async function inspect() {
  const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const results = [];
  for (const view of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: view.width, height: view.height } });
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `qa-${view.name}.png`, fullPage: true, animations: "disabled" });
    results.push({
      view: view.name,
      title: await page.title(),
      heading: await page.locator("h1").first().innerText(),
      bodyWidth: await page.evaluate(() => document.body.scrollWidth),
      viewportWidth: view.width,
      errors,
    });
    await page.close();
  }
  const interactionPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  interactionPage.setDefaultTimeout(8000);
  const interactionErrors = [];
  interactionPage.on("pageerror", (error) => interactionErrors.push(error.message));
  await interactionPage.goto(`${baseUrl}/laboratory`, { waitUntil: "domcontentloaded" });
  await interactionPage.waitForTimeout(800);
  await interactionPage.locator(".lab-card").first().click({ force: true });
  await interactionPage.waitForTimeout(300);
  await interactionPage.locator(".experiment-canvas").click({ position: { x: 420, y: 280 }, force: true });
  await interactionPage.screenshot({ path: "qa-target.png", fullPage: false, animations: "disabled" });
  await interactionPage.getByText("Unload").click({ force: true });
  await interactionPage.locator(".lab-card").nth(1).click({ force: true });
  const fluid = interactionPage.locator(".experiment-canvas");
  await fluid.hover({ position: { x: 200, y: 220 } });
  await interactionPage.mouse.move(750, 420, { steps: 30 });
  await interactionPage.waitForTimeout(500);
  await interactionPage.screenshot({ path: "qa-fluid.png", fullPage: false, animations: "disabled" });
  await interactionPage.getByText("Unload").click({ force: true });
  await interactionPage.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
  await interactionPage.waitForTimeout(800);
  results.push({ view: "admin-security", heading: await interactionPage.locator("h1").first().innerText(), errors: interactionErrors });
  await interactionPage.close();
  await browser.close();
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

inspect().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
