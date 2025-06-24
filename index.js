const scrapeDexScreener = require('./scraper');

(async () => {
  try {
    await scrapeDexScreener();
  } catch (err) {
    console.error('❌ Error scraping:', err);
  }
})();
