console.log('ONly if first line run'); 
angular.module('meta.timer', [])

.directive('timer', function( ) {
	return {
		templateUrl: 'timer/timer.html',
		restrict: 'E', 
		scope: {
			duration: '='
		}, 
		link: function(scope, element, attributes) {
			console.log('log in the link'); 
			// Move some ctrl timer logic here
			// Show countdown of timer 
			// On completion, end session, revert to original state
		}
	}
})