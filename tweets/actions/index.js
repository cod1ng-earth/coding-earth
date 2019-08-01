const kafka = require('../lib/kafka');
const logger = require('../lib/logger');

const { Consumer } = require('kafka-node');

const add = require('./add');
const index = require('./doIndex')

const TOPIC_NEW_URL = "NewUrl";
const TOPIC_NEW_CONTENT = "NewContent";
const CLIENT_RESPONSE = "ClientResponse";

const consumer = new Consumer(kafka, [
    {topic: TOPIC_NEW_URL},
    {topic: TOPIC_NEW_CONTENT},
], {});

const startListening = () => {
    consumer.on('message', async message => {
        try {
            const value = JSON.parse(message.value);
            switch (message.topic) {
                case TOPIC_NEW_URL: add(value); break;
                case TOPIC_NEW_CONTENT: index(value); break;
            }
        } catch (e) {
            logger.error(e)
        }
    });

    consumer.on('error', function (error) {
        logger.error(e)
    });

    logger.info("started listening");
}
kafka.on("ready", startListening);
kafka.on("reconnect", ()=> {logger.info(e); consumer.close(startListening) })
kafka.on("error", (e)=> {logger.error(e); consumer.close(startListening) })
kafka.on("socket_error", (e)=> {logger.info(e); consumer.close(startListening) })
kafka.on("close", (e)=> {logger.error(e); consumer.close(startListening) })

module.exports = {
    consumer
};

