require('dotenv').config();

const url = require('url')
const {send} = require('micro')

const routes = {
  "/": require('./routes/search'),
  "/handle": require('./routes/handle'),
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  const request = url.parse(req.url, true)

  if (!routes[request.pathname]) {
    return send(res, 404, {error: `${request.pathname} not found`})
  }

  routes[request.pathname](req, res)
};