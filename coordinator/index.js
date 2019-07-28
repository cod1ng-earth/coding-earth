const express = require('express')
const cors = require('cors')
const fs = require('fs')
const YAML = require('yaml')

const {routesDef} = require('./routesDef')
const sendMessage = require('./lib/sendMessage');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.get('/', (req, res) => res.json(routes) )
app.post('/url', (req, res) => {
    const body = req.body;
    return sendMessage(req.body, res)
})

app.get('/events', (req, res) => {
    res.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-type': 'text/event-stream'
    })
    setInterval(() => {
        const d = (new Date).toISOString();
        res.write(d + "\n\n");
    }, 5000);
});

app.listen(PORT, () => console.log(`coordinator app listening on port ${PORT}!`))
