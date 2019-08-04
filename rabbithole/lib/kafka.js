const { Kafka, logLevel } = require("kafkajs");
const config = require("platformsh-config").config();

let host;
try {
  const credentials = config.credentials("kafka");
  host = `${credentials.host}:${credentials.port}`;
} catch (e) {
  host = process.env.KAFKA_HOST || "kafka:9092";
}

const client = new Kafka({
  logLevel: logLevel.INFO,
  clientId: "carrots",
  brokers: [host]
});

module.exports = client;
