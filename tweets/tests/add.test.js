
const Twitter = require('../lib/twitter')
const kafka = require('../lib/kafka')

jest.mock('../lib/twitter');
jest.mock('../lib/kafka');

const add = require('../actions/add');

describe('testing the tweets module', () => {
    beforeEach(() => {
        kafka.__resetMessages();
    });

    test('we can add new tweets', async () => {
        console.log("test")
        const res = await add({
            url: "https://www.twitter.com/12345/status/7890"
        })
        expect(res).toBe(true)
        const messages = kafka.__getMessages();

        expect(messages['NewContent'].length).toBe(1)
        const msg = JSON.parse(messages['NewContent'][0].value)

        expect(msg.type).toEqual('tweet')

    })

    test('we reject unknown urls', async () => {
        const res = await add({
            url: "https://www.twitter.com/some-url"
        })
        expect(res).toBe(false)
        expect(kafka.__getMessages()).toMatchObject({})
    })

    test('we can mock kafka producers', async () => {
        const producer = kafka.producer()
        producer.connect();
        const res = await producer.send({
            topic: "TOPIC_NEW_CONTENT",
            messages: [
                { value: "Oh hai" },
            ],
        })

        expect(res).toBe(true)
        const messages = kafka.__getMessages();

        expect(messages).toHaveProperty("TOPIC_NEW_CONTENT")

    });

    test('we can mock twitter', async () => {

        const twitter = await Twitter();
        const response = await twitter.get(`statuses/show`, { id: "1" });
        expect(response).toMatchObject({ text: "Oh hai" })
    });
})