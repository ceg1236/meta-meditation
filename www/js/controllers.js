angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout','Meditators','LocationService', function($scope, $timeout, Meditators, LocationService) {

  $scope.state = {}; 
  $scope.state.meditating = false; 
  $scope.state.mode = null;
  $scope.duration = {};
  $scope.duration.value = 10;
  $scope.startTimer = function(timeRemaining) {
    // pop up a timer selector
    // return time selection
    console.log("Start Timer RUNNING");
    $scope.state.meditating = true;
    $scope.showTimer = true;
    $scope.state.duration = timeRemaining || $scope.duration.value; // copy the duration in the state
    $scope.$broadcast('timer-set-countdown', $scope.state.duration);
    $scope.$broadcast('timer-start');
    $scope.state.countDown = true;  
    Meditators.meditate($scope.state.mode, [LocationService.getCurrentLat(), LocationService.getCurrentLng()], $scope.state.duration); 
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
        Meditators.terminate(Meditators.getCurrentUser().id);

      });
    }, 0);

  }
}]);

