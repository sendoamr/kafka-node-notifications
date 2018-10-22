var Kafka = require("node-rdkafka");

var kafkaConf = {
  "group.id": "kafka-test",
  "socket.keepalive.enable": true,
  'metadata.broker.list': '10.23.50.185:9092'
};

const maxMessages = 5;
let counter = 0;

var kafkaConsumer = function(topic, eventCallback) {
	const consumer = new Kafka.KafkaConsumer(kafkaConf, {
	  "auto.offset.reset": "beginning"
	});

	consumer.on("error", function(err) {
		console.log('ERROR');
	  console.error(err);
	});
	consumer.on("ready", function(arg) {
	  console.log(`Consumer ${arg.name} ready`);
	  consumer.subscribe([topic]);
	  consumer.consume();
	});
	consumer.on("data", function(m) {
	console.log('DATA');
	  counter++;
	  if (counter % maxMessages === 0) {
	    console.log("calling commit");
	    consumer.commit(m);
	  }
	  eventCallback(m.value.toString());
	});
	consumer.on("disconnected", function(arg) {
	  console.log('DISCONNETED');
	  process.exit();
	});
	consumer.on('event.error', function(err) {
	  console.log('ERROR');
	  console.error(err);
	  process.exit(1);
	});
	consumer.on('event.log', function(log) {
	  console.log(log);
	});
	consumer.connect();
}

module.exports = {
  kafkaConsumer: kafkaConsumer
};