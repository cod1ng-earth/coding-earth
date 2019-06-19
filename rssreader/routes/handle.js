const api = require('../lib/api');
const {send, json} = require('micro')
const bodyparse = require('urlencoded-body-parser');

const Parser = require('rss-parser');
const parser = new Parser();

const feeds = require('../lib/feeds')
const importer = require('../lib/import')

module.exports = async (req, res) => {

    if (req.method !== 'POST' && req.method !== 'DELETE')
        return send(res, 405, `${req.method} not allowed`)

    const body = await bodyparse(req);
    if (!body.url) {
        return send(res, 400, "must send an url along")
    }

    if (req.method === 'DELETE') {
        const apiResponse = await api.deleteFeed(body.url)
        await feeds.delete(body.url)
        return send(res, 200, apiResponse)
    }

    try {
        let status

        const content = await parser.parseURL(body.url)
        content.items = importer.preprocess(content.items)

        if (body.test) {
            return send(res, 200, content)
        }

        try {
            await importer.index(content.feedUrl, content.items)

            const existing = await feeds.find(body.url)

            const now = (new Date()).toISOString()
            if (existing) {
                await feeds.patch(content.feedUrl, {
                    name: content.title,
                    last_read: now,
                    language: body.lang || content.language
                })
                status = 200;
            } else {
                await feeds.replace({
                    url: content.feedUrl,
                    name: content.title,
                    last_read: now,
                    language: body.lang || 'de_DE'
                })
                status = 201
            }
        } catch(e) {
            return send(res, 500, e)
        }
        return send(res, status, content)
    } catch (exc) {
        return send(res, 400, `error when parsing ${body.url}: ${exc}`)
    }

}

