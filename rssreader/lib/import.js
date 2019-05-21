const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async function getFeed() {
    const feed = await parser.parseURL('https://www.heise.de/developer/rss/news-atom.xml');
    return feed
}