// Load required packages
var mongoose = require('mongoose');

var User = require('../model/user.js');

var CommentSchema = new mongoose.Schema({
	text: {
    	type: String,
    	required: true
  	},
  	path: {
    	type: [{
			type: String,
			index: true,
		}],
    	required: false
  	},
 	_author: { 
 		type: mongoose.Schema.Types.ObjectId, 
 		ref: 'User',
 		required: true
 	}
});


CommentSchema.pre('save', function(callback) {
	var comment = this;
	var userId = this._author;
	User.findOne({_id: userId}, function(err, user) {
		user.numOfComments ++;
		user.save(err => {
			callback();
		})
	});

});


module.exports = mongoose.model('Comment', CommentSchema);