const _ = require('lodash');

const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'local';
const environmentConfig = config[environment];
var finalConfig = _.merge(defaultConfig, environmentConfig);
//Override kafka host with environment variable
if (process.env.KAFKA_HOST) {
	finalConfig['kafka-conf']['metadata.broker.list'] = process.env.KAFKA_HOST +':'+(process.env.KAFKA_PORT ? process.env.KAFKA_PORT : '9092');
}
global.gConfig = finalConfig;
