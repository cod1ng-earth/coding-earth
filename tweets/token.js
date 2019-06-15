const Request = require('request')
const config = require("platformsh-config").config();

let credentials;
if (config.isValidPlatform()) {
    const variables = config.variables();
    credentials = {
        consumer_key: variables.TWITTER_CONSUMER_KEY,
        consumer_secret: variables.TWITTER_CONSUMER_SECRET
    }
} else {
    credentials = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    }
}

module.exports = () => {
    const conc = credentials.consumer_key + ":" + credentials.consumer_secret
    const basicCredentials = Buffer.from(conc).toString('base64')
    return new Promise( (resolve, reject) => {

        Request({
            method: 'POST',
            uri: 'https://api.twitter.com/oauth2/token',
            form: {"grant_type":'client_credentials'},
            headers: {
                'Authorization': 'Basic ' + basicCredentials,
            }
        }, (error, response, body) => {
            if (error || response.statusCode >= 400) {
                return reject(response.body)
            }
            resolve(JSON.parse(body).access_token)
        })
    } )
}