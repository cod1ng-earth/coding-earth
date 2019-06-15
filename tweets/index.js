require('dotenv').config()

const Twitter = require('twitter')
const Token = require('./token')

let client

module.exports = async (req, res) => {
    if (!client) {
        const token = await Token()
        client = new Twitter({
            bearer_token: token
        });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    const params = {
        q: 'devday'
    }

    client.get('search/tweets', params, (error, tweets, response) => {

        if (error) {
            console.log(error)
        }

        const resp = {
            tweets: tweets.statuses.map(s => s.text)
        };

        res.end(JSON.stringify(resp, null, 4))
    });
};

