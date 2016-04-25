var express = require('express');
var router = express.Router();
var passport = require('passport');


router.post('/', function(req, res){
	res.send({
        status: "success",
        data: {
            id: 22
        }
    });
});


router.get('/', function(req, res){
    res.send({
        data: [
            {
                id: 1,
                text: 'hello',
                user: {
                    id: 1,
                    username: 'vasya'
                },
                sub: [
                    {
                        id: 2,
                        text: 'bue',
                        user: {
                            id: 2,
                            username: 'petya'
                        }
                    },
                    {
                        id: 3,
                        text: 'hello!',
                        user: {
                            id: 3,
                            username: 'fedor'
                        }
                    }
                ]
            },
            {
                id: 4,
                text: 'azaza',
                user: {
                    id: 3,
                    username: 'fedor'
                },
                sub: []
            }
        ]
    });
});

router.get('/max-depth', function(req, res){
	res.send({
        data: {
            max_depth: 100500
        }
    });
});



module.exports = router;