var express = require("express"), 
	app = express(), 
	bodyParser = require('body-parser'), 
	meditators = [
		{id: '1', latlng: [37.771938, -122.459509]}, 
		{id: '2', latlng: [37.770182, -122.456301]}
	];
// app.set('view engine', 'html'); 
app.use( bodyParser.urlencoded({extended: false}) );
app.use(function(req, res, next) {

	res.header('Access-Control-Allow-Origin', '*'); 
	next(); 
});

app.get('/', function(req, res) {
	res.send('index');
});

app.post('/', function(req, res) {
	console.log('request body: ', req.body); 
	res.redirect('/');
});

// Getting all meditators for now
// TODO: location-based GET /meditators/at/:lat/:lng
app.get('/meditators', function(req, res) {

	res.send(meditators); 
});

app.put('meditators/:id', function(req, res) {
	// ID for each device to limit one location per device
	// req will contain latlng

	res.send('putting meditators'); 
});

app.delete('meditators/:id', function(req, res){
	res.send('deleted meditator');
}); 

app.listen(8003); 