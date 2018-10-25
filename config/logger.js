const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;

var createLoggerFactory = function(logLevel, fileName, origin) {
	const logFormat = printf(info => {
	  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
	});
	return createLogger({
	  level: logLevel,
	  format: combine(
	    label({ label: origin }),
    	timestamp(),
    	logFormat
	  ),
	  transports: [
	    new transports.File({ filename: 'logs/'+fileName+'.log' })
	  ]
	});
}

module.exports = {
  createLoggerFactory: createLoggerFactory
};