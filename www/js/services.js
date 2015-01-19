angular.module('starter.services', ['btford.socket-io', 'starter.controllers'])

.factory('Config', function() {
  return {
    url: 'http://localhost:8003', 
    meditatorID: 123   // TODO: retrieve unique ID from device
  }
})

.factory('mySocket', function(socketFactory, Config) {
  var ioSocket = io(Config.url, {
    // path: '/socket.io'
  }); 

  mySocket = socketFactory({
    ioSocket: ioSocket
  });
  return mySocket; 
})

.factory('Meditators', function($http, Config, mySocket) {
  
  var findAll = function() {
    return $http.get(Config.url + '/meditators'); 
  }

  var meditate = function(mode, latlng){
    mySocket.emit('session-start', latlng); 
    // return $http.put(Config.url + '/meditators/'+ Config.meditatorID, {latlng: latlng}); 
  }

  var terminate = function(meditatorID, latlng) {
    mySocket.emit('session-end'); 
    // return $http.delete(Config.url + '/meditators/' + Config.meditatorID, {latlng: latlng}); 
  }

  return {
    findAll: findAll, 
    meditate: meditate,
    terminate: terminate
  }
});



