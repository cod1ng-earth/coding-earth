const elastic = require('../lib/elasticsearch');
const logger = require('../lib/logger');

const index = async ({ type, url, content }) => {
    if (type !== 'comics')
        return false;

    logger.app.info('in do index', { type, url, content });
    try {
        const result = await elastic.index({
            index: 'comics',
            id: url,
            type: 'comics',
            body: content,
        })
        return result;
    } catch (e) {
        logger.app.error(e);
        logger.app.info('in do index in catch');
        return false;
    }

}

module.exports = index


