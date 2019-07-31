const elastic = require('../lib/elasticsearch');

const index = async ({type, url, content}) => {
    if (type !== 'tweet')
        return false;

    try {
        const result = await elastic.index({
            index: 'tweets',
            id: content.id_str,
            type: 'tweet',
            body: content,
        })
        return result;
    } catch(e) {
        console.log(e)
        return false;
    }

}

module.exports = index


