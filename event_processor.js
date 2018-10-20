var Kafka = require("node-rdkafka");
var producer = require("./util/producer");
var consumer = require("./util/consumer");

var kafkaConf = {
  "group.id": "kafka-test",
  "socket.keepalive.enable": true,
  'metadata.broker.list': '192.168.3.192:9092'
};
const enrichTopic = 'smr__enrichment';
const notifTopic = 'smr__notifications';

const enricherProducer = producer.kafkaProducer(enrichTopic);
const notifProducer = producer.kafkaProducer(notifTopic);
const eventConsumer = consumer.kafkaConsumer('smr__events', function (data){
	console.log('data receive');
	console.dir(data);
	var event = JSON.parse(data);
	if (event['enrich_required'] == true) {
		console.log('to enrich')
  		producer.sendMessage(enricherProducer, enrichTopic, event);
	} else {
  		producer.sendMessage(notifProducer, notifTopic, event);
	}
});