var client = require('../redisClient.js');
var q = require('q');

var User = function (obj) {
	this.id = obj.id;
	this.name = obj.name;
};

var handlePromise = function(deferred, data) {
	console.log('out', deferred);
	return function(error, value) {
		console.log('in', value);
		if (error) {
			deferred.reject(new Error(error));
		} else {
			deferred.resolve(data || JSON.parse(value));
		}
	}
}

User.prototype.save = function() {
	var deferred = q.defer();
	var self = this;
	// Check if ID is defined
	// Not defined

	if (self.id === undefined) {
	// Set up new ID key client.INCR(key, fn(err, id))
	// Set id to user and call save() again 

		client.incr('lastUserId', function(err, value) {
			self.id = value;
			self.save().then(function(value) {
				handlePromise(deferred, value)(null, value);
			}); 
		});
	} else { // ID Defined
		client.set('user:'+self.id, JSON.stringify(self), handlePromise(deferred, self));
	}
	return deferred.promise;
};

User.findById = function(id) {
	var deferred = q.defer();
	client.get('user:'+id, handlePromise(deferred));
	return deferred.promise;
};


module.exports = User;
