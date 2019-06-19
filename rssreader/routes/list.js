const {send} = require('micro')
const feeds = require('../lib/feeds');

module.exports = async (req, res) => {

    const allFeeds = await feeds.findAll()
    send(res, 200, {
        feeds: allFeeds
    })
}

