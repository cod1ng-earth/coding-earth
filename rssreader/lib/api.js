const elastic = require('./client');

module.exports = {
    latest: async () => {
        const response = await elastic.search({
            index: "news",
            body: {
                "sort": [
                    {"pubDate": {"order": "desc"}}
                ]
            }
        });
        return response;
    },

    search: async (phrase) => {
        const response = await elastic.search({
            index: 'news',
            q: phrase
        });
        return response;
    },

    deleteFeed: async (feedUrl) => {
        const response = await elastic.delete_by_query({
            index: 'news',
            body: {
                "query": {
                    "bool": {
                        "filter": [
                            {"term": {"feed": feedUrl}}
                        ]
                    }
                }
            }
        })
        return response
    }
};