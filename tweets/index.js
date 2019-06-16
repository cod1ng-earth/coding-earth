require('dotenv').config()
const NodeCache = require("node-cache");
const url = require('url')
const {send} = require('micro')
const Twitter = require('twitter')
const Token = require('./token')

let client

const cache = new NodeCache({
    stdTTL: 3600,

});

const respond = (res, tweets) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    send(res, 200, tweets)
}

module.exports = async (req, res) => {
    if (!client) {
        const token = await Token()
        console.log("queried a new bearer token")
        client = new Twitter({
            bearer_token: token
        });
    }
    const request = url.parse(req.url, true)
    const params = {
        q: "#" + (request.query.search || 'devday')
    }

    const cached = cache.get(params.q)
    if (cached) {
        console.log("using cached response")
        return respond(res, cached)
    }

    console.log(`retrieving tweets for ${params.q}`)

    client.get('search/tweets', params, (error, tweets, response) => {

        if (error) {
            console.log(error)
        }
        const resp = {
            tweets: tweets.statuses.map(s => ({
                id: s.id_str,
                created_at: s.created_at,
                retweet_count: s.retweet_count,
                favorite_count: s.favorite_count,
                url: `https://twitter.com/${s.user.screen_name}/status/${s.id_str}`,
                user: {
                    id: s.user.id_str,
                    screen_name: s.user.screen_name,
                    profile_image_url_https: s.user.profile_image_url_https,
                },
                entities: s.entities,
                text: s.text
            }))
        }

        cache.set(params.q, resp)
        resp.rateLimit = response.headers['x-rate-limit-remaining']
        respond(res, resp)
    });
};

