const Parser = require('rss-parser');
const parser = new Parser();

async function getFeed() {
  const feed = await parser.parseURL('https://www.heise.de/developer/rss/news-atom.xml');
  return feed
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  const feed = await getFeed()
  const response = {
    feed
  };

  res.end(JSON.stringify(response, null, 4))
}