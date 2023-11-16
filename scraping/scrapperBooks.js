const puppeteer = require("puppeteer");

const idSelect = "#valuable-books";

const scrapperBooks = async (url) => {
  try {
    // Launch the browser and open a new blank page
    var browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Select Books List
    const element = await page.waitForSelector(idSelect);
    // Select each tr in the book categories
    const totalBooks = await element.$$eval("tbody > tr", (list) => {
      const o = new Object();
      // Map each tr
      list.map((el) => {
        // Find the counter
        const counter = el.querySelector("td.counter").textContent.trim();
        if (!counter) return;
        // Find the infos
        const infos = el
          .querySelector("td.title p:first-of-type")
          .innerHTML.trim();
        if (!infos) return;
        const regexInfos =
          /^<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a> (?:de |d')([^<]+)<br>(?:<a [^>]*href="([^"]+)"[^>]*>)?([^-<]*)(?:<\/a>)? - ([^<]+)<br>([^<]+)<br>[^<]+<del>(.*)<\/del>/;
        const found = infos.match(regexInfos);
        if (!found) {
          o[counter] = { result: false, raw: infos };
          return;
        }
        const [
          ,
          url,
          title,
          author,
          urlEditor,
          editor,
          published,
          format,
          price,
        ] = found;
        o[counter] = {
          result: true,
          url,
          title,
          author,
          urlEditor,
          editor,
          published,
          format,
          price,
        };
      });
      return o;
    });

    // Print the json infos
    return JSON.stringify(totalBooks);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
};

module.exports = scrapperBooks;
