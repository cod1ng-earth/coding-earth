const express = require('express')
const cors = require('cors')
const fs = require('fs')
const YAML = require('yaml')
const {Consumer, Producer} = require('kafka-node');
const kafka = require('./lib/kafka')

const {routesDef} = require('./routesDef')

const app = express()

app.use(cors())
app.use(express.json())

const config = require("platformsh-config").config();

let PORT, routes;

if (config.isValidPlatform()) {
    PORT = config.port
    routes = routesDef(config.routesDef);
} else {
    PORT = process.env.PORT || 3000;
    const DEFAULT_HOST = process.env.DEFAULT_HOST || "cearth.local:8000";
    const f = fs.readFileSync('routes.yaml').toString();
    const definitions = YAML.parse(f);
    routes = routesDef(definitions, DEFAULT_HOST, true);
}

kafka.init().then(() => {

    const consumer = new Consumer(kafka.kafka, [{topic:  kafka.TOPIC_NEW_CONTENT}], {});
    const producer = new Producer(kafka.kafka);

    app.get('/', (req, res) => res.json(routes) );

    app.post('/url', (req, res) => {
        const body = req.body;
        //todo: check the body!
        producer.send([{ topic: 'NewUrl', messages: JSON.stringify(body), partition: 0 }], (error, data) => {
            if(error) { throw error }
            res.sendStatus(200);
        });
    });

    app.get('/events', (req, res) => {
        res.status(200).set({
            'connection': 'keep-alive',
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream',
            'X-Accel-Buffering': 'no'
        });
        consumer.on('message', message => {
            res.write(`data: ${message.value}\n\n`);
        });
    });

    app.listen(PORT, () => console.log(`coordinator app listening on port ${PORT}!`))
});

