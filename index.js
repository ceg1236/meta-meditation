var express = require("express"), 
	app = express(), 
	bodyParser = require('body-parser');
// app.set('view engine', 'html'); 
app.use( bodyParser.urlencoded({extended: false}) );

app.get('/', function(req, res) {
	res.send('index');
});

app.post('/', function(req, res) {
	console.log('request body: ', req.body); 
	res.redirect('/');
});

app.get('/meditators/at/:lat/:lng', function(req, res) {
	res.send('gettin meditators'); 
});

app.put('meditators/at/:lat/:lng', function(req, res) {
	res.send('putting meditators'); 
});


app.listen(8003); 