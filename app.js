var express = require('express');
var app = express();
var path = require('path')
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var twilio = require('twilio')
var events = require('./lib/events')
var utils = require('./lib/utils')
var bodyParser = require('body-parser')
var config = require('./lib/config')
var routes = require('./routes')
var port = process.env.PORT || 5000


app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');

app.use(bodyParser.urlencoded({ extended: false }))


function init() {
  server.listen(port, function() {
    console.log("Server is listening on port " + port);
  })
}


io.sockets.on('connection', function(socket) {
    socket.on('event', function(event) {
      console.log("this is the event", event)
      console.log('inside io.sockets.on')
      console.log(socket.id)
        socket.join(event);
    });
});



init();

require('./routes')(app, io)