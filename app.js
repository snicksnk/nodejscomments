var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var usersRoutes = require('./src/routes/user.js');
var commentsRoutes = require('./src/routes/comment.js');
var mongoose = require('mongoose');
var config = require('./config/config.js')




var port = config.port;

if (process.env.NODE_ENV === 'development'){
	app.use(logger('dev'));	
}

app.use(bodyParser.urlencoded({extended: false}));


//TODO fix comment
mongoose.connect(config.db);



app.use('/api/v1/user', usersRoutes);
app.use('/api/v1/comment', commentsRoutes);



app.listen(port, function () {
	console.log('Start "' + (process.env.NODE_ENV || "production") + '" on ' + port);
});

module.exports = app;