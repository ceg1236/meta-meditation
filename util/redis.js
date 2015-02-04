var redis = require('redis'); 

var client = redis.createClient(6379, 'localhost', {no_ready_check: true});

module.exports = client;