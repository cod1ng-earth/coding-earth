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
        const { body } = await elastic.search({
            index: 'news',
            contentSnippet: {
                query: {
                    match: {
                        body: phrase
                    }
                }
            }
        });
        return body;
    },
};