const cheerio = require('cheerio');
const axios = require('axios');

function isImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

const whiteListDomains = new Map();
whiteListDomains.set('www.monkeyuser.com', async (url) => {

    if (isImageURL(url)) {
        return url;
    }
    const urlResponse = await axios.get(url);
    const $ = cheerio.load(urlResponse.data);
    const image = $('.content>p>img');
    if (image) {
        console.log('response data image', image.attr('src'));
        return image.attr('src');
    }
    return '';

    console.log('Monkey user works');
});

module.exports = whiteListDomains;