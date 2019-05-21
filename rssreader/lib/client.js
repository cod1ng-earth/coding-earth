const elasticsearch = require('@elastic/elasticsearch');
const config = require("platformsh-config").config();

let node;
if (config.isValidPlatform()) {
    const credentials = config.credentials('elasticsearch');
    node = `http://${credentials.host}:${credentials.port}`
} else {
    node = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
}

const client = new elasticsearch.Client({
    node
});

module.exports = client;