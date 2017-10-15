var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');




var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client/dist')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//passport control
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
          secret: 'hello! TMY', 
          resave: true, 
          saveUninitialized: true
        }));

var User = require('./models/account');
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Set Routers
var account = require('./routes/account');
var tasks = require('./routes/tasks');
var index = require('./routes/index');
app.use('/account', account);
app.use('/api', tasks);
app.use('/', index);

var comment = require('./routes/comment');
app.use('/comment',comment);

var mongoose = require('mongoose');
mongoose.connect('mongodb://ayuan:ayuan@ds157444.mlab.com:57444/ayuan-first', function(err){
    if(err){
        console.log('Could not connect to mongodb ');
    }
    else console.log('connect to mongodb');
});

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('private.pem', 'utf8');
var certificate = fs.readFileSync('file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 8080;
var SSLPORT = 8081;

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});


// var port = 8080;
// app.listen(port, function(){
// 	console.log("server listening on port ", port);
// });