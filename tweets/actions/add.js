const kafka = require('../lib/kafka');
const logger = require('../lib/logger');

const Twitter = require('../lib/twitter');
const TOPIC_NEW_CONTENT = "NewContent";

const producer = kafka.producer()
producer.connect();

const add = async (value) => {
    const matches = value.url.match('/*\.twitter\.com/(.*)/status/(.*)');
    if (!matches) {
        logger.app.info(`${value.url} is not a tweet`)
        return false;
    }
    //const userId = matches[1];
    try {
        const twitter = await Twitter();
        const content = await twitter.get(`statuses/show`, {
            id: matches[2],
            tweet_mode: 'extended'
        });

        const messages = JSON.stringify({
            type: "tweet",
            url: value.url,
            content
        });

        await producer.send({
            topic: TOPIC_NEW_CONTENT,
            messages: [
                { value: messages },
            ],
        })

        return true
    } catch (e) {
        logger.app.error(e);
    }

}

module.exports = add;

