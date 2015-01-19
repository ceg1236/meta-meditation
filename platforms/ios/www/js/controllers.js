angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout', function($scope, $timeout, Meditators) {

  $scope.state = {}; 
  $scope.state.meditating = false; 
  $scope.state.mode = null;
  $scope.endTime = {value: undefined}; 

  $scope.startTimer = function() {
    var hours = $scope.endTime.value.getHours();
    var minutes = $scope.endTime.value.getMinutes() + hours*60;
    var seconds = $scope.endTime.value.getSeconds() + minutes*60;
    $scope.state.endTime = Date.now() + seconds*1000; 
    // pop up a timer selector
    // return time selection
    $scope.state.meditating = true; 

    $scope.state.startTime = Date.now();
 
    console.log($scope.state.endTime); 
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

