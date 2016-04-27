"use strict";
var jwt    = require('jsonwebtoken');
var response = require('./response.js');
var session = require('./service/session.js');


var config = require('../config/config.js');

var salt = config.salt;



function verify(token){
	return session.verify(token, salt);
}


function authenticate(username, pasword){
	return session.authenticate(username, pasword, salt);
}


function isAuthenticated(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		verify(token)
		.then((decodedId) => {
			req.userId = decodedId;
			next();
		})
		.catch(err => {
			res.statusCode = 401;
			response.error(res)(response.pubError('Wrong token'), 401);
		});
	} else {
		res.statusCode = 401;
		response.error(res)(response.pubError('No token'), 401);
	}
}


module.exports = {
	isAuthenticated: isAuthenticated,
	authenticate: authenticate,
};