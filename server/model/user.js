var client = require('../redisClient.js');
var q = require('q');

var User = function (obj) {
	this.id = obj.id;
	this.name = obj.name;
};

User.prototype.save = function() {
	var deferred = q.defer();
	var self = this;
	client.set('user:'+this.id, JSON.stringify(this), function(error, text) {
		if (error) {
			deferred.reject(new Error(error));
		} else {
			deferred.resolve(self);
		}
	});
	return deferred.promise;
};


module.exports = User;
