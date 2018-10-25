const Kafka = require("node-rdkafka");
const loggerFactory = require("../config/logger");

var kafkaConf = global.gConfig['kafka-conf'];

const maxMessages = 5;
let counter = 0;

var kafkaConsumer = function(topic, eventCallback, loggerFile, loggerClass) {
	logger = loggerFactory.createLoggerFactory(global.gConfig['logger']['level'], loggerFile, loggerClass);
	const consumer = new Kafka.KafkaConsumer(kafkaConf, {
	  "auto.offset.reset": "beginning"
	});

	consumer.on("error", function(err) {
		logger.info('ERROR');
	  	logger.error(err);
	});
	consumer.on("ready", function(arg) {
	  	logger.info(`Consumer ${arg.name} ready`);
	  	consumer.subscribe([topic]);
	  	consumer.consume();
	});
	consumer.on("data", function(m) {
	  	counter++;
	  	if (counter % maxMessages === 0) {
	    	logger.info("calling commit");
	    	consumer.commit(m);
	  	}
	  	eventCallback(m.value.toString());
	});
	consumer.on("disconnected", function(arg) {
	  	logger.info('DISCONNETED');
	  	process.exit();
	});
	consumer.on('event.error', function(err) {
	  	logger.info('ERROR');
	  	logger.error(err);
	  	process.exit(1);
	});
	consumer.on('event.log', function(log) {
	  	logger.info(log);
	});
	consumer.connect();
}

module.exports = {
  kafkaConsumer: kafkaConsumer
};