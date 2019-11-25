let messages = {}

const producer = {
    connect: () => { },
    send: jest.fn(async (obj) => {
        if (!messages[obj.topic]) {
            messages[obj.topic] = []
        }

        messages[obj.topic] = messages[obj.topic].concat(obj.messages)
        return Promise.resolve(true)
    })
}

module.exports = {
    producer: () => {
        return producer
    },
    __getMessages() {
        return messages
    },
    __resetMessages() {
        messages = {}
    }
}