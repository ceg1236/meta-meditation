angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout', function($scope, $timeout, Meditators, $ionicScrollDelegate) {

  $scope.state = {}; 
  $scope.state.meditating = false; 
  $scope.state.mode = null;
  $scope.duration = {value: 1}; 

  $scope.startTimer = function() {
    // pop up a timer selector
    // return time selection
    $scope.state.startTime = Date.now();
    $scope.state.meditating = true; 

    var meditationDuration = $scope.duration.value * 60 * 1000; 

    $scope.state.countDown = true;  
  }

  $scope.movingTap = function() {

    $scope.state.mode = 'moving'; 
    $scope.showTimer = true; 

  }

  $scope.sittingTap = function() {

    $scope.state.mode = 'sitting';  
    $scope.showTimer = true; 
  }

  $scope.endSession = function() {

    $scope.state.meditating = false; 
    $scope.showTimer = false; 
  }
}]);

