const { weSupport, handleUrl } = require("./handlers");
const kafka = require('../lib/kafka');
const logger = require('../lib/logger');

const TOPIC_NEW_CONTENT = "NewContent";

const producer = kafka.producer()
producer.connect();

function isImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

const add = async ({ url }) => {
    const domain = new URL(url).hostname
    if (!domain) {
        return false;
    }
    if (!weSupport(domain)) {
        logger.app.debug(`${url} is not supported`);
        return false;
    }

    let imageUrl;
    if (isImageURL(url)) {
        imageUrl = url
        logger.app.info('found a plain url', url);
    } else {
        imageUrl = await handleUrl(url, domain)
    }
    if (!imageUrl) {
        return false
    }

    const messages = JSON.stringify({
        type: "comics",
        url,
        content: { url: imageUrl }
    });

    const data = await producer.send({
        topic: TOPIC_NEW_CONTENT,
        messages: [
            { value: messages },
        ],
    });
    return true


}

module.exports = add;

