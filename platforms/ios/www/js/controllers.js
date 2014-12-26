angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout', function($scope, $timeout) {

  $scope.state = {}; 
  $scope.state.meditating = false; 

  $scope.popupTimer = function() {
    // pop up a timer selector
    // return time selection
    $scope.state.startTime; 
  }

  var startMeditating = function() {

    $scope.state.meditating = true;
    var meditationTime = $scope.popupTimer(); 
    $timeout(function() {
      console.log('timer');   
      $scope.state.meditating = false; 
    }, 4000); 
    
  }

  $scope.movingTap = function() {
    console.log('Finally moving'); 
    $scope.state.mode = 'moving'; 
    $scope.showTimer = true; 
    startMeditating(); 
    $scope.drawMoving = function(location) {
      // Draw moving meditation circle
    }

  }
  // $scope.bar = "bar";
  $scope.sittingTap = function() {
    console.log('Finally sitting'); 
    $scope.state.mode = 'sitting'; 
    $scope.showTimer = true; 
    startMeditating();
    $scope.drawSitting = function(location) {
      // Draw sitting meditation cirlce
    }
  }
}]);

// .controller('ChatsCtrl', function($scope, Chats) {
//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   }
// })

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

// .controller('FriendsCtrl', function($scope, Friends) {
//   $scope.friends = Friends.all();
// })

// .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// })

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true


