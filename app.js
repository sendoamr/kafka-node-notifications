const config = require('./config/config.js');
const logger = require("./config/logger").createLoggerFactory(global.gConfig['logger']['level'], 'app', 'main');
var express = require("express"); 
const mongo = require('./config/mongo');

//Express config
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var producer = require("./kafka/producer");

const topic = 'evt__events';
const eventsProducer = producer.kafkaProducer(topic, 'app', 'main-producer');

const genMessage = body => new Buffer.from(JSON.stringify(body));

mongo.getEventTypes(function(response) {
	main(response)
}, function(error){
	//If mongo produce error load the default event types in the json config
	main(require('./config/events.json'));
});

var main = function(eventTypes) {
	app.post('/events', function(req, res) {
		var data = req.body;
	    eventTypes.forEach(function(event){
	    	var time = new Date().getTime();
	    	value['payload'] = data;
	    	value['event_time'] = time;
	    	producer.sendMessage(eventsProducer, topic, event);
	    	logger.info("Message sended to events")
	    });
	   	res.sendStatus(200);
	});

	//TODO to development
	app.post('/events/:type', function(req, res) {
		var itemId = req.params.id;
		logger.info('Send specify event type' + itemId);
	});

	var server = app.listen(8080, function () {
		logger.info('Event generator running in 8080'); 
	});
}
