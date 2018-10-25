const Kafka = require("node-rdkafka");
var kafkaConf = global.gConfig['kafka-conf'];
const loggerFactory = require("../config/logger");

const genMessage = body => new Buffer.from(JSON.stringify(body));
var kafkaProducer = function(topic, loggerFile, loggerClass) {
	logger = loggerFactory.createLoggerFactory(global.gConfig['logger']['level'], loggerFile, loggerClass);
	const producer = new Kafka.Producer(kafkaConf);
	producer.on("ready", function(arg) {
		logger.info('Producer ready');
	});

	producer.on("disconnected", function(arg) {
		logger.info('disconnected');
		process.exit();
	});

	producer.on('event.error', function(err) {
		logger.info('event.error');
		logger.error(err);
		process.exit(1);
	});
	producer.on('event.log', function(log) {
		logger.info('event.log');
		logger.info(log);
	});
	producer.connect();
	return producer;
};
var sendMessage = function(producer, topic, data) {
	if (producer) {
    	producer.produce(topic, -1, genMessage(data), new Date().getTime());
    	logger.info('Message sended')
    } else {
    	logger.info('Producer not ready');
    }
};
module.exports = {
  kafkaProducer: kafkaProducer,
  sendMessage: sendMessage
};
