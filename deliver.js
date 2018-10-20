var Kafka = require("node-rdkafka");
var request = require('request');
var consumer = require("./util/consumer");

var kafkaConf = {
  "group.id": "kafka-test",
  "socket.keepalive.enable": true,
  'metadata.broker.list': '192.168.3.192:9092'
};
const topic = 'smr__notifications';

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
	    console.log('Notification sended') // Print the shortened url.
	  }
	});
} 