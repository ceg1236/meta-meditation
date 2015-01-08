angular.module('tsonga.map', [])

.directive('leafletMap', function(Meditators) {
	return {
		restrict:'E',
		scope:{
			state: '='
		},
		link: function(scope, element, attrs) {

			var circle, currentLat, currentLng;
      scope.meditators = []; 
			scope.$watch('state', function(status){
				console.log('Watching', status);

				if (status.meditating) {

				  if (status.mode === 'moving') {
				  	circle = L.circle([currentLat, currentLng], 4, {fillColor: 'red', color: 'red'});
				  } else if (status.mode === 'sitting') {
				  	circle = L.circle([currentLat, currentLng], 4, {fillColor: 'blue', color: 'blue'}); 
				  }
					
					circle.addTo(map);
				} else {
					//remove the circle
					map.removeLayer(circle); 
				}
			}, true);

			scope.$watch('meditators', function(newArray, oldArray, scope) {
				console.log('new:', newArray); 
				for(var i = 0; i < newArray.length; i++) {
					L.circle( newArray[i].latlng, 100, {fillColor: 'green', color: 'green'}).addTo(map);
				}
			});

			var map = L.map(element[0], {
				dragable: true,
				touchZoom: true,
				tap: false,
				zoom: 12, 
				center: [37.741399, -122.43782],
			});

			Meditators.findAll().then(function(res) {
				console.log(res); 

				scope.meditators = res.data; 
			});



			var currentLocation;
			function onLocationFound(e) {
			    var radius = e.accuracy / 2;
			    currentLat = e.latlng.lat;
			    currentLng = e.latlng.lng; 

			    if (currentLocation) { 
			    	currentLocation.setLatLng( e.latlng ); 
			    } else {
			    	currentLocation = L.marker(e.latlng);
			    	currentLocation.addTo(map);
			    }
			    	
			    console.log('latLng ', e.latlng); 

			}

			map.on('locationfound', onLocationFound);

			L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			    maxZoom: 18, 
			    id: 'examples.map-i875mjb7'
			}).addTo(map);
			map.locate( {setView: true, zoom: 12, watch: true });
		}

	}
});