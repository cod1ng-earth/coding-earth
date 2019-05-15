require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routesDef = require('./routesDef')

const app = express()
app.use(cors())

// Load the Platform.sh configuration.
const config = require("platformsh-config").config();

let PORT;
let definitions;

if (!config.isValidPlatform()) {
    console.debug("not a valid platformsh platform")
    PORT = (process.env.PORT || 3000)
    definitions = {hello: 'world'}
} else {
    PORT = config.port
    definitions = routesDef(config.routesDef)
}


app.get('/', (req, res) => res.json(definitions))

app.listen(PORT, () => console.log(`coordinator app listening on port ${PORT}!`))
