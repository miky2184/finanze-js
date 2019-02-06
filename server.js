var express  = require('express');
var app      = express();
var port = 8081;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public')); 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.get('*', function(req, res) {
        res.sendFile('/index.html');
    });

app.listen(port, function () {
console.log('Express server inizializzato sulla porta ' + port);
});
