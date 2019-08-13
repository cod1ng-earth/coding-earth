const express = require('express')
const cors = require('cors')
const fs = require('fs')
const YAML = require('yaml')
const Request = require('request')

const kafkaClient = require('./lib/kafka')
const logger = require('./lib/logger')

const {routesDef} = require('./routesDef')

const app = express()
app.use(logger.middleware);

app.use(cors())
app.use(express.json())

const config = require("platformsh-config").config();

let PORT, routes, githubClientId, githubClientSecret;

if (config.isValidPlatform()) {
    PORT = config.port
    routes = routesDef(config.routesDef);
    githubClientId = config.variable('GITHUB_CLIENT_ID');
    githubClientSecret = config.variable('GITHUB_CLIENT_SECRET');
} else {
    PORT = process.env.PORT || 3000;
    const DEFAULT_HOST = process.env.DEFAULT_HOST || "cearth.local:8000";
    const f = fs.readFileSync('routes.yaml').toString();
    const definitions = YAML.parse(f);
    routes = routesDef(definitions, DEFAULT_HOST, true);
}

kafkaClient.init().then( async () => {
    const kafka = kafkaClient.kafka;

    const consumer = kafka.consumer({groupId: 'coordinator-group'})
    const producer = kafka.producer()

    await consumer.connect()
    await producer.connect()

    await consumer.subscribe({topic: kafkaClient.TOPIC_NEW_CONTENT})
    await consumer.subscribe({topic: kafkaClient.TOPIC_NEW_CARROT})

    app.get('/', (req, res) => res.json(routes) );

    app.post('/github', async (req, res) => {
        Request({
            method: 'POST',
            uri: 'https://github.com/login/oauth/access_token',
            body: {
                client_id: githubClientId,
                client_secret: githubClientSecret,
                code: req.code
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }, (error, response, body) => {
            if (error || response.statusCode >= 400) {
                return response.reject(response.body)
            }
            // const token = (JSON.parse(body).access_token);
            logger.app.info("got a new bearer token")
        });
        logger.app.info("done with github");

        res.sendStatus(200);
    });

    app.post('/url', async (req, res) => {
        const body = req.body;
        //todo: check the body!
        const urlRes = await producer.send({
            topic: kafkaClient.TOPIC_NEW_URL,
            messages: [
                { value:  JSON.stringify(body) },
            ],
        })
        logger.app.info(urlRes);

        res.sendStatus(200);
    });

    const openResponses = [];
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            logger.app.info(`${message.topic} ${message.offset}`);
            logger.app.info(`${message.value}`);
            if (topic === kafkaClient.TOPIC_GITHUB) {
                githubLogin(message.value)
            }
            openResponses.map(res => res.write(`data: ${message.value.toString()}\n\n`))
        },
    })

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

        const keepAlive = setInterval(() => res.write(`data: ping\n\n`), 20000);

        openResponses[rand] = res;
        req.on('close', () => {
            clearInterval(keepAlive);
            logger.app.info(`${rand} has disconnected`)
            delete openResponses[rand]
        });
    });

    app.listen(PORT, () => logger.app.info(`coordinator app listening on port ${PORT}!`))
});
