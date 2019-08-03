const kafka = require("../lib/kafka");
const logger = require("../lib/logger");

const TOPIC_NEW_CARROT= "NewCarrot";

const producer = kafka.producer();
producer.connect();

const add = async value => {
  // const matches = value.url.match("/*.twitter.com/(.*)/status/(.*)");
  console.log(`${value.url} goes into the rabbithole`);

  try {
    const messages = JSON.stringify({
      type: "carrot",
      url: value.url
    });
    console.log("type: " + messages);

    await producer.send({
      topic: TOPIC_NEW_CARROT,
      messages: [{ value: messages }]
    });
  } catch (e) {
    logger.app.error(e);
  }
};

module.exports = add;
