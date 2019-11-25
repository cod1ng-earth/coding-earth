const kafka = require('../lib/kafka')
const axios = require('axios')
const fs = require('fs')

jest.mock('axios');
jest.mock('../lib/kafka');

const handlers = require('../actions/handlers');
const add = require('../actions/add');

describe('testing the comics module', () => {
    beforeEach(() => {
        kafka.__resetMessages();
    });

    test('we can parse content', async () => {
        const demoContent = await fs.readFileSync('./commitstrip.html')
        axios.get.mockResolvedValue({ data: demoContent });

        const response = await add({
            url: "http://www.commitstrip.com/en/2019/09/10/debugging-on-the-phone/"
        })
        expect(response).toBe(true)
        const messages = kafka.__getMessages();

        expect(messages['NewContent'].length).toBe(1)
        const msg = JSON.parse(messages['NewContent'][0].value)

        expect(msg.type).toEqual('comics')
    })

    test('we can identify singular images', async () => {
        const response = await add({
            url: "https://www.commitstrip.com/wp-content/uploads/2019/09/Strip-Mimique-au-t%C3%A9l%C3%A9phone-650-finalenglish.jpg"
        })
        expect(response).toBe(true)
        const messages = kafka.__getMessages();

        expect(messages['NewContent'].length).toBe(1)
        const msg = JSON.parse(messages['NewContent'][0].value)

        expect(msg.type).toEqual('comics')
    })

    test('unsupported urls are rejected', async () => {
        const response = await add({
            url: "https://www.golem.de/1911/144767-213219-213218_rc.jpg"
        })
        expect(response).toBe(false)
        const messages = kafka.__getMessages();
        expect(Object.values(messages).length).toBe(0)
    })

    test('we can mock axios', async () => {
        axios.get.mockResolvedValue({ data: { msg: "Hello" } });
        const res = await axios.get("http://example.com")
        expect(res.data).toMatchObject({ msg: "Hello" })
    });
})