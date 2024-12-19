import { createLogger, format, transports } from "winston";

/**
 * Creates a logger instance with specified configuration.
 *
 * @type {Logger}
 * @param {string} level - The logging level.
 * @param {object} format - The format of the log messages.
 * @param {Array} transports - The transports for the log messages.
 */
const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

export default logger;