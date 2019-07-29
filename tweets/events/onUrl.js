const kafka = require('./kafka');
const Client = require('../client');

module.exports = async url => {
    const matches = url.match('/*\.twitter\.com/(.*)/status/(.*)');
    if (!matches) {
        return false;
    } else {
        //const userId = matches[1];
        const twitter = await Client;
        return await twitter.get(`statuses/show`, {
            id: matches[2],
            tweet_mode: 'extended'
        });
    }
}
