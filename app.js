var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

var usersRoutes = require('./src/routes/user.js');
var commentsRoutes = require('./src/routes/comment.js');
var mongoose = require('mongoose');
var router = express.Router();

var port = 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));




var passport = require('passport');


var LocalStrategy = require('passport-local').Strategy;



passport.serializeUser(function(user, done) {
	console.log('store meee');n
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var err;

	if (id == 1){
		var user = {
			id: 1,
			name: 'vasya'
		};
	} else {
		err = 'no user with id ' + id; 
	}
	done(err, user);
});



passport.use(new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	function(username, password, done) {
		
		var user = {
			id: 1,
			name: 'vasya'
		};

		if (username === 'vasya' && password === 'password'){
			return done(null, user);
		} else {
			return done(null, false, { message: 'Incorrect password.' });
		}

	}
));





mongoose.connect('mongodb://localhost:27017/comments');


app.use('/api/v1/user', usersRoutes);
app.use('/api/v1/comment', commentsRoutes);






app.listen(port, function(){
	console.log('Start on ' + port);
});