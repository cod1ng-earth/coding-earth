require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routesDef = require('./routesDef')

const app = express()

app.use(cors())

// Load the Platform.sh configuration.
const config = require("platformsh-config").config();
let PORT;

if (!config.isValidPlatform()) {
  PORT=process.env.PORT || 3000
} else {
  PORT=config.port;
}

app.get('/services', (req, res) => res.json(routesDef(config.routesDef)))
app.get('/', (req, res) => {
  res.json(config)
})

app.listen(PORT, () => console.log(`node app listening on port ${PORT}!`))
