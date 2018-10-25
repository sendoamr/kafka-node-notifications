const config = require('./config/config.js');
var request = require('request');
var consumer = require("./kafka/consumer");
const logger = require("./config/logger").createLoggerFactory(global.gConfig['logger']['level'], 'postdeliver', 'main');

const topic = 'post__notifications';

const eventConsumer = consumer.kafkaConsumer(topic, function (data){
	logger.info('data receive' + data);
	var event = JSON.parse(data);
	sendToEndpoint(event['callback'], event['payload'])
}, 'postdeliver', 'postdeliver-consumer');

function sendToEndpoint(callback, body){
	var options = {
	  uri: callback,
	  method: 'POST',
	  json: body
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    logger.info('Notification sended');
	  }
	});
} 