var client = require('../redisClient.js');
var q = require('q');
var socket = require('../socketio.js');

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

User.prototype.startSession = function(sessionObj) {
	var deferred = q.defer();
	var self = this;
	sessionObj.startTime = Date.now();
	client.set('sessions:'+self.id, JSON.stringify(sessionObj), function(err, val) {
		if (err) {
			deferred.reject(new Error(err));
		} else {
			client.expire('sessions:'+self.id, sessionObj.duration, function(err, reply) {
				setTimeout(socket.sessionEnd.bind(socket), sessionObj.duration * 1000);

				deferred.resolve(val);
			});
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
		return deferred.promise;
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

User.findSessions = function() {
	var deferred = q.defer();
	// Query redis once for each ID, but do it as a transaction.. whatever that means
	var transaction = client.multi();
	client.keys('sessions:*', function(error, keys) {

		if (error) {
			deferred.reject(new Error(error));
		} else {
			keys.forEach(function(key) {
				transaction.get(key)
			});
			transaction.exec(function(err, replies){
				var parsedReplies = replies.map(function(val){
					try {
						return JSON.parse(val);
					} catch(err){
 						return val;
					}
				});
				deferred.resolve(parsedReplies);
			});
		}
	});
	return deferred.promise;
};

module.exports = User;
