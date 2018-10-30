var mongoose = require('mongoose');
//Important set config before add the mongo implementation
mongoose.connect(global.gConfig['mongo']['uri'], {useNewUrlParser: true });

var getEventTypes = function (callback, error) {
	var eventSchema = new mongoose.Schema({
	  id: String,
	  location: String,
	  callback: String
	}, { collection: 'EventTypes' });
	var EventTypes = mongoose.model('EventTypes', eventSchema);

	EventTypes.find({}, function(err, events) {
	    if (!err) callback(events);
	    else error();
	});
}

module.exports = {
  getEventTypes: getEventTypes
};