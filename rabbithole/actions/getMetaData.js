const https = require("https");
const getFavicons = require('get-website-favicon')


const getMetaData = async url => {

  getFavicons(url).then(data => {
    console.log("ICON DATA 1: " + JSON.stringify(data));
    const iconUrl = data.icons[0].src;
    console.log("ICON URL 1: " + iconUrl);
  });

  getFavicons('github.com').then(data => {
    const iconUrl = data.icons[0].src;
    console.log("ICON URL github: " + iconUrl);
  });

  // https
  //   .get(url, res => {
  //     let data = "";

  //     res.on("data", chunk => {
  //       data += chunk;
  //     });

  //     res.on("end", () => {
  //       console.log("End of logging");

  //       const dom = new JSDOM(data);
  //       const doc = dom.window.document;
  //       const linkElement = doc.querySelector('[type="image/x-icon"]');
  //       console.log('queryselector1: ' + JSON.stringify(doc.querySelector("link"))); 
  //       console.log('queryselector2: ' + JSON.stringify(linkElement)); 
  //       console.log('queryselector3: ' + linkElement.href); 

  //     });
  //   })
  //   .on("error", err => {
  //     console.log("Error: " + err.message);
  //   });
};

module.exports = getMetaData;
