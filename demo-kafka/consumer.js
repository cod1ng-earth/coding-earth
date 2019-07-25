const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const config = require("platformsh-config").config();
const kafkaCredentials = config.credentials('kafka');
const client = new kafka.KafkaClient({kafkaHost: `${kafkaCredentials.host}:${kafkaCredentials.port}`});


module.exports = class KafkaConsumer {
  /**
  * starting a new consumer
  * @param {string} topic - the topic the consumer should listen to
  * @param {function} callback - function to be executed
  * @return {Promise}
  */
  async listen(topic, callback) {
    try {    
      let consumer = new Consumer(
        client,
        [{ topic: topic, partition: 0 }],
        {
          autoCommit: true,
          fetchMaxWaitMs: 1000,
          fetchMaxBytes: 1024 * 1024,
          encoding: 'utf8',
          fromOffset: false
        }
      );
      consumer.on('message', async function(message) {
        await callback(message);
      })
      consumer.on('error', function(error) {
        throw error;
      });
    }
    catch(error) {
      throw error;
    }
  }
}
