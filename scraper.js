const puppeteer = require('puppeteer');

async function scrapeDexScreener() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto('https://dexscreener.com/solana', { waitUntil: 'networkidle2' });

  await page.waitForSelector('table', { timeout: 60000 });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    return rows.map(row => {
      const cols = row.querySelectorAll('td');
      return Array.from(cols).map(col => col.innerText.trim());
    });
  });

  await browser.close();
  return data;
}

module.exports = scrapeDexScreener;
