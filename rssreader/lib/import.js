const Parser = require('rss-parser');
const parser = new Parser();
const rssUtils = require('rss-parser/lib/utils')

const elastic = require('../lib/client');

function preprocess(items) {
    return items.map(it => {
        const item = { ...it }
        if (it['content:encoded'] && !it['content']) {
            item['content'] = it['content:encoded'];
            item['contentSnippet'] = rssUtils.getSnippet(item['content:encoded'])
            delete item['content:encoded']
        }
        if (it['guid'] && !it['id']) {
            item['id'] = it['guid']
        }
        if (it['creator'] && !it['author']) {
            item['author'] = it['creator']
        }
        if (it['isoDate'] && it['pubDate']) {
            item['pubDate'] = it['isoDate']
        }
        return item
    })
}

async function index(feedUrl, feedItems) {
    const promises = feedItems.map(item => {
        item.feed=feedUrl

        return elastic.index({
            index: 'news',
            id: item.id,
            type: 'news',
            body: item,
        })
    });
    return await Promise.all(promises)
}

async function readFeed(url) {
    const content = await parser.parseURL(url);
    return await index(content.feedUrl, preprocess(content.items))
}

module.exports = {
    preprocess,
    readFeed,
    index

};