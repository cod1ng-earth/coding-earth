module.exports = async () => {
    return Promise.resolve({
        get: async (link, options) => {
            return Promise.resolve({
                text: "Oh hai"
            })
        },

    })
}