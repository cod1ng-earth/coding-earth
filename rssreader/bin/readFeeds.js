#!/usr/bin/env node
const readFeeds = require('./lib/import')
const elasticsearch = require('elasticsearch');
const config = require("platformsh-config").config();

const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});


console.log("hello")

