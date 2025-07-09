const chromium = require('chrome-aws-lambda');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/announcements', async (req, res) => {
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://www.nseindia.com/api/corporate-announcements?index=equities', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const content = await page.evaluate(() => {
      return JSON.parse(document.querySelector('pre')?.innerText || '{}');
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  } finally {
    if (browser !== null) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
