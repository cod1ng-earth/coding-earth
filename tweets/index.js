const Twitter = require('twitter')
var client = new Twitter({
    consumer_key: 'wbasZXXRX2VHErdjnrgQir0GJ',
    consumer_secret: 'NV9oSi1Xj0msFvA0rheVvFm5vpWJiM69BQ5VG8H6aLbeT0cQTZ',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAMp66wAAAAAALHAiXv41fPFo9azd37DX66eNP18%3DdVDCwmUQ1RV2mpgTqz8W3fg4222xytbDJZGnsMNm7xPrP6cCtZ'
});

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    const params = {
        q: 'devday19'
    }

    client.get('search/tweets', params, (error, tweets, response) => {

        if (error) {
            throw error
        }
        const resp = {
            tweets: tweets.statuses.map(s => s.text)
        };

        res.end(JSON.stringify(resp, null, 4))

        console.log(tweets);  // The favorites.

    });
};

