angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout', function($scope, $timeout, Meditators) {

  $scope.state = {}; 
  $scope.state.meditating = false; 
  $scope.state.mode = null;
  $scope.duration = {};
  $scope.duration.value = 10;

  $scope.startTimer = function() {
    // pop up a timer selector
    // return time selection

    $scope.state.meditating = true; 
    $scope.state.duration = $scope.duration.value; // copy the duration in the state
    $scope.$broadcast('timer-set-countdown', $scope.duration.value);
    $scope.$broadcast('timer-start');
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

    $timeout(function() {
    $scope.$apply(function() {
        $scope.state.meditating = false; 
        $scope.showTimer = false; 
      });
    }, 0);

  }
}]);

