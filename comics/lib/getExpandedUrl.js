module.exports = function (tweet) {
    const entities = tweet.content.entities;
    const expandedURL = entities.urls && entities.urls.length > 0 && entities.urls[0].expanded_url;
    if (expandedURL) {
        const url = entities.media && entities.media.length > 0 && entities.media[0].media_url_https;

    }
    return url;
}