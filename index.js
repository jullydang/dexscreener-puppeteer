const scrapeDexScreener = require('./scraper');

(async () => {
  try {
    await scrapeDexScreener();
    console.log('✅ Scraping complete');
  } catch (err) {
    console.error('❌ Error scraping:', err);
  }
})();
