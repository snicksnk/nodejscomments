"use strict";

var MongooseService = require('./mongooseService.js');
var User = require('../model/user.js');



class UserService extends MongooseService {
	constructor(){
		super(User);
	}

	getOrderedList(){
		return new Promise((resolve, reject) => {
			this.Shema
				.find()
				.sort({numOfComments: -1})
				.then(users => {
					var result = users.map(user => user.toJson());
					resolve(result);
				})
				.catch(reject);
		});
		
	}
}


module.exports = new UserService();