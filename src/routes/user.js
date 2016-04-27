var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user.js');
var response = require('../response.js');
var auth = require('../auth.js');


router.post('/', function(req, res){
	var user = new User({
    	username: req.body.username,
    	password: req.body.password
  	});

  	user.save(function(err){
  		if(err){
            response.error(res)(response.pubError("Registration error"));
  		} else {
            response.success(res)(user);   
        }
  	});
});

router.get('/', function(req, res){
    User.find({}, function(err, users){
        
    });
});

router.post('/session/', 
    function(req, res){
     
        auth.authenticate(req.body.username, req.body.password).then(
            token => {
                response.success(res)({token: token});
            }
        )
        .catch(err => {
            res.statusCode = 401;
            response.error(res)(response.pubError('Auth error'));
        }); 

    }
);





module.exports = router;