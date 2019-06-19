process.env.NODE_ENV='test'
const feeds = require('../lib/feeds')
const assert = require('chai').assert
const SQL = require('sql-template-strings')

describe('Feeds', function() {

    beforeEach(async function () {
        await feeds.drop()
        await feeds.table()
    });

    describe('#createTable', function () {
        it('table should have been created and its empty', async function () {
            const db = await feeds.dbPromise
            const res = await db.get(SQL`
                SELECT * FROM sqlite_master WHERE name='feeds'
            `)
            assert.equal('feeds', res.name)
        })
    })

    describe('#createFeed', function() {
        it('should create a new entry', async function() {
            const feed = {
                url: 'http://test.me/rss.xml',
                name: 'testfeed',
                language: 'en_US'
            }
            const inserted = await feeds.replace(feed)

            assert.equal('testfeed', inserted.name)

            const res = await feeds.find('http://test.me/rss.xml')
            assert.equal(res.language, 'en_US')
        })

        it('should update an existing entry', async function() {
            const feed = {
                url: 'http://test.me/rss.xml',
                name: 'testfeed',
                language: 'en_US'
            }
            await feeds.replace(feed)
            feed.name = 'changed'

            await feeds.update(feed)

            const res = await feeds.find('http://test.me/rss.xml')
            assert.equal(res.name, 'changed')
            assert.equal(res.language, 'en_US')

        })

        it('should patch an existing entry', async function() {
            const feed = {
                url: 'http://test.me/rss.xml',
                name: 'testfeed',
                language: 'en_US'
            }
            await feeds.replace(feed)

            await feeds.patch('http://test.me/rss.xml', {
                last_read: '2019-08-28 15:30',
                last_read_status: 200
            })

            const res = await feeds.find('http://test.me/rss.xml')
            assert.equal(res.name, 'testfeed')
            assert.equal(res.language, 'en_US')
            assert.equal(res.last_read, '2019-08-28 15:30')
            assert.equal(res.last_read_status, 200)

        })

    })
})