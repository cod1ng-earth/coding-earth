const elastic = require("../lib/elasticsearch");
const logger = require("../lib/logger");

const index = async ({ type, url, content }) => {
  if (type !== "carrot") return false;
  try {
    const result = await elastic.index({
      index: "carrot",
      type: "carrot",
      url: url
    });
    return result;
  } catch (e) {
    logger.app.error(e);
    return false;
  }
};

module.exports = index;
