angular.module('tsonga.map', [])

.directive('leafletMap', function() {
	

	return {
		link: function(scope, elmt, attrs) {
			console.log('el', elmt); 
			console.log('attr', attrs); 
			var map = L.map(attrs.id).setView([51.505, -0.09], 13);
			L.tileLayer('http://{s}.tiles.mapbox.com/v3/ceg1236.kiag8pom/{z}/{x}/{y}.png', {
			    maxZoom: 18
			}).addTo(map);
		}
	}
});