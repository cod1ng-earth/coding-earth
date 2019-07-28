const kafka = require('./kafka');
const url = require('url')
const Client = require('../client');

module.exports = message => {
    const matches = message.url.match('/*\.twitter\.com/(.*)/status/(.*)');
    if (!matches) {
        console.log(`${message.url} is not a tweet`)
        return false;
    } else {
        //console.log(matches);
        const userId = matches[1];
        const tweetId = matches[2];
        Client.then(twitter => {
            twitter.get(`statuses/show`, {
                id: tweetId,
                tweet_mode: 'extended'
            },  (error, tweet, response) => {
                console.log(tweet)
            } )
        })
    }
}
