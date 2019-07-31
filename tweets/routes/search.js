const NodeCache = require("node-cache");
const elastic = require('../lib/elasticsearch');
const {send} = require('micro')
const url = require('url')

const cache = new NodeCache({
    stdTTL: 3600,
});

module.exports = async (req, res) => {
    const {query} = url.parse(req.url, true)

    const elasticsearchQuery = query.search && query.search.length > 2 ?
        {
            body: {
                "query": {
                    "match": {
                        "full_text": query.search
                    }
                }
            }
        }:
        {
            body: {
                "query" : {
                    "match_all" : {}
                },
                "sort": [
                    {"created_at": {"order": "desc"} }
                ]
            }
        };

    elasticsearchQuery.index = 'tweets';

    try {
        const result = await elastic.search(elasticsearchQuery);

        send(res, 200, {
            tweets: result.body.hits.hits.map(h => h._source)
        })

    } catch(e) {
        console.error(e.meta.body.error)
        send(res, 500, "oh");
    }



    //send(res, 200, resp);
};