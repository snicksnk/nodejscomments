var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user.js');
var response = require('../response.js');
var auth = require('../auth.js');
var UserService = require('../service/user.js');

router.post('/', function(req, res){

    UserService.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(response.success(res))
    //TODO add original error data
    .catch(err => {
        response.error(res)(response.pubError("Registration error", err));
    })
});

router.get('/', function(req, res){
    UserService.find()
        .then(response.success(res))
        .catch(response.error(res));
});

router.post('/session/', 
    function(req, res){
        auth.authenticate(req.body.username, req.body.password)
        .then(
            token => {
                response.success(res)({token});
            }
        )
        .catch(err => {
            res.statusCode = 401;
            response.error(res)(response.pubError('Auth error'));
        }); 
    }
);



module.exports = router;