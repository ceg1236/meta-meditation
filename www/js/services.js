angular.module('starter.services', ['btford.socket-io', 'starter.controllers'])

.factory('Config', function() {
  return {
    url: 'http://localhost:8003', 

  }
})

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

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

.factory('LocationService', function() {
  var currentLat;
  var currentLng;
  var onLocationFound = function(e){
    currentLat = e.latlng.lat;
    currentLng = e.latlng.lng; 
  };
  var getCurrentLat = function(){
    return currentLat;
  };
  var getCurrentLng = function(){
    return currentLng;
  };
  return {
    onLocationFound: onLocationFound,
    getCurrentLat: getCurrentLat,
    getCurrentLng: getCurrentLng
  }
})

.factory('Meditators', function($http, Config, mySocket, $q, $localStorage) {
  $localStorage.set('user', $localStorage.get('user') || "{}");
  var user = $localStorage.getObject('user');
  var promise = $http.post(Config.url + '/api/handshake', user)
    .then(function(resp) {
      if (resp.data.id) {
        $localStorage.setObject('user', resp.data);
        user = $localStorage.getObject('user');
      }
    });
  // write a functional-like function that allows us to wrap 
  // these methods and run them only after the handshake promise is resolved.
  // this will allow us to reuse them and add the handshake pre-requirement without modifying them! Saweeet!.

  var afterHandshake = function(fn) {
    return function() {
      var args = arguments;
      var self = this;
      return promise.then(function(resp){
        return fn.apply(self, args);
      });
    }
  }

  var findAll = function() {
    return $http.get(Config.url + '/meditators'); 
  }

  var meditate = function(mode, latlng, duration) {
    return $http.post(Config.url + '/api/sessions', {id: user.id, mode: mode, latlng: latlng, duration: duration});
  }

  var terminate = function(meditatorID, latlng) {
    return $http.delete(Config.url + '/api/sessions/' + meditatorID)
  }

  return {
    findAll: afterHandshake(findAll), 
    meditate: afterHandshake(meditate),
    terminate: afterHandshake(terminate),
    getCurrentUser: function(){ return user; }
  }
});



