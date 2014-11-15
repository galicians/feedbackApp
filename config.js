

config.couchdb = {};
config.twilio = {};

config.couchdb.url = 'https://galicians.cloudant.com';
config.couchdb.port = 443;
config.couchdb.username = 'galicians';
config.couchdb.password = 'escalera';
// PN7aadd9bf290d5ae9b14d7b68fbc3cdfc
config.twilio.account_sid = 'ACb438c1bfff9eb07459aa295d5ba9e7e4';
config.twilio.key = '23be347aac1ac6da40c6da00e966c22d';
config.twilio.smsWebhook = 'http://galicians-smsapp.nodejitsu.com/vote/sms';
config.twilio.voiceWebhook = 'http://galicians-smsapp.nodejitsu.com/vote/voice';
config.disableTwilioSigCheck = false;

module.exports = config;

