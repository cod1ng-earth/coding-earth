const KafkaConsumer = require('./consumer');
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const config = require("platformsh-config").config();
const kafkaCredentials = config.credentials('kafka');

try {
  // demo that just waits for messages on the 'test' topic 
  // and outputs them to the log
  const testconsumer = new KafkaConsumer();
  testconsumer.listen('test', function(message) {
    console.log(message);
  });

  // demo producer that sends a 'hi message' to the 'test' topic
  const client = new kafka.KafkaClient({kafkaHost: `${kafkaCredentials.host}:${kafkaCredentials.port}`});
  let producer = new Producer(client);
  producer.on('ready', function () {
    producer.send([{ topic: 'test', messages: 'hi', partition: 0 }], function (error, data) {
        if(error) { throw error }
    });
  });
}
catch(error) {
  console.log(error);
}
