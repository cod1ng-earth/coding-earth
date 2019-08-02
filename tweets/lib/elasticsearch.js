const elasticsearch = require('@elastic/elasticsearch');
const config = require("platformsh-config").config();

let node;
try {
    const credentials = config.credentials('elasticsearch');
    node = `http://${credentials.host}:${credentials.port}`
} catch(e) {
    node = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
}

module.exports = new elasticsearch.Client({
    node
});;