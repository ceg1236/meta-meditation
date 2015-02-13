'use strict';

function onDisconnect(socket) {
  // Remove meditator from map
  socket.broadcast.emit('session-end');
}

function onConnect(socket) {
  socket.on('info', function (data) {
    console.info('INFO', socket.address);
  });
  socket.emit('connected', socket.id);
}

module.exports = function (socketio) {

  socketio.on('connection', function (socket) {

    socket.connectedAt = new Date();

    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('DISCONNECTED');
    });

    onConnect(socket);
    console.info('CONNECTED');
  });

  return {
    socketStart: function() {
      socketio.emit('session-start');
    }, 
    socketEnd: function() {
      socketio.emit('session-end');
    }
  }
};