const https = require("https");
const { JSDOM } = require("jsdom");

const getMetaData = async url => {
  https
    .get(url, res => {
      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("End of logging");

        const dom = new JSDOM(data);
        const doc = dom.window.document;
        console.log('queryselector1: ' + JSON.stringify(doc.querySelector("link"))); 
        console.log('queryselector2: ' + JSON.stringify(doc.querySelector('[type="image/x-icon"]'))); 
       // console.log('elemByAttr: ' + doc.findElementByAttribute("type", "image/x-icon")); 
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
};

module.exports = getMetaData;
