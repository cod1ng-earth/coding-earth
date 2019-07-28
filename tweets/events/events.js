const kafka = require('./kafka');
const { Consumer } = require('kafka-node');
const onUrl = require('./onUrl');

const TOPIC_NEW_URL = "NewUrl";

const topics = [
    {
        topic: TOPIC_NEW_URL,
        partitions: 1,
        replicationFactor: 1
    }
];

/**
 * starting a new consumer
 * @return {Promise<Consumer>}
 */
module.exports = new Promise( (resolve, reject) => {

    kafka.createTopics(topics, (error, result) => {
         // result is an array of any errors if a given topic could not be created
        if(error) { reject(error); }
        const consumer = new Consumer(
            kafka, [{topic: TOPIC_NEW_URL}], {}
        );

        consumer.on('message', message => {
            try {
                if (message.topic === TOPIC_NEW_URL) {
                    const value = JSON.parse(message.value);
                    onUrl(value);
                }
            } catch(e) {
                console.error(e);
            }
        });
        consumer.on('error', function (error) {
            throw error;
        });
        resolve(consumer)
    });
});

