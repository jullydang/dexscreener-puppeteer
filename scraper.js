const puppeteer = require('puppeteer');

async function scrapeDexScreener() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Giả lập trình duyệt
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  try {
    const url = 'https://dexscreener.com/solana';
    console.log(`🌐 Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // ⏳ Chờ 8s (cách thủ công thay cho page.waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 8000));

    // In HTML để kiểm tra
    const html = await page.content();
    console.log('📄 PAGE SNAPSHOT:\n', html.slice(0, 2000));

    // Đợi có ít nhất 1 hàng xuất hiện
    await page.waitForFunction(() => {
      return document.querySelectorAll('table tbody tr').length > 0;
    }, { timeout: 90000 });

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

    console.log('✅ Scraped Tokens:', data.slice(0, 5));
    await browser.close();
    return data;

  } catch (err) {
    console.error('❌ Error during scraping:', err);
    await browser.close();
    throw err;
  }
}

module.exports = scrapeDexScreener;
