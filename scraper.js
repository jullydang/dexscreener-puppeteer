const puppeteer = require('puppeteer');

async function scrapeDexScreener() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    const url = 'https://dexscreener.com/solana';
    console.log(`🧭 Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Chờ thêm cho JS render (nếu cần)
    await page.waitForTimeout(10000); // chờ 10s

    // Đợi table xuất hiện
    console.log('⏳ Waiting for <table> to load...');
    await page.waitForSelector('table', { timeout: 90000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          name: cells[0]?.innerText || '',
          price: cells[1]?.innerText || '',
          change: cells[2]?.innerText || ''
        };
      });
    });

    console.log('✅ Scraped data:', data.slice(0, 5)); // in 5 dòng đầu
    await browser.close();
    return data;
  } catch (error) {
    console.error('❌ Error scraping:', error);

    // In HTML nếu gặp lỗi để debug
    const html = await page.content();
    console.log('📄 Page HTML Snapshot:\n', html.slice(0, 2000)); // in 2000 ký tự đầu

    await browser.close();
    throw error;
  }
}

module.exports = { scrapeDexScreener };
