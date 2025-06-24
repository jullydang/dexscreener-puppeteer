const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeDexScreener() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    const url = 'https://dexscreener.com/solana';
    console.log(`🌐 Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // ⏳ Chờ thêm để đảm bảo JS render xong
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Debug HTML snapshot
    const html = await page.content();
    console.log('📄 PAGE HTML:\n', html.slice(0, 2000));

    // Đợi cho đến khi có ít nhất 1 hàng token
    await page.waitForFunction(() => {
      return document.querySelectorAll('table tbody tr').length > 0;
    }, { timeout: 90000 });

    // Trích xuất dữ liệu
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

    console.log('✅ Scraped Tokens:', data.slice(0, 5)); // in 5 dòng đầu
    await browser.close();
    return data;
  } catch (err) {
    console.error('❌ Error scraping:', err);
    await browser.close();
    throw err;
  }
}

module.exports = scrapeDexScreener;
