'use strict';

function onDisconnect(socket) {
	// Remove meditator from map
	socket.broadcast.emit('session-end'); 
	console.log('onDisconnect fn'); 
}

function onConnect(socket) {
	socket.on('info', function(data) {
		console.info('INFO', socket.address);
	});
}


module.exports = function(socketio, dataStore) {


	console.log('socketio running'); 
	socketio.on('connection', function(socket) {

		socket.connectedAt = new Date(); 

		socket.on('disconnect', function() {
			onDisconnect(socket);
			console.info('DISCONNECTED'); 
		});

		socket.on('session-start', function(data) {

		  dataStore.meditators.push({id: socket.id, latlng: data});
			socket.broadcast.emit('session-start'); 

			console.log('session start', socket.id);
			console.log('session data ', data);  
		});

		socket.on('session-end', function() {
			// Delete from redis
			// Tell everybody -- ie remove from map
			dataStore.meditators = dataStore.meditators.filter(function(item) {
				return item.id !== socket.id; 
			});
			socket.broadcast.emit('session-end'); 

			console.log('session end ', socket.id); 
			console.log('meditators after session end ', dataStore.meditators); 
		});

		onConnect(socket);
		console.info('CONNECTED'); 
	});
}