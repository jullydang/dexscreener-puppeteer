const puppeteer = require('puppeteer');
const axios = require('axios');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://dexscreener.com/solana?rankBy=trendingScoreH6&order=desc&minLiq=1000&minMarketCap=10000&minAge=240&min24HTxns=50&min5MChg=5&profile=1', {
    waitUntil: 'networkidle2'
  });

  await page.waitForSelector('table');

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.map(row => {
      const cols = row.querySelectorAll('td');
      return {
        name: cols[0]?.innerText,
        price: cols[2]?.innerText,
        txns: cols[5]?.innerText,
        change5m: cols[6]?.innerText,
        link: row.querySelector('a')?.href
      };
    });
  });

  console.log(`✅ Scraped ${data.length} tokens`);
  console.log(data);

  // Optionally: send to n8n webhook
  // await axios.post('https://n8nhosting-19287983.phoai.vn/webhook/solana-token', data);

  await browser.close();
}

module.exports = run;
