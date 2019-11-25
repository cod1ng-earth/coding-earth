const logger = require('../lib/logger');
const cheerio = require('cheerio');
const axios = require('axios');

function extractImageSrc($image) {
    if ($image) {
        try {
            return $image.attr('src');
        } catch (e) {
            logger.app.error('Couldnt extract image source', e);
        }
    }
    return null;
}

async function handleUrl(url, domain) {
    const urlResponse = await axios.get(url);
    const $ = cheerio.load(urlResponse.data);
    const handler = handlers[domain];

    const $imageElement = await handler($);
    return extractImageSrc($imageElement);
}

async function turnOffHandler($) {
    const img = $('.post-content>p>img');
    img.attr('src', 'http://turnoff.us' + img.attr('src'));
    return img;
}

async function ohNoHandler($) {
    return $('.tmblr-full>img');
}

async function xkcdHandler($) {
    return $('#comic>img');
}

async function commitStripHandler($) {
    return $('.entry-content>p>img');
}

async function monkeyUserHandler($) {
    return $('.content>p>img');
}

const handlers = {
    'www.monkeyuser.com': monkeyUserHandler,
    'www.commitstrip.com': commitStripHandler,
    'xkcd.com': xkcdHandler,
    'imgs.xkcd.com': console.log,
    'webcomicname.com': ohNoHandler,
    'theohnoshop.com': console.log,
    'turnoff.us': turnOffHandler
}

module.exports = {
    handleUrl,
    weSupport: (hostname) => Object.keys(handlers).includes(hostname)
};