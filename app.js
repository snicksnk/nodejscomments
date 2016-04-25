var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

var usersRoutes = require('./src/routes/user.js');
var commentsRoutes = require('./src/routes/comment.js');
var mongoose = require('mongoose');
var router = express.Router();

var port = 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));



mongoose.connect('mongodb://localhost:27017/comments');



app.use('/api/v1/user', usersRoutes);
app.use('/api/v1/comment', commentsRoutes);






app.listen(port, function(){
	console.log('Start on ' + port);
});