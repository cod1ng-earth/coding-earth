const elastic = require('../lib/elasticsearch');
const url = require('url')

module.exports = async (req, res) => {
    const { query } = url.parse(req.url, true)

    const elasticsearchQuery = {
        body: {
            "from": 0, "size": 100,
            "query": {
                "match_all": {}
            }
        }
    };

    elasticsearchQuery.index = 'comics';

    try {
        const result = await elastic.search(elasticsearchQuery);
        res.json({
            comics: result.body.hits.hits.map(h => h._source)
        })

    } catch (e) {
        console.error(e.meta.body.error)
        res.status(500).send({ error: e.meta.body.error })
    }

};