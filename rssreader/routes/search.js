const {send} = require('micro')
const url = require('url')
const api = require('../lib/api');

module.exports = async (req, res) => {

    const {query} = url.parse(req.url, true)

    if (query.search && query.search.length > 2) {
        result = await api.search(query.search);
    } else {
        result = await api.latest();
    }

    send(res, 200, {
        news: result.body.hits.hits.map(h => h._source)
    })
}

