var express = require('express');
var path = require('path');
var config = require('./config/config.js');
var knox = require('knox');
var fs = require('fs');
var os = require('os');
var formidable = require('formidable');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', (process.env.PORT || 9000));
app.set('host', config.host);

var knoxClient = knox.createClient({
  key: config.S3AccessKey,
  secret: config.S3Secret,
  bucket: config.S3Bucket
});

require('./routes/routes.js')(express, app, formidable, fs, os);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(app.get('port'), function () {
  console.log('PhotoGRID Running on port: ' + app.get('port'));
});
