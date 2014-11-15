var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

var port = process.env.PORT || 5000

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/views/index.html');
})


function init() {

  server.listen(port, function() {
    console.log("Server is listening on port " + port);
  })
}


init();