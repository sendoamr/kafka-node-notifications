const Kafka = require("node-rdkafka");

const kafkaConf = {
  "group.id": "kafka-test",
  "metadata.broker.list": "10.23.50.185:9092",
  "socket.keepalive.enable": true,
  "debug": "generic,broker,security"
};

const genMessage = body => new Buffer.from(JSON.stringify(body));
var kafkaProducer = function(topic) {
	const producer = new Kafka.Producer(kafkaConf);
	producer.on("ready", function(arg) {
		console.log('Producer ready');
	});

	producer.on("disconnected", function(arg) {
		console.log('disconnected');
		process.exit();
	});

	producer.on('event.error', function(err) {
		console.log('event.error');
		console.error(err);
		process.exit(1);
	});
	producer.on('event.log', function(log) {
		console.log('event.log');
		console.log(log);
	});
	producer.connect();
	return producer;
};
var sendMessage = function(producer, topic, data) {
	if (producer) {
    	producer.produce(topic, -1, genMessage(data), new Date().getTime());
    	console.log('Message sended')
    } else {
    	console.log('Producer not ready');
    }
};
module.exports = {
  kafkaProducer: kafkaProducer,
  sendMessage: sendMessage
};
