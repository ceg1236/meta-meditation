angular.module('tsonga.map', [])

.directive('leafletMap', function(Meditators, mySocket) {
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
					Meditators.meditate(status.mode, [currentLat, currentLng]); 
				} else {
					//remove the circle
					map.removeLayer(circle); 
					Meditators.terminate(scope.meditators.id, [currentLat, currentLng]); 
				}
			}, true);

			scope.$watch('meditators', function(newArray, oldArray, scope) {
				// console.log('meditators ' , scope.meditators); 
				// console.log('newArray ', newArray); 
				// console.log('oldArray ', oldArray); 
				// console.log('scope ', scope); 
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

			var refresh = function() {
				Meditators.findAll().then(function(res) {
					console.log(res); 

					scope.meditators = res.data; 
				});
			};

			refresh();

			mySocket.on('session-end', function(data) {
				refresh(); 
				console.log('someone has ended their session ', data);
			}); 

			mySocket.on('session-start', function(data) {
				refresh(); 
				console.log('someone started a session ', data);
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