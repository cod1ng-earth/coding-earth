#!/usr/bin/env node
require('dotenv').config();
const importer = require('../lib/import');
const feeds = require('../lib/feeds');

(async () => {
    try {
        const indexeableFeeds = await feeds.selectForIndexing()

        indexeableFeeds.forEach(async feed => {
            const now = (new Date()).toISOString()
            const result = await importer.readFeed(feed.url)
            result.forEach(r => {
                console.log(`${r.body.result} ${r.body._type} ${r.body._id}`)
            })

            await feeds.patch(feed.url, {
                last_read: now
            })
        })

    } catch (e) {
        console.log(e.meta.body.error)
    }
})();
