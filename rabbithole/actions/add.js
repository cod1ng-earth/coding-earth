const kafka = require("../lib/kafka");
const logger = require("../lib/logger");

const getMetaData = require("./getMetaData");

const TOPIC_NEW_CARROT = "NewCarrot";

const producer = kafka.producer();
producer.connect();

const add = async value => {
  // const matches = value.url.match("/*.twitter.com/(.*)/status/(.*)");
  console.log(`${value.url} goes into the rabbithole`);

  const validUrl = value.url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  const isTwitterUrl = value.url.match("/*.twitter.com(.*)");
  console.log(`is a url: ${validUrl}. is a twitter url: ${isTwitterUrl}`);

  if (validUrl && !isTwitterUrl) {
    try {
      const { iconUrlFavicon } = await getMetaData(value.url);

      console.log("favicon: " + iconUrlFavicon);

      const messages = JSON.stringify({
        type: "carrot",
        url: value.url,
        favicon: iconUrlFavicon
      });

      console.log("new messages: " + messages);

      await producer.send({
        topic: TOPIC_NEW_CARROT,
        messages: [{ value: messages }]
      });
    } catch (e) {
      logger.app.error(e);
    }
  } else {
    console.log(value.url + " is not an valid URL");
  }
};

module.exports = add;
