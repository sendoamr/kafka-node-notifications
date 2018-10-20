var express = require("express"); 
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const Kafka = require("node-rdkafka");
var producer = require("./util/producer");
const topic = 'smr__events';

const callback = " https://webhook.site/c32d8655-96de-4533-ad23-f532f49a3e20";
const event_types = new Map();
event_types.set('event_type1', {
	enrich_required: true,
	callback: callback
});
event_types.set('event_type2', {
	enrich_required: false,
	callback: callback
});

const eventsProducer = producer.kafkaProducer(topic);

const genMessage = body => new Buffer.from(JSON.stringify(body));

app.post('/events', function(req, res) {
	var data = req.body;
    event_types.forEach(function(value){
    	var time = new Date().getTime();
    	value['payload'] = data;
    	value['event_time'] = time;
    	producer.sendMessage(eventsProducer, topic, value);
    	console.log("Message sended to events")
    });
   	res.sendStatus(200);
});

app.post('/events/:type', function(req, res) {
	var itemId = req.params.id;
	console.log('Send ' + itemId);
});

var server = app.listen(8080, function () {
	console.log('Event generator running in 8080'); 
});