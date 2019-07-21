const express = require('express')
const cors = require('cors')
const fs = require('fs')
const YAML = require('yaml')

const {routesDef} = require('./routesDef')

const app = express()

app.use(cors())
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

app.listen(PORT, () => console.log(`coordinator app listening on port ${PORT}!`))
