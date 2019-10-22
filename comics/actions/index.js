const kafka = require('../lib/kafka');
const logger = require('../lib/logger');

const add = require('./add');
const index = require('./doIndex')

const TOPIC_NEW_URL = "NewUrl";
const TOPIC_NEW_CONTENT = "NewContent";
const CLIENT_RESPONSE = "ClientResponse";

const consumer = kafka.consumer({ groupId: 'comics-group' })

const startListening = async () => {

    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC_NEW_URL })
    await consumer.subscribe({ topic: TOPIC_NEW_CONTENT })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            logger.app.info(`comic logger app info ${topic} ${message.value}`);
            try {
                const value = JSON.parse(message.value);

                if (value.type === 'tweet') {
                    const expandedURL = value.content.entities.urls && value.content.entities.urls.length > 0 && value.content.entities.urls[0].expanded_url;

                    if (expandedURL) {
                        const url = value.content.entities.media && value.content.entities.media.length > 0 && value.content.entities.media[0].media_url_https;
                        add({ url, guessedDomain: expandedURL });
                    }

                    return;
                }
                switch (topic) {
                    case TOPIC_NEW_URL:
                        add(value);
                        break;
                    case TOPIC_NEW_CONTENT:
                        index(value);
                        break;
                }
            } catch (e) {
                logger.app.error(e)
            }
        },
    })

    logger.app.info("started listening");
}

startListening();

module.exports = {
    consumer
};

