const config = require('./config/config.js');
var producer = require("./kafka/producer");
var consumer = require("./kafka/consumer");

const enrichTopic = 'evt__location';
const postTopic = 'post__notifications';
const mailTopic = 'mail__notifications';

const enricherProducer = producer.kafkaProducer(enrichTopic);
const postProducer = producer.kafkaProducer(postTopic);
const mailProducer = producer.kafkaProducer(mailTopic);
const eventConsumer = consumer.kafkaConsumer('evt__events', function (data){
	console.log('data receive');
	console.dir(data);
	var event = JSON.parse(data);
	if (event['location'] == true) {
		console.log('to enrich location');
  		producer.sendMessage(enricherProducer, enrichTopic, event);
	} else if (event['payload']['mail'] == true) {
		producer.sendMessage(mailProducer, mailTopic, event);
	} else {
  		producer.sendMessage(postProducer, postTopic, event);
	}
});