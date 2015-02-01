angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout', function($scope, $timeout, Meditators, $ionicScrollDelegate) {

  $scope.state = {}; 
  $scope.state.meditating = false; 
  $scope.state.mode = null;
  $scope.duration = {value: null}; 

  $scope.startTimer = function() {
    // pop up a timer selector
    // return time selection

    $scope.state.meditating = true; 
    // $scope.duration.value = 
    
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

