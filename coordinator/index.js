require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routesDef = require('./routesDef')

const app = express()
app.use(cors())

// Load the Platform.sh configuration.
const config = require("platformsh-config").config();

const PORT= !config.isValidPlatform() ? (process.env.PORT || 3000) : config.port;

app.get('/', (req, res) => res.json(routesDef(config.routesDef)))

app.listen(PORT, () => console.log(`node app listening on port ${PORT}!`))
