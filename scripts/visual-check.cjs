const { chromium } = require("playwright");

async function inspect() {
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
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
    await page.screenshot({ path: `qa-${view.name}.png`, fullPage: true });
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
  await browser.close();
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

inspect().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
