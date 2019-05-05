// Load the http module to create an http server.
const express = require('express')
const cors = require('cors')
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

app.get('/discover', (req, res) => res.json({service: true}))
app.get('/', (req, res) => {
  res.json(config)
})

app.listen(PORT, () => console.log(`node app listening on port ${PORT}!`))
