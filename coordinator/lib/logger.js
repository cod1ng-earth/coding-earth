const {createLogger, format,transports} = require('winston');
const expressWinston = require('express-winston');

module.exports = {
    app: createLogger({
        format:
            format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.json()
            ),
        transports: [
            new transports.Console(),
        ]
    }),
    middleware: expressWinston.logger({
        transports: [
            new transports.Console()
        ],
        format: format.json()
    })
}