var User = require('./model/user');
var jwt    = require('jsonwebtoken');
var response = require('./response.js');


var salt = "secreettt3213dasdkasjdakj";


function isAuthenticated(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		verify(token)
		.then((decodedId) => {
			req.userId = decodedId;
			next()
		})
		.catch(err => {
			res.statusCode = 401;
			response.error(res)(response.pubError('Wrong token'), 401);
		})
	} else {
		res.statusCode = 401;
		response.error(res)(response.pubError('No token'), 401);
	}
}


function authenticate(username, password){

	return new Promise((resolve, reject) => {

        User.findOne({username: username}, function(err, user){

            if (err) {  
            	reject(err);
            }

            if (!user) {
            	reject(Error('Usern not found'));
            	return;
            }


            user.verifyPassword(password, function(err, isMatch) {
                
                if (err) {  
                	reject(err);
                }

                if (!isMatch) { 
                    status = 'not match'
                    reject(Error('Password don\'t match'));
                } else {
                	var userId = user._id.toString();
                	var token = jwt.sign(userId, salt);
                	resolve(token);
                }
            });
        });

    });    
}

function verify(token) {
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
	isAuthenticated: isAuthenticated,
	authenticate: authenticate,
	verify: verify
}