
angular.module('timer-select', [])

.directive('timerSelect', function( ) {
	return {
		templateUrl: 'timer-select/timer-select.html',
		restrict: 'E', 
		scope: {
			duration: '='
		}, 
		link: function(scope, element, attributes) {

			scope.timeOptions = [];
			for(var i = 0; i <= 60; i++) {
				scope.timeOptions.push(i);
			}

			// Move some ctrl timer logic here
			// Show countdown of timer 
			// On completion, end session, revert to original state
			scope.$watch('duration', function(duration) {
		    var meditationDuration = duration ;//* 60 * 1000;
		    var startTime = Date.now();  
		    var endTime = startTime + meditationDuration;
				
				// Check meditationDuration for counting down to zero
				if (meditationDuration !== null && Date.now() > endTime) {
					console.log('session expired');
				}
			});
		}
	}
})