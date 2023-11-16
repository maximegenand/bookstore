const puppeteer = require("puppeteer");

const idSelect = "#desktopCategories";

const scrapperCategory = async (url) => {
  try {
    // Launch the browser and open a new blank page
    var browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Select nav categories
    const element = await page.waitForSelector(idSelect);
    // Select each li in the nav categories
    const totalCategories = await element.$$eval("li", (list) => {
      const o = new Object();
      // Map each li
      list.map((el) => {
        // Find the screen text
        const content = el.textContent.trim();
        if (!content) return;
        // Find the slug category with the url
        const slug = el
          .querySelector("a")
          .href.replace(/^.*\/([a-z-]+)$/, "$1");
        if (!slug) return;
        o[slug] = content;
      });
      return o;
    });

    // Print the json infos
    return JSON.stringify(totalCategories);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
};

module.exports = scrapperCategory;
