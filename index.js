var express = require("express"), 
	app = express(), 
	bodyParser = require('body-parser'), 
	server = require('http').createServer(app), 
	socketio = require('socket.io')(server, {
		path: '/socket.io'
	}),
	// TEST DATA
	meditators = [
		{id: '1', latlng: [37.771938, -122.459509]}, 
		{id: '2', latlng: [37.770182, -122.456301]}
	];

// process.env.DEBUG = '*'; 
require('./server/socketio')(socketio);

app.use( bodyParser.urlencoded({extended: false}) );
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next(); 
});
app.use(bodyParser.json()); 

app.get('/', function(req, res) {
	res.send('<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>'); 
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

app.put('/meditators/:id', function(req, res) {
	// ID for each device to limit one location per device
	// req will contain latlng
	// socket.emit -- someone is meditating
	var meditatorID = req.query.id;
	var locationArray = req.body.latlng;
	meditators.push({id: meditatorID, latlng: locationArray});
	socketio.emit('new-meditator', {meditators: meditators});
	console.log('request body: ', req.body)
	res.send('putting meditators'); 
});

app.delete('meditators/:id', function(req, res){
	res.send('deleted meditator');
}); 

server.listen(8003); 