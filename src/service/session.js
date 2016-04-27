
var UserService = require('./user.js');
var User = require('../model/user');
var jwt    = require('jsonwebtoken');

function authenticate(username, password, salt){

	return new Promise((resolve, reject) => {

        UserService.findOne({username: username}).then(user => {

        	var status;
            if (!user) {
            	reject(Error('User not found'));
            	return;
            }

            user.verifyPassword(password, function(err, isMatch) {
                
                if (err) {  
                	reject(err);
                }

                if (!isMatch) { 
                    status = 'not match';
                    reject(Error('Password don\'t match'));
                } else {
                	var userId = user._id.toString();
                	var token = jwt.sign(userId, salt);
                	resolve(token);
                }
            });

        })
        .catch(reject);

    });    
}

function verify(token, salt) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, salt, function(err, decoded) {
			if (err){
				reject(err);
			} else {
				resolve(decoded);	
			}
		});
	});
}



module.exports = {
	authenticate,
	verify
};