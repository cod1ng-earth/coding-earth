const elastic = require("../lib/elasticsearch");
const logger = require("../lib/logger");

const findFavicon = async ({ type, url, content }) => {
  console.log("Got Type " + type + " with URL " + url);

  if (type !== "carrot") {
    console.log(type + " is not a carrot");
    return false;
  }
  try {
    const result = await elastic.index({
      index: "carrots",
      id: Math.round(Math.random() * 10000),
      type: "carrot",
      body: url
    });

    console.log("Writing index: " + JSON.stringify(result));
    return result;
  } catch (e) {
    logger.app.error(e);
    return false;
  }
};

module.exports = findFavicon;
