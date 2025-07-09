// 📦 NSE Announcements Proxy (Node.js + Express + Puppeteer)

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/announcements', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0',
      'Accept': '*/*'
    });

    await page.goto('https://www.nseindia.com/api/corporate-announcements?index=equities', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const content = await page.evaluate(() => {
      return JSON.parse(document.querySelector('pre')?.innerText || '{}');
    });

    await browser.close();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
