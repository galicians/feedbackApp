var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))


app.get('/', function(req,res) {
  res.sendFile(__dirname + '/views/index.html')
})


function init() {

  server.listen(5000, function() {
    console.log("the server is listening on port 5000")
  })
}


init()