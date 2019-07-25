const kafka = require('kafka-node');
const config = require("platformsh-config").config();
const kafkaCredentials = config.credentials('kafka');
const client = new kafka.KafkaClient({kafkaHost: `${kafkaCredentials.host}:${kafkaCredentials.port}`});
const topics = [
  {
    topic: 'test',
    partitions: 1,
    replicationFactor: 1
  }
];

try {
  // creates the topics we need
  client.createTopics(topics, (error, result) => {
    if(error) { throw error; }
    console.log(result);
  });
} catch (error) {
  console.log(error);
}
