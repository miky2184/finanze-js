var express  = require('express');
var app      = express();
var port = 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(morgan('dev'));
app.use(methodOverride());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); 

app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

app.listen(port, function () {
    console.log('Express server inizializzato sulla porta ' + port);
});
