const config = require('./config/config.js');
var request = require('request');
var consumer = require("./kafka/consumer");
var nodemailer = require('nodemailer');

const topic = 'mail__notifications';

const eventConsumer = consumer.kafkaConsumer(topic, function (data){
	console.log('data receive');
	console.dir(data);
	var event = JSON.parse(data);
	console.log('notif to send');
	sendToMail(event['callback'], event['payload'])
});

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
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	}); 
} 