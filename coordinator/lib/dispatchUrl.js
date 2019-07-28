const kafka = require('./kafka')
const {Producer} = require('kafka-node');

const producer = new Producer(kafka);
let producerReady = false;
producer.on('ready', () => {
    producerReady = true;
    console.log("producer is ready")
})

module.exports = (body, response) => {
    if (!producerReady) {
        return response.sendStatus(503);
    }
    producer.send([{ topic: 'NewUrl', messages: JSON.stringify(body), partition: 0 }], (error, data) => {
        if(error) { throw error }
        console.log(data)
    });
    response.sendStatus(200);
}