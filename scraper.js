const puppeteer = require('puppeteer');

async function scrapeDexScreener() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://dexscreener.com/solana', { timeout: 60000 });

  try {
    await page.waitForSelector('table', { timeout: 60000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          name: cells[0]?.innerText.trim(),
          price: cells[1]?.innerText.trim(),
          volume: cells[4]?.innerText.trim()
        };
      });
    });

    console.log('✅ Scraped Data:', data);
  } catch (err) {
    console.error('❌ Error during scraping:', err);
  }

  await browser.close();
}

module.exports = scrapeDexScreener;
