const {createLogger, format,transports} = require('winston');

module.exports = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.simple()
    ),
    transports: [
        new transports.Console(),
    ]
});