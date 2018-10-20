var Kafka = require("node-rdkafka");
var producer = require("./util/producer");
var consumer = require("./util/consumer");

var kafkaConf = {
  "group.id": "kafka-test",
  "socket.keepalive.enable": true,
  'metadata.broker.list': '192.168.3.192:9092'
};
const notifTopic = 'smr__notifications';
const notifProducer = producer.kafkaProducer(notifTopic);
const eventConsumer = consumer.kafkaConsumer('smr__enrichment', function (data){
	console.log('data receive to enrich');
	var event = JSON.parse(data);
	event['payload']['enrichment'] = 'enrich';
	producer.sendMessage(notifProducer, notifTopic, event);
});