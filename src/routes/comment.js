var express = require('express');
var router = express.Router();
var passport = require('passport');
var response = require('../response.js');
var auth = require('../auth.js');


var Comment = require('../model/comment.js');

var CommentService = require('../service/comment.js');

router.post('/', auth.isAuthenticated, function(req, res){

    var text = req.body.text;
    var pid = req.body.pid;


    CommentService.create({
        text,
        pid,
        authorId: req.userId
    })
    .then(comment => {
        response.success(res)({comment});
    })
    .catch(response.error(res)); 
});



router.get('/', function(req, res) {
    CommentService
        .getNested()
        .then(response.success(res))
        .catch(response.error(res));
});

router.get('/max-depth', function(req, res){
    
    CommentService.getMaxDepth()
        .then(response.success(res))
        .catch(response.error(res));

});



module.exports = router;