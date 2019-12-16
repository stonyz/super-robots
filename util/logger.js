const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  });

const logger = createLogger({
    level: 'info',
    format: combine(
        // label({ label: '' }),
        timestamp(),
        myFormat
      ),
    defaultMeta: {service: 'user-service'},
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new transports.File({ filename:   'app-logs/error.log',  maxsize: 2*1024*1204, maxFiles: 3, level: 'error' }),
      new transports.File({ filename:  'app-logs/combined.log',  maxsize: 2*1024*1204, maxFiles: 3 })
    ]
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  // 
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.simple()
    }));
  }

  module.exports = logger;