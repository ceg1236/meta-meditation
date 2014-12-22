angular.module('tsonga.map', [])

.directive('leafletMap', function() {
	
	return {
		restrict:'EA',
		replace: true,
		scope:{

		},
		template: '<div style="height: 400px"></div>',
		link: function(scope, element, attrs) {

			var map = L.map(element[0], {
				dragging:true,
				touchZoom:true,
				tap:false,
				zoom: 12, 
				center: [37.741399, -122.43782],
			});

			function onLocationFound(e) {
			    var radius = e.accuracy / 2;

			    L.marker(e.latlng).addTo(map)
			        .bindPopup("You are here!").openPopup();

			    L.circle(e.latlng, radius).addTo(map);
			}

			map.on('locationfound', onLocationFound);

			L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			    maxZoom: 18, 
			    id: 'examples.map-i875mjb7'
			}).addTo(map);
			map.locate( {setView: true, zoom: 12 });
		}
	}
});