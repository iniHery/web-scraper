// const axios = require("axios");
// const cheerio = require("cheerio");

// const website = "https://news.ycombinator.com/";

// const fetchTitles = async () => {
//   try {
//     const response = await axios.get(website);
//     const html = response.data;
//     const $ = cheerio.load(html);
//     const titles = [];

//     $(".title").each((index, element) => {
//       const title = $(element).text();
//       titles.push(title);
//     });

//     titles.forEach((title, index) => {
//       console.log(`${index + 1}. ${title}`);
//     });
//   } catch (error) {
//     console.log("An error occurred:", error.message);
//   }
// };

// fetchTitles();

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const website = "https://www.detik.com/";

const fetchTitlesAndLinks = async () => {
  try {
    const response = await axios.get(website);
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];

    // Menggunakan selector yang benar untuk artikel
    $(".list-content__item .media__title a").each((index, element) => {
      const title = $(element).text().trim(); // Menghapus spasi di awal dan akhir
      const link = $(element).attr("href"); // Mendapatkan atribut href
      articles.push({ title, link });
    });

    // Mencari panjang maksimal untuk setiap kolom
    const maxNumberLength = String(articles.length).length;
    const maxTitleLength = articles.reduce(
      (max, article) => Math.max(max, article.title.length),
      0
    );
    const maxLinkLength = articles.reduce(
      (max, article) => Math.max(max, article.link.length),
      0
    );

    // Membuat data CSV dengan header
    let csvContent = "Number,Title,Link\n";
    articles.forEach((article, index) => {
      // Menggunakan escape pada tanda kutip untuk kompatibilitas CSV
      const number = String(index + 1).padEnd(maxNumberLength, " ");
      const title = article.title
        .replace(/"/g, '""')
        .padEnd(maxTitleLength, " ");
      const link = article.link.padEnd(maxLinkLength, " ");
      csvContent += `${number},${title},${link}\n`;
    });

    // Menyimpan data CSV ke dalam file
    fs.writeFileSync("detik-com.csv", csvContent);
    console.log("Titles and links saved to detik-com.csv");
  } catch (error) {
    console.log("An error occurred:", error.message);
  }
};

fetchTitlesAndLinks();
