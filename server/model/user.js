var client = require('../redisClient.js');
var q = require('q');

var User = function (obj) {
	this.id = obj.id;
	this.name = obj.name;
	// this.session = false;
};

var handlePromise = function(deferred, data) {
	return function(error, value) {
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
		client.set('user:'+self.id, JSON.stringify(self), function(error, value) {
			if (error) {
			deferred.reject(new Error(error));
			} else {
				deferred.resolve(self);
			}
		});
	}
	return deferred.promise;
};

User.prototype.startSession = function() {
	var deferred = q.defer();
	var self = this;

	client.set('sessions:'+self.id, true, function(err, val) {
		if (err) {
			deferred.reject(new Error(err));
		} else {
			deferred.resolve(val);
		}
	});
	return deferred.promise;
}

User.prototype.stopSession = function() {
	var deferred = q.defer();
	var self = this;

	client.del('sessions:'+self.id, function(err, val) {
		if (err) {
			deferred.reject(new Error(err));
		} else {
			deferred.resolve(val);
		}
	});
	return deferred.promise;
}

User.findById = function(id) {
	var deferred = q.defer();
	if(id === undefined){
		deferred.reject(new Error("Please provide an id"));
		return;
	}
	client.get('user:'+id, function(error, value) {
		if (error) {
			deferred.reject(new Error(error));
		} else {
			deferred.resolve( value === null ? null : new User(JSON.parse(value)) );
		}
	});
	return deferred.promise;
};


module.exports = User;
