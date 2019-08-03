const elastic = require("../lib/elasticsearch");
const logger = require("../lib/logger");

const findFavicon = async ({ type, url, content }) => {
    console.log("Got Type " + type + " with URL " + url);

  // if (type !== "carrot") return false;
  // try {
  //   const result = await elastic.index({
  //     index: "carrot",
  //     type: "carrot",
  //     url: url
  //   });
  //   return result;
  // } catch (e) {
  //   logger.app.error(e);
  //   return false;
  // }
};

module.exports = findFavicon;
