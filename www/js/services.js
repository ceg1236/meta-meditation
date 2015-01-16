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
  return {
    mySocket: mySocket 
  }
})

.factory('Meditators', function($http, Config) {
  
  var findAll = function() {
    return $http.get(Config.url + '/meditators'); 
  }

  var meditate = function(mode, latlng){
    return $http.put(Config.url + '/meditators/'+ Config.meditatorID, {latlng: latlng}); 
  }

  return {
    findAll: findAll, 
    meditate: meditate
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
