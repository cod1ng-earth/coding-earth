const elastic = require("../lib/elasticsearch");
const logger = require("../lib/logger");

const doIndex = async ({ type, url, favicon }) => {
  console.log(
    "Got Type " + type + " with URL " + url + "and favicon" + favicon
  );

  if (type !== "carrot") {
    console.log(type + " is not a carrot");
    return false;
  }
  try {
    console.log("writing to elastic search...");
    const result = await elastic.index({
      index: "carrots",
      id: Math.round(Math.random() * 10000),
      type: "carrot",
      body: { url, favicon }
    });

    console.log("Writing index: " + JSON.stringify(result));
    return result;
  } catch (e) {
    console.log("ups - your carrot got lost");
    console.log("Error: " + JSON.stringify(e, Object.getOwnPropertyNames(e)));
    logger.app.error(e);
    return false;
  }
};

module.exports = doIndex;
