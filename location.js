var producer = require("./util/producer");
var consumer = require("./util/consumer");

const postTopic = 'post__notifications';
const mailTopic = 'mail__notifications';

const postProducer = producer.kafkaProducer(postTopic);
const mailProducer = producer.kafkaProducer(mailTopic);

const eventConsumer = consumer.kafkaConsumer('evt__location', function (data){
	console.log('data receive to enrich location');
	var event = JSON.parse(data);
	event['payload']['location_desc'] = 'Fisical location';
	
	if (event['payload']['mail'] == true) {
		producer.sendMessage(mailProducer, mailTopic, event);
	} else {
  		producer.sendMessage(postProducer, postTopic, event);
	}

});