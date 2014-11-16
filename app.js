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

var port = process.env.PORT || 5000

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req,res) {
  res.render('index', { title: 'Pablo feedbackApp'});
})


function init() {

  // setEventHandlers();

  server.listen(port, function() {
    console.log("Server is listening on port " + port);
  })
}

// var setEventHandlers = function() {
//   io.on("connection", onSocketConnection);
// };



io.sockets.on('connection', function(socket) {
    socket.on('event', function(event) {
      console.log("this is the event", event)
      console.log('inside io.sockets.on')
      console.log(socket.id)
        socket.join(event);
    });
});



app.post('/vote/sms', function(request, response) {
  console.log(request)
    console.log(config.twilio.smsWebhook)
    console.log( config.twilio.key)
    if (twilio.validateExpressRequest(request, config.twilio.key, {url: config.twilio.smsWebhook}) || config.disableTwilioSigCheck) {
      console.log('inside of the if')
        response.header('Content-Type', 'text/xml');
        var body = request.param('Body').trim();

        // the number the vote it being sent to (this should match an Event)
        var to = request.param('To');

        // the voter, use this to keep people from voting more than once
        var from = request.param('From');

        events.findBy('phonenumber', to, function(err, event) {
            if (err) {
                console.log(err);
                // silently fail for the user
                response.send('<Response></Response>');
            }
            else if (event.state == "off") {
                response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
            }
            else if (!utils.testint(body)) {
                console.log('Bad vote: ' + event.name + ', ' + from + ', ' + body);
                response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and '+ event.voteoptions.length +'</Sms></Response>');
            }
            else if (utils.testint(body) && (parseInt(body) <= 0 || parseInt(body) > event.voteoptions.length)) {
                console.log('Bad vote: ' + event.name + ', ' + from + ', ' + body + ', ' + ('[1-'+event.voteoptions.length+']'));
                response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and '+ event.voteoptions.length +'</Sms></Response>');
            }
            else {

          var vote = parseInt(body);

                events.saveVote(event, vote, from, function(err, res) {
                    if (err) {
                        response.send('<Response><Sms>We encountered an error saving your vote. Try again?</Sms></Response>');
                    }
                    else {
                        console.log('Accepting vote: ' + event.name + ', ' + from);
                         io.sockets.in(event.shortname).emit('vote', vote);
                        response.send('<Response><Sms>Thanks for your vote for ' + res.name + '. Powered by Makers Academy.</Sms></Response>');
                    }
                });
            }
        });
    }
    else {
        response.statusCode = 403;
        response.render('forbidden');
    }
})



app.get('/events/:shortname', function(req, res){

    events.findBy('shortname', req.params.shortname, function(err, event) {
        if (event) {


            res.render('event', {
                name: event.name, shortname: event.shortname, state: event.state,
                phonenumber: utils.formatPhone(event.phonenumber), voteoptions: JSON.stringify(event.voteoptions)
            });
        }
        else {
            res.statusCode = 404;
            res.send('We could not locate your event');
        }
    });
}
)








init();