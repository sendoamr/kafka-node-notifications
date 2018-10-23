const config = require('./config/config.js');
var producer = require("./kafka/producer");
var consumer = require("./kafka/consumer");
const iplocation = require("iplocation").default;

const postTopic = 'post__notifications';
const mailTopic = 'mail__notifications';

const postProducer = producer.kafkaProducer(postTopic);
const mailProducer = producer.kafkaProducer(mailTopic);

const eventConsumer = consumer.kafkaConsumer('evt__location', function (data){
	console.log('data receive to enrich location');
	var event = JSON.parse(data);
	
	//Ennrich by IP
	iplocation(event['payload']['ip'], [], (error, res) => {
    	event['payload']['location'] = res;
    	if (event['payload']['mail'] == true) {
			producer.sendMessage(mailProducer, mailTopic, event);
		} else {
  			producer.sendMessage(postProducer, postTopic, event);
		}
	});

	

});