const kafka = require('./kafka');
const { Consumer, Producer } = require('kafka-node');
const onUrl = require('./onUrl');

const TOPIC_NEW_URL = "NewUrl";
const TOPIC_NEW_CONTENT = "NewContent";
const CLIENT_RESPONSE = "ClientResponse";

const consumer = new Consumer(kafka, [{topic: TOPIC_NEW_URL}], {});
const producer = new Producer(kafka);

consumer.on('message', async message => {
    try {
        const value = JSON.parse(message.value);
        const content = await onUrl(value.url);
        if (content === false) {
            console.log(`${value.url} is not a tweet`)
            return;
        }
        console.log(`indexed ${value.url}`)
        const messages = JSON.stringify({
            type: "tweet",
            url: value.url,
            content
        });

        producer.send([{topic: TOPIC_NEW_CONTENT, messages, partition: 0}], (error, data) => {});
    } catch(e) {
        console.error(e);
    }
});
consumer.on('error', function (error) {
    console.error(error);
});

module.exports = {
    consumer,
    producer
};

