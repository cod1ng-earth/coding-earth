const https = require("https");

const getMetaData = async url => {
  https
    .get(url, res => {
      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(data);
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
};

module.exports = getMetaData;
