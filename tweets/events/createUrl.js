#!/usr/bin/env node
//this is here for demotration usage.
require('dotenv').config();
const kafka = require('./kafka');
const {Producer} = require('kafka-node');

const producer = new Producer(kafka);
producer.on('ready', () => {
    console.log("ready");
    const d = (new Date).toISOString();
    const msg = `https://twitter.com/ding/${d}`;

    producer.send([{ topic: 'NewUrl', messages: msg, partition: 0 }], (error, data) => {
        if(error) { throw error }
        console.log(data)
        kafka.close();
    });
});

