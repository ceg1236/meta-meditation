angular.module('starter.services', ['btford.socket-io', 'starter.controllers'])

.factory('Config', function() {
  return {
    url: 'http://localhost:8003', 
    // meditatorID: 123   // TODO: retrieve unique ID from device
  }
})

.factory('mySocket', function(socketFactory, Config) {
  var ioSocket = io(Config.url); 
  mySocket = socketFactory({
    ioSocket: ioSocket
  });
  mySocket.on('connected', function(data) {
    mySocket.id = data; // Decorating socket with id
  });
  return mySocket; 
})

.factory('Meditators', function($http, Config, mySocket) {
  
  var findAll = function() {
    return $http.get(Config.url + '/meditators'); 
  }

  var meditate = function(mode, latlng) {
    mySocket.emit('session-start', latlng); 
  }

  var terminate = function(meditatorID, latlng) {
    mySocket.emit('session-end'); 
  }

  return {
    findAll: findAll, 
    meditate: meditate,
    terminate: terminate
  }
});



