const config = require('./config/config.js');
var producer = require("./kafka/producer");
var consumer = require("./kafka/consumer");
const logger = require("./config/logger").createLoggerFactory(global.gConfig['logger']['level'], 'processor', 'main');

const enrichTopic = 'evt__location';
const postTopic = 'post__notifications';
const mailTopic = 'mail__notifications';

const enricherProducer = producer.kafkaProducer(enrichTopic, 'processor', 'enrichment-producer');
const postProducer = producer.kafkaProducer(postTopic, 'processor', 'post-producer');
const mailProducer = producer.kafkaProducer(mailTopic, 'processor', 'mail-producer');

const eventConsumer = consumer.kafkaConsumer('evt__events', function (data){
	logger.info('data receive' + data);
	var event = JSON.parse(data);
	if (event['location'] == true) {
		logger.info('to enrich location');
  		producer.sendMessage(enricherProducer, enrichTopic, event);
	} else if (event['payload']['mail'] == true) {
		producer.sendMessage(mailProducer, mailTopic, event);
	} else {
  		producer.sendMessage(postProducer, postTopic, event);
	}
}, 'processor', 'processor-consumer');