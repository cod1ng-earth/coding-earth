const { Producer } = require('kafka-node');
const kafka = require('../lib/kafka');

const Twitter = require('../lib/twitter');
const TOPIC_NEW_CONTENT = "NewContent";

const producer = new Producer(kafka);

const add = async (value) => {
    const matches = value.url.match('/*\.twitter\.com/(.*)/status/(.*)');
    if (!matches) {
        console.log(`${value.url} is not a tweet`)
        return false;
    }
    //const userId = matches[1];
    const twitter = await Twitter;
    const content = await twitter.get(`statuses/show`, {
        id: matches[2],
        tweet_mode: 'extended'
    });

    const messages = JSON.stringify({
        type: "tweet",
        url: value.url,
        content
    });

    producer.send([{topic: TOPIC_NEW_CONTENT, messages, partition: 0}], (error, data) => {});
}

module.exports = add;

