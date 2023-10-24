const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path')

function unique(data, uniqueField) {
  let uniqueArr = data.filter((item, index) => {
    return (
      data.findIndex((obj) => obj[uniqueField] === item[uniqueField]) === index
    );
  });
  return uniqueArr;
}



const url = (page) => `https://wallpaperscraft.com/catalog/anime/1080x1920/page${page}`; // 替换为你要爬取的网页地址

const generateData = (url) => {
  axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      const data = [];

      // 使用适当的选择器来获取图片元素
      $('.wallpapers__image').each((index, element) => {
        const imageUrl = $(element).attr('src');
        if (imageUrl) {
          data.push({
            url: imageUrl,
            width: 1080,
            height: 1920,
            big_url: imageUrl.replace(/_([0-9]{3})x([0-9]{3})/, '_1080x1920'),
          });
        }
      });
      $('.wallpapers__link').each((index, element) => {
        const description = $(element).find('span:nth-child(3)').text();
        if (description) {
          data[index].description = description
        }
      });

      console.log(url, 'urlurlrul---------------');

      const filePath = path.join(__dirname, '..', 'data_json', 'data.json');

      fs.readFile(filePath, 'utf8', (err, oldData) => {
        if (err) {
          console.error('An error occurred while reading the file:', err);
          return;
        }
        const jsonData = JSON.parse(oldData);

        // const newJsonData = unique(jsonData.concat(data), 'url');
        const newJsonData = jsonData.concat(data);

        const jsonContent = JSON.stringify(newJsonData, null, 2);

        fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
          if (err) {
            console.error('An error occurred while writing JSON object to file:', err);
            return;
          }
          console.log('JSON file has been saved.');
        });


      });


    })
    .catch(error => {
      console.error('Error:', error);
    });
}
let count = 0
const timer = setInterval(() => {
  if (count > 10) clearInterval(timer)
  count++
  generateData(url(count))
}, 500);