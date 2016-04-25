var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('./model/user.js');




router.get('/', passport.authenticate('local', {session: false}), function(req, res){
	res.send('Hello World!');
});


router.post('/comment', function(req, res){
	res.send('Hello ' + req.body.name);
});


router.get('/comment', function(req, res){
	res.send([{_id: 1, title: 'aaa'}]);
});

router.get('/comment/max-depth', function(req, res){
	res.send(100500);
});


router.post('/user', function(req, res){

	console.log('user');

	var user = new User({
    	username: req.body.username,
    	password: req.body.password
  	});

  	user.save(function(err){
  		console.log('err 2 1 11', err);
  		if(err){
  			res.send(err);
  		}
  		res.json(user);
  	});

  	console.log('savee');

});

router.get('/user', function(req, res){
	res.send([]);
});

router.post('/user/login', passport.authenticate('local',  { failureRedirect: '/login', session: false }), function(req, res){
	res.send(['ok']);
});




module.exports = router;