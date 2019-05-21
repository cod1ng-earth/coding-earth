require('dotenv').config();
const readFeeds = require('./lib/import');
const api = require('./lib/api');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  const result = await api.latest();

  const response = {
    news: result.body.hits.hits.map(h => h._source)
  };

  res.end(JSON.stringify(response, null, 4))
};