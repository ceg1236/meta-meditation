var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    User = require('./server/model/user.js'),
		socket = require('./server/socketio')(io);


app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.json());

// Getting all meditators for now
// TODO: location-based GET /meditators/at/:lat/:lng

app.get('/meditators', function (req, res) {
		User.findSessions()
		.then(function(sessions) {
			res.send(sessions);
		});
});

app.post('/api/handshake', function(req, res) {

	var user = new User({name: req.body.name, id: req.body.id})
	if (user.id) {
		User.findById(user.id).then(function(exisitingUser) {
			res.status(200).send(exisitingUser);
		});
	} else {
		user.save().then(function(value) {
			res.status(200).send(value);
		});
	}
});

app.post('/api/sessions/', function(req, res) {

	User.findById(req.body.id)
	.then(function(user) {
		if (user === null) {
			res.sendStatus(400);
		} else {

			user.startSession(req.body).then(function(session) {
				// emit socket event: session-started
				socket.socketStart();
				res.status(200).send(session);
			});
		}
	});
});

app.delete('/api/sessions/:id', function(req, res) {
	User.findById(req.params.id)
	.then(function(user) {
		user.stopSession().then(function(session) {
			socket.socketEnd();
			res.status(200).send({'message':'Namaste'});
		});
	});
});

server.listen(8003);

module.exports = app;