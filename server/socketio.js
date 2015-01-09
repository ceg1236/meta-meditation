'use strict';

function onDisconnect(socket) {
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

		onConnect(socket);
		console.info('CONNECTED'); 
	});
}