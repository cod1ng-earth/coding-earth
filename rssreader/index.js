const readFeeds = require('./lib/import')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  const feed = await readFeeds()

  const response = {
    feed
  };

  res.end(JSON.stringify(response, null, 4))
}