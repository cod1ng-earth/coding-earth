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
};