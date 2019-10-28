const kafka = require("../lib/kafka");
const logger = require("../lib/logger");

const add = require("./add");
const doIndex = require("./doIndex");

const TOPIC_NEW_URL = "NewUrl";
const TOPIC_NEW_CARROT = "NewCarrot";
const CLIENT_RESPONSE = "ClientResponse";

const consumer = kafka.consumer({ groupId: "carrots-group" });

const startListening = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_NEW_URL });
  await consumer.subscribe({ topic: TOPIC_NEW_CARROT });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `The topic is ${topic} and the msg value is ${message.value}`
      );
      try {
        const value = JSON.parse(message.value);
        switch (topic) {
          case TOPIC_NEW_URL:
            add(value);
            break;
          case TOPIC_NEW_CARROT:
            doIndex(value);
            break;
        }
      } catch (e) {
        logger.app.error(e);
      }
    }
  });

  logger.app.info("started listening");
};

startListening();

module.exports = {
  consumer
};
