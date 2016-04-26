// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



var UserSchema = new mongoose.Schema({
	username: {
    	type: String,
    	unique: true,
    	required: true
  	},
  	password: {
    	type: String,
    	required: true
  	},
  	numOfComments: {
  		type: Number,
  		default: 0
  	}
});

UserSchema.methods.verifyPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.toJson = function(){
	return {
		_id: this._id,
		username: this.username
	};

}



UserSchema.pre('save', function(callback) {

	var user = this;

	if (!user.isModified('password')) return callback();

	bcrypt.genSalt(5, function(err, salt) {
	    if (err) return callback(err);

	    bcrypt.hash(user.password, salt, null, function(err, hash) {
	    	if (err) return callback(err);
	    	user.password = hash;
	    	callback();
	    });
  	});

});


module.exports = mongoose.model('User', UserSchema);