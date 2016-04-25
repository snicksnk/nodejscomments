var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../model/user.js');


router.post('/', function(req, res){


  res.send({
      status : "success",
  });

/*
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
*/
});

router.get('/', function(req, res){


  res.send({
      data: {
            users: [
                {
                    id: 1,
                    username: 'Vasya',
                    total_comments: 23
                },
                {
                    id: 2,
                    username: 'Petya',
                    total_comments: 1
                }
            ]
      }
  });


});

router.post('/session/', function(req, res){
	res.send({
        status: "success" 
    });
});




module.exports = router;