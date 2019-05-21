const Parser = require('rss-parser');
const parser = new Parser();

const elastic = require('../lib/client');

const feeds = {
    'heise developer': 'https://www.heise.de/developer/rss/news-atom.xml'
};

module.exports = async function readFeeds() {

    const feed = await parser.parseURL(feeds['heise developer']);
    const promises = feed.items.map(item => {
        return elastic.index({
            index: 'news',
            id: item.id,
            type: 'news',
            body: item
        })
    });
    return await Promise.all(promises)

};