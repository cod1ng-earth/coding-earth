const path = require('path')
const fs = require('fs')
const sqlite = require('sqlite');
const SQL = require('sql-template-strings')

const dbFileName = process.env.NODE_ENV === 'test' ? "feeds.test.sqlite3" : "feeds.sqlite3"
const dbPath = path.resolve(__dirname, `../db/${dbFileName}`)

let dbPromise = sqlite.open(dbPath, { Promise });

module.exports = {
    dbPromise,
    async drop() {
        const db = await dbPromise;
        db.run(`DROP TABLE IF EXISTS feeds`)
    },
    async close() {
        const db = await dbPromise;
        db.close()
    },

    async table() {
        const db = await dbPromise;
        return db.run(`create table if not exists feeds
        (
        url TEXT not null
          constraint feeds_pk
          primary key,
        name TEXT not null,
        created TEXT,
        cron TEXT,
        last_read TEXT,
        last_read_status INTEGER,
        language TEXT
        );`);
    },

    async update(feed) {
        const db = await dbPromise
        const result = db.run(SQL`
            UPDATE feeds
            SET 
                name=${feed.name},
                cron=${feed.cron},
                last_read=datetime(${feed.last_read}),
                last_read_status=${feed.last_read_status},
                language=${feed.language}
            WHERE url=${feed.url}     
        `);

        return result
    },

    async patch(feedUrl, values) {
        const db = await dbPromise
        const columns = Object.keys(values).map(k => `${k} = $${k}`).join(',')
        const vals = {};
        Object.keys(values).forEach(k => { vals['$' + k] = values[k] })

        const result = await db.run(
            `UPDATE feeds
            SET ${columns}
            WHERE url='${feedUrl}'`,
            vals
        );

        return await this.find(feedUrl)
    },

    async replace(feed) {
        const db = await dbPromise;
        const sql = SQL`
            REPLACE INTO feeds
            (url, name, created, language) 
            VALUES 
            (${feed.url}, ${feed.name}, datetime('now'), ${feed.language})
            `
        await db.run(sql)
        return await this.find(feed.url)
    },
    async find(url) {
        const db = await dbPromise;
        return await db.get(`select * from feeds where url = ?`, url)
    },

    async selectForIndexing() {
        const db = await dbPromise
        return await db.all(SQL`
            select *, strftime('%s','now') - strftime('%s',last_read) as last_read_duration from feeds
            where last_read_duration > 7200
            or last_read is null
            order by last_read_duration asc
            limit 10
        `)
    },
    async findAll() {
        const db = await dbPromise;
        return await db.all(`select * from feeds`)
    }
}