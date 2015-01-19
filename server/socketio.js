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


module.exports = function(socketio) {

	// setInterval(function() {
	// 	socketio.emit('meditating', {latlng: 123});
	// 	console.log('socketio emittin'); 
	// }, 2000); 

	console.log('socketio running'); 
	socketio.on('connection', function(socket) {
		// socket.address = socket.handshake.address !== null ?
		// 				socket.handshake.address.address + ':' + socket.handshake.address.port :
		// 				process.env.DOMAIN;

		socket.connectedAt = new Date(); 

		socket.on('disconnect', function() {
			onDisconnect(socket);
			console.info('DISCONNECTED'); 
		});

		socket.on('session-start', function() {
			socket.broadcast.emit('session-start'); 
			
			console.log('session start', socket.id); 
		});

		socket.on('session-end', function() {
			// Delete from redis
			// Tell everybody -- ie remove from map
			socket.broadcast.emit('session-end'); 
			console.log('session end ', socket.id); 
		});

		onConnect(socket);
		console.info('CONNECTED'); 
	});
}