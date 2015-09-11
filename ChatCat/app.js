var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-Parser');
var session = require('express-session');
var config = require('./config/config.js');
var ConnectMongo = require('connect-mongo')(session);
var mongoose = require('mongoose').connect(config.dbURL);
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var rooms = [];

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.use(session({secret:config.sessionSecret, saveUninitialized:true, resave:true}));
} else {
  app.use(session({
    secret:config.sessionSecret,
    store: new ConnectMongo({
      // url:config.dbURL,
      mongoose_connection:mongoose.connections[0],
      stringify:true
    }),
    saveUninitialized:true,
    resave:true}));
}

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

require('./routes/routes.js')(express, app, passport, config, rooms);

// app.listen(9000, function (argument) {
//   console.log("ChatCAT Working on Port 9000");
//   console.log("Mode: " + env);
// });
app.set('port', process.env.PORT || 9000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);
server.listen(app.get('port'), function () {
  console.log('ChatCAT on Port : ' + app.get('port'));
  console.log("Mode: " + env);
})
