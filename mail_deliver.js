const config = require('./config/config.js');
var request = require('request');
var consumer = require("./kafka/consumer");
var nodemailer = require('nodemailer');
const logger = require("./config/logger").createLoggerFactory(global.gConfig['logger']['level'], 'maildeliver', 'main');

const topic = 'mail__notifications';

const eventConsumer = consumer.kafkaConsumer(topic, function (data){
	logger.info('data receive' + data);
	var event = JSON.parse(data);
	sendToMail(event['callback'], event['payload'])
}, 'maildeliver', 'maildeliver-consumer');

function sendToMail(callback, body){

	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: process.env.MAIL_ACCOUNT,
	    pass: process.env.MAIL_PASSWORD
	  }
	});
	var email = body['address'];
	delete body['address']; 
	delete body['mail']; 
	var mailOptions = {
	  from: process.env.MAIL_ACCOUNT,
	  to: email,
	  subject: 'Message receive',
	  text: JSON.stringify(body)
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    logger.error(error);
	  } else {
	    logger.info('Email sent: ' + info.response);
	  }
	}); 
} 