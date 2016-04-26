var express = require('express');
var router = express.Router();
var passport = require('passport');
var response = require('../response.js');
var auth = require('../auth.js');


var Comment = require('../model/comment.js');


router.post('/', auth.isAuthenticated, function(req, res){

    var text = req.body.text;
    var pid = req.body.pid;

    if (!pid){
        var comment = new Comment({
            text: text,
            path: [],
            _author: req.userId
        });
        comment.save(err => {   
            if (err){
                response.error(res)(err);
            } else {
                response.success(res)({comment});
            };
        });
    } else {
        Comment.findOne({
            '_id': pid
        }, function (err, parentComment) {
            if (err){
                response.error(res)(err);
            }

            if (parentComment){

                var newPath = parentComment.path;

                newPath.push(parentComment._id.toString());
                var comment = new Comment({
                    text: text,
                    path: newPath,
                    _author: req.userId
                });

                comment.save(err => {
                    if (err){
                        response.error(res)(err);
                    } else {
                        response.success(res)({comment});
                    }
                });

            } else {
                response.error(res)(response.pubError('Undefined parent comment'));
            }

        });
    }

    

    /*
    var user = new Comment({
        username: req.body.text,
        pid: req.body.pid
    });

    user.save(function(err){
        if(err){
            response.success(res)(err);
        }
        response.success(res)(user);
    });*/
});


router.get('/', function(req, res) {

    Comment
        .find()
        .populate('_author')
        .exec(function (err, comments){
            if (err){
                response.error(req)(err);
            }
           
            var preparedData = comments.map(element => {
                element._author = element._author.toJson();
                return element;
            });

            response.success(res)(preparedData);
        });

});

router.get('/max-depth', function(req, res){
    Comment.aggregate(
    {
        $project: {
            dep: {$size: "$path"}
        }
    }, 
    {
        $sort: {dep: -1}
    }, 
    {
        $limit: 1
    }, function (err, result) {
        if (err) {
            response.error(res)(err);
        } else {
            response.success(res)({max_depth: result[0].dep});
        }
    });


});



module.exports = router;