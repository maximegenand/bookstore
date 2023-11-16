const isbn = async (isbnBrut) => {
  const isbnClean = isbnBrut.replace(/-/g, "").trim();
  if (
    (isbnClean.length !== 10 && isbnClean.length !== 13) ||
    /[^0-9X]/i.test(isbnClean)
  )
    return `Error: Bad ISBN (${isbnBrut})`;

  const body = new FormData();
  body.append("request_data", '{"isbn":"' + isbnBrut + '"}');
  body.append("request_code", "isbn_convert");

  const dataFetch = await fetch("https://isbn.org/xmljson.php", {
    method: "POST",
    body,
  });

  const data = await dataFetch.json();
  if (!data.results) return "Fetch error";

  const { converted_isbn: isbnConverted, isbn: isbnOriginal } = data.results;
  if (isbnConverted.includes("Bad ISBN"))
    return `Error: Bad ISBN (${isbnBrut})`;

  const result = {
    isbn10: isbnClean.length === 10 ? isbnOriginal : isbnConverted,
    isbn13: isbnClean.length === 13 ? isbnOriginal : isbnConverted,
  };
  return result;
};

module.exports = isbn;
