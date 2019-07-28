require('dotenv').config()

const events = require('./events/events');
const url = require('url')
const {send} = require('micro')

const routes = {
    "/": require('./routes/search'),
};

events.then (consumer => {}); //unsure if this is the best place, but... why not :D

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    const request = url.parse(req.url, true);

    if (!routes[request.pathname]) {
        return send(res, 404, {error: `${request.pathname} not found`})
    }

    routes[request.pathname](req, res)
};


