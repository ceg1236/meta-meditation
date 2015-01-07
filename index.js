var express = require("express"), 
	app = express(), 
	bodyParser = require('body-parser');
app.set('view engine', 'ejs'); 
app.use( bodyParser.urlencoded({extended: false}) );

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/', function(req, res) {
	console.log('request body: ', req.body); 
	res.redirect('/');
});
app.listen(8003); 