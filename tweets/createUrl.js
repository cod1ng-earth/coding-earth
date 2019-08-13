#!/usr/bin/env node
//this is here for demotration usage.
require('dotenv').config();
const kafka = require('./lib/kafka');

const producer = kafka.producer();

const msg = `{"url": "https://twitter.com/dbrumann/status/1156634433425948674.json"}`;

const run = async() => {
    await producer.connect();

    await producer.send({
        topic: 'NewUrl',
        messages: [
            { value: msg },
        ],
    })
};
