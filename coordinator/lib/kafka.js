const kafka = require('kafka-node');
const config = require("platformsh-config").config();

const TOPIC_NEW_URL = "NewUrl";
const TOPIC_NEW_CONTENT = "NewContent";
const CLIENT_RESPONSE = "ClientResponse";

const topics = [
    {
        topic: TOPIC_NEW_URL,
        partitions: 1,
        replicationFactor: 1
    },
    {
        topic: TOPIC_NEW_CONTENT,
        partitions: 1,
        replicationFactor: 1
    },
    {
        topic: CLIENT_RESPONSE,
        partitions: 1,
        replicationFactor: 1
    }
];

let host;
try {
    const credentials = config.credentials('kafka');
    host = `${credentials.host}:${credentials.port}`;
} catch(e) {
    host = process.env.KAFKA_HOST || 'kafka:9092';
}

const client = new kafka.KafkaClient({kafkaHost: host});

const init = () => {
    return new Promise((resolve, reject) => {
        client.createTopics(topics, (err, res) => {
            if (err)
                console.error(err)
            resolve(res);
        })
    })
}

module.exports = {
    kafka: client,
    init,
    TOPIC_NEW_URL,
    TOPIC_NEW_CONTENT
};
