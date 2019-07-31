const kafka = require('../lib/kafka');
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

kafka.on("ready", () => {
    consumer.on('message', async message => {
        try {
            const value = JSON.parse(message.value);
            switch (message.topic) {
                case TOPIC_NEW_URL: add(value); break;
                case TOPIC_NEW_CONTENT: index(value); break;
            }
        } catch (e) {
            console.error(e);
        }
    });

    consumer.on('error', function (error) {
        console.error(error);
    });
})

module.exports = {
    consumer
};

