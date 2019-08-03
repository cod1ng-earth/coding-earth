const whiteListDomains = require("./white-list");

const kafka = require('../lib/kafka');
const logger = require('../lib/logger');
const TOPIC_NEW_CONTENT = "NewContent";

const producer = kafka.producer()
producer.connect();
const add = async (value) => {
    const url = value.url;
    let domain = '';
    try {
        domain = new URL(url).hostname;

    } catch (e) {
        console.log('error parsing url', e);
        return false;
    }
    if (!domain) {
        console.log('NOT FUNNY');
        return false;
    }

    if (whiteListDomains.has(domain)) {

        const imageUrl =  await whiteListDomains.get(domain)(url);
        if (!imageUrl) {
            logger.app.info('no valid image found');
            return null;
        }
        console.log('image url to comic is ', imageUrl);
        const messages = JSON.stringify({
            type: "comics",
            url,
            content: {url: imageUrl}
        });

        const data = await producer.send({
            topic: TOPIC_NEW_CONTENT,
            messages: [
                {value: messages},
            ],
        });
        logger.app.info(data);

    } else {
        console.log('INVALID DOMAIN');
    }

}

module.exports = add;

