const scrapperCategory = require("./scrapperCategory");
const scrapperBooks = require("./scrapperBooks");
const isbn = require("./modules/isbn");

const url = "https://www.chasse-aux-livres.fr/best-sellers";
const isbnCode = "2014001332";

(async () => {
  // Fetch des categories
  /*
  const categories = await scrapperCategory(url);
  console.log(categories);

  const result = await isbn(isbnCode);
  console.log(result);
  */

  const books = await scrapperBooks(url);
  console.log(books);
})();
