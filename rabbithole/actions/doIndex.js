const elastic = require("../lib/elasticsearch");
const logger = require("../lib/logger");

const doIndex = async ({ type, url, icon }) => {
  console.log(
    "Got Type " + type + " with URL " + url + "and icon " + icon
  );

  if (type !== "carrot") {
    console.log(type + " is not a carrot");
    return false;
  }
  try {
    console.log("writing to elasticsearch...");
    const result = await elastic.index({
      index: "carrots",
      //id: Math.round(Math.random() * 10000),
      type: "carrot",
      body: { url, icon }
    });
    console.log("written.");
    return result
  } catch (e) {
    console.err("Error: " + JSON.stringify(e, Object.getOwnPropertyNames(e)));
    return false;
  }
};

module.exports = doIndex;
