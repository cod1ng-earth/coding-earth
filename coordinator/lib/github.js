const Request = require('request')
const config = require("platformsh-config").config();
const logger = require('./logger')

let credentials;

if (config.isValidPlatform()) {
    const variables = config.variables();
    credentials = {
        clientId: variables.GITHUB_CLIENT_ID,
        clientSecret: variables.GITHUB_CLIENT_SECRET
    }
} else {
    credentials = {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
}

module.exports = (code) => {
    return new Promise((resolve, reject) => {
        Request({
            method: 'POST',
            uri: 'https://github.com/login/oauth/access_token',
            body: code,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (error, response, body) => {
            if (error || response.statusCode >= 400) {
                return reject(response.body)
            }
            const token = (JSON.parse(body).access_token);
            logger.app.info("got a new bearer token")
            const client = new Twitter({
                bearer_token: token
            });
            resolve(client);
        })
    })
}