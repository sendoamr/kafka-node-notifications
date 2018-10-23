const config = require('./config/config.js');
var request = require('request');
var consumer = require("./kafka/consumer");

const topic = 'post__notifications';

const eventConsumer = consumer.kafkaConsumer(topic, function (data){
	console.log('data receive');
	console.dir(data);
	var event = JSON.parse(data);
	console.log('notif to send');
	sendToEndpoint(event['callback'], event['payload'])
});

function sendToEndpoint(callback, body){
	var options = {
	  uri: callback,
	  method: 'POST',
	  json: body
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log('Notification sended');
	  }
	});
} 