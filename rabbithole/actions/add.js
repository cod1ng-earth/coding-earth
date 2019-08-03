const kafka = require("../lib/kafka");
const logger = require("../lib/logger");

const Twitter = require("../lib/twitter");
const TOPIC_NEW_CONTENT = "NewContent";

const producer = kafka.producer();
producer.connect();

const add = async value => {
  const matches = value.url.match("/*.twitter.com/(.*)/status/(.*)");
  if (matches) {
    console.log(`${value.url} is a tweet`);
    return false;
  }

  console.log(`${value.url} goes into the rabbithole`);

  try {
    const messages = JSON.stringify({
      type: "carrot",
      url: value.url
    });
    await producer.send({
      topic: TOPIC_NEW_CONTENT,
      messages: [{ value: messages }]
    });
  } catch (e) {
    logger.app.error(e);
  }
};

module.exports = add;
