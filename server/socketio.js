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

module.exports = {
  sessionStart: function() {
    if(!this.socketio){
      throw "Must setup the module before using";
    }
    this.socketio.emit('session-start');
  }, 
  sessionEnd: function() {
    if(!this.socketio){
      throw "Must setup the module before using";
    }
    this.socketio.emit('session-end');
  },
  setup: function (socketio) {
    this.socketio = socketio;
    socketio.on('connection', function (socket) {

      socket.connectedAt = new Date();

      socket.on('disconnect', function () {
        onDisconnect(socket);
        console.info('DISCONNECTED');
      });

      onConnect(socket);
      console.info('CONNECTED');
    });
    return this;
  }
};

