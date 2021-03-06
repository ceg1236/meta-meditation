angular.module('tsonga.map', [])

.directive('leafletMap', function(LocationService, Meditators, mySocket) {
	return {
		restrict:'E',
		scope:{
			state: '=',
			startTimer: '&startTimer'
		},
		link: function(scope, element, attrs) {

			var circle, currentLat, currentLng;
      scope.meditators = []; 
			scope.$watch('state', function(status, previous){

				if (status.meditating && !previous.meditating) {

				  if (status.mode === 'moving') {
				  	circle = L.circle([currentLat, currentLng], 4, {fillColor: 'red', color: 'red'});
				  } else if (status.mode === 'sitting') {
				  	circle = L.circle([currentLat, currentLng], 4, {fillColor: 'blue', color: 'blue'}); 
				  }
					
					circle.addTo(map);
				} else if (!status.meditating && previous.meditating) {	//remove the circle
					if (circle) {
						map.removeLayer(circle); 
					}
				}
			}, true);
			var otherCircles = [];
			scope.$watch('meditators', function(newArray, oldArray, scope) {

				// remove all other circles from the map
				for(var j = 0; j < otherCircles.length; j++){
					map.removeLayer(otherCircles[j]);
				}
				var wasMeditating = scope.state.meditating;
				scope.state.meditating = false;
        // re add all the current ones. keep track of them
				for(var i = 0; i < newArray.length; i++) {
					if (newArray[i].id === Meditators.getCurrentUser().id) {
						scope.state.meditating = true;
						scope.state.mode = newArray[i].mode;
					  if(!wasMeditating){
					  	var timeRemaining = newArray[i].duration - Math.ceil((Date.now()-newArray[i].startTime)/1000);
					    scope.startTimer({time: timeRemaining > 0? timeRemaining : 1});
					  }
						continue; 
					}
					otherCircles.push(L.circle( newArray[i].latlng, 100, {fillColor: 'green', color: 'green'}).addTo(map));
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
				LocationService.onLocationFound(e);

			    var radius = e.accuracy / 2;
			    currentLat = e.latlng.lat;
			    currentLng = e.latlng.lng; 

			    if (currentLocation) { 
			    	currentLocation.setLatLng( e.latlng ); 
			    } else {
			    	currentLocation = L.marker(e.latlng);
			    	currentLocation.addTo(map);
			    }
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