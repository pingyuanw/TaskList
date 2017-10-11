var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var account = require('./routes/account');
var tasks = require('./routes/tasks');

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
app.use('/account', account);
app.use('/api', tasks);

var mongoose = require('mongoose');
mongoose.connect('mongodb://ayuan:ayuan@ds157444.mlab.com:57444/ayuan-first', function(err){
    if(err){
        console.log('Could not connect to mongodb ');
    }
    else console.log('connect to mongodb');
});

var port = 3000;
app.listen(port, function(){
	console.log("server listening on port ", port);
})