"use strict";

var MongooseService = require('./mongooseService.js');
var User = require('../model/user.js');


var usersService = new MongooseService(User);


module.exports = usersService;