const logger = require('../lib/logger');

const whiteListDomains = new Map();
whiteListDomains.set('www.monkeyuser.com', async ($) => monkeyUserHandler($));
whiteListDomains.set('www.commitstrip.com', async ($) => commitStripHandler($));
whiteListDomains.set('xkcd.com', async ($) => xkcdHandler($));
whiteListDomains.set('imgs.xkcd.com', async ($) => console.log($));
whiteListDomains.set('webcomicname.com', async ($) => ohNoHandler($));
whiteListDomains.set('theohnoshop.com', async ($) => console.log($));
whiteListDomains.set('turnoff.us', async ($) => turnOffHandler($));

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


module.exports = whiteListDomains;