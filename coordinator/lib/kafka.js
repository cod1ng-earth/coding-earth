const { Kafka } = require('kafkajs')

const config = require("platformsh-config").config();
const logger = require('./logger')

const TOPIC_NEW_URL = "NewUrl";
const TOPIC_NEW_CONTENT = "NewContent";
const CLIENT_RESPONSE = "ClientResponse";

const topics = [
    {
        topic: TOPIC_NEW_URL,
        numPartitions: 1,
        replicationFactor: 1
    },
    {
        topic: TOPIC_NEW_CONTENT,
        numPartitions: 1,
        replicationFactor: 1
    },
    {
        topic: CLIENT_RESPONSE,
        numPartitions: 1,
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

const client = new Kafka({
    clientId: 'coordinator',
    brokers: [host]
})

//const client = new kafka.KafkaClient({kafkaHost: host});

const init = async () => {
    const admin = client.admin()

    await admin.connect()
    await admin.createTopics({topics})
    await admin.disconnect()

    return client
}

module.exports = {
    kafka: client,
    init,
    TOPIC_NEW_URL,
    TOPIC_NEW_CONTENT
};
