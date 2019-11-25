const kafka = require('../lib/kafka');
const logger = require('../lib/logger');
const getExpandedUrl = require('../lib/getExpandedUrl')

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

                switch (topic) {
                    case TOPIC_NEW_URL:
                        add(value);
                        break;
                    case TOPIC_NEW_CONTENT:
                        if (value.type === 'tweet') {
                            url = getExpandedUrl(value)
                            add({ url });
                        }

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

module.exports = {
    startListening
};

