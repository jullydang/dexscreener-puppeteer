const scrapeDexScreener = require('./scraper');

(async () => {
  try {
    const data = await scrapeDexScreener();
    console.log('✅ Scraped Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error scraping:', err);
  }
})();
