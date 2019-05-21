#!/usr/bin/env node
require('dotenv').config();
const readFeeds = require('../lib/import');

(async () => {
    const result = await readFeeds();
    result.forEach(r =>
        console.log(`${r.body.result} ${r.body._type} ${r.body._id}`)
    )
})();
