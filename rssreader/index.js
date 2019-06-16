require('dotenv').config();
const {send} = require('micro')
const url = require('url')
const api = require('./lib/api');


module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  const request = url.parse(req.url, true)
  let result
  if (request.query.search && request.query.search.length > 2) {
    result = await api.search(request.query.search);
  } else {
    result = await api.latest();
  }
  const response = {
    news: result.body.hits.hits.map(h => h._source)
  };

  send(res, 200, response)
};