const express = require('express')
const cors = require('cors')
const fs = require('fs')
const YAML = require('yaml')
const {Consumer, Producer} = require('kafka-node');
const kafka = require('./lib/kafka')
const logger = require('./lib/logger')

const {routesDef} = require('./routesDef')

const app = express()
app.use(logger.middleware);

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
            logger.app.debug(data)
            if (error) {
                logger.app.error(error);
            }
            res.sendStatus(200);
        });
    });

    const openResponses = [];
    consumer.on('message', message => {
        logger.app.info(`${message.topic} ${message.offset}`);
        openResponses.map(res => res.write(`data: ${message.value}\n\n`))
    });

    app.get('/events', (req, res) => {
        res.status(200).set({
            'connection': 'keep-alive',
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream',
            'X-Accel-Buffering': 'no'
        });

        let rand;
        do { //assign a random request id. These connections are kept alive.
            rand = Math.floor(Math.random() * 10000000)
        } while (openResponses[rand] != null);

        openResponses[rand] = res;
        req.on('close', () => {
            logger.app.info(`${rand} has disconnected`)
            delete openResponses[rand]
        });
    });

    app.listen(PORT, () => logger.app.info(`coordinator app listening on port ${PORT}!`))
});

kafka.kafka.on("reconnect", ()=> {logger.app.info(e); })
kafka.kafka.on("error", (e)=> {logger.app.error("oh", e);  })
kafka.kafka.on("socket_error", (e)=> {logger.app.error("oh", e); })
kafka.kafka.on("close", (e)=> {logger.app.error("oh", e); })