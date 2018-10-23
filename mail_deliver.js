const config = require('./config/config.js');
var request = require('request');
var consumer = require("./kafka/consumer");

const topic = 'mail__notifications';

const eventConsumer = consumer.kafkaConsumer(topic, function (data){
	console.log('data receive');
	console.dir(data);
	var event = JSON.parse(data);
	console.log('notif to send');
	sendToEndpoint(event['callback'], event['payload'])
});

function sendToEndpoint(callback, body){

	//TODO send mail
	console.log('send mail');
} 