const whiteListDomains = require("./white-list");
const kafka = require('../lib/kafka');
const logger = require('../lib/logger');
const cheerio = require('cheerio');
const axios = require('axios');
const TOPIC_NEW_CONTENT = "NewContent";

const producer = kafka.producer()
producer.connect();

function isImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

async function getDOM(url) {
    const urlResponse = await axios.get(url);
    return await cheerio.load(urlResponse.data);
}

function extractImageSrc(image) {
    if (image) {
        try {
            const src = image.attr('src');
            console.log('response data image', image.attr('src'));
            return {url: image.attr('src'), tags: []};
        } catch (e) {
            logger.app.error('Error with image', e);
        }
    }
    return {url: '', tags: ''};

}


const add = async (value) => {
    const url = value.url;
    let domain = '';
    try {
        domain = value.guessedDomain ? new URL(value.guessedDomain).hostname : new URL(url).hostname;

    } catch (e) {
        console.log('error parsing url', e);
        return false;
    }

    if (!domain) {
        console.log('NOT FUNNY');
        return false;
    }

    if (whiteListDomains.has(domain)) {

        let imageData;
        if (isImageURL(url)) {
            imageData = {
                url,
                tags: []
            };
            logger.app.info('found an url', url);

        } else {
            const dom = await getDOM(url);
            const imageElement = await whiteListDomains.get(domain)(dom);
            imageData = extractImageSrc(imageElement);
            if (!imageData.url) {
                logger.app.info('no valid image found');
                return null;
            }
        }

        const messages = JSON.stringify({
            type: "comics",
            url,
            content: {url: imageData.url}
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

