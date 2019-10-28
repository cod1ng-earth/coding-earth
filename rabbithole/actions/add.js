const kafka = require("../lib/kafka");
const logger = require("../lib/logger");

const getFavicon = require("./getFavicon");

const TOPIC_NEW_CARROT = "NewCarrot";

const producer = kafka.producer();
producer.connect();

const add = async value => {
  try {
    const { icon } = await getFavicon(value.url);

    console.log("favicon: " + icon);

    const messages = JSON.stringify({
      type: "carrot",
      url: value.url,
      icon: icon
    });

    console.log("new messages: " + messages);

    await producer.send({
      topic: TOPIC_NEW_CARROT,
      messages: [{ value: messages }]
    });
  } catch (e) {
    logger.app.error(e);
  }
}

module.exports = add;
