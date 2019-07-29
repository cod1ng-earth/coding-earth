const NodeCache = require("node-cache");
const Client = require('../client')
const {send} = require('micro')
const url = require('url')

const cache = new NodeCache({
    stdTTL: 3600,
});

let client;
Client.then(cl => client = cl );

module.exports = (req, res) => {
    const request = url.parse(req.url, true)
    const params = {
        q: "#" + (request.query.search || 'devday'),
        tweet_mode: 'extended'
    };

    const cached = cache.get(params.q);
    if (cached) {
        console.log("using cached response");
        return send(res, 200, cached);
    }

    console.log(`retrieving tweets for ${params.q}`);

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
                full_text: s.full_text
            }))
        };

        cache.set(params.q, resp);
        resp.rateLimit = response.headers['x-rate-limit-remaining'];
        send(res, 200, resp);
    });
};