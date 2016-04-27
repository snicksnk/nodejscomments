var request = require('supertest');
var assert = require('chai').assert;
var chai = require("chai");

var app = require('../app');
var mongoose = require('mongoose');

var config = require('../config/config.js');




var id = 0;

var user = {
    username: 'test',
    password: 'test'
};

var secondUser = {
    username: 'test2',
    password: 'test'    
};

var thirdUser = {
    username: 'test3',
    password: 'test' 
};

var wrongPasswordUser = {
    username: 'test',
    password: 'passa'
};

var wrongLoginUser = {
    username: 'test22',
    password: 'test'
};



describe('Testing REST API', function () {

    before(function (done) {
        
        function clearDB() {
            for (var i in mongoose.connection.collections) {
              mongoose.connection.collections[i].remove(function() {});
            }
            return done();
        }


        if (mongoose.connection.readyState === 0) {
            //TODO fix it
            mongoose.connect(config.db, function (err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {
            return clearDB();
        }
    });

    it('Login before create user', function(done){
        request(app)
            .post('/api/v1/user/session')
            .send(user)
            .type('form')
            .expect("Content-type",/json/)
            .expect(401)
            .end((err, res) => {
                assert.equal(res.body.status, 'fail');
                assert.equal(res.body.error, 'Auth error');
                done(err);
            });
    });


    it('Create user', function (done) {
        request(app)
            .post('/api/v1/user')
            .type('form')
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .send(user)
            .end((err, res) => {
                assert.equal(res.body.status, 'success');
                assert.typeOf(res.body.data.user._id, 'string');
                done(err);
            });
    });


    it('Create second user', function (done) {
        request(app)
            .post('/api/v1/user')
            .type('form')
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .send(secondUser)
            .end((err, res) => {
                assert.equal(res.body.status, 'success');
                assert.typeOf(res.body.data.user._id, 'string');
                done(err);
            });
    });

    it('Create third user', function (done) {
        request(app)
            .post('/api/v1/user')
            .type('form')
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .send(thirdUser)
            .end((err, res) => {
                assert.equal(res.body.status, 'success');
                assert.typeOf(res.body.data.user._id, 'string');
                done(err);
            });
    });



    it('Create user again', function (done) {
        request(app)
            .post('/api/v1/user')
            .type('form')
            .expect("Content-type",/json/)
            .expect(200) 
            .send(user)
            .end((err, res) => {
                assert.equal(res.body.status, 'fail');
                assert.equal(res.body.error, 'Registration error');
                done(err);
            });
    });


    it('Login with wrong password', function(done){
        
        request(app)
            .post('/api/v1/user/session')
            .type('form')
            .expect("Content-type",/json/)
            .expect(401)
            .send(wrongPasswordUser)
            .end((err, res) => {
                assert.equal(res.body.status, 'fail');
                assert.equal(res.body.error, 'Auth error');
                done(err);
            });
    });

    it('Login with wrong username', function(done){
        
        request(app)
            .post('/api/v1/user/session')
            .type('form')
            .expect("Content-type",/json/)
            .expect(401)
            .send(wrongLoginUser)
            .end((err, res) => {
                assert.equal(res.body.status, 'fail');
                assert.equal(res.body.error, 'Auth error');
                done(err);
            });
    });

    describe("Try to acess without tokens", function() {

            it('Post comment', function(done){
                request(app)
                    .post('/api/v1/comment')
                    .type('form')
                    .expect("Content-type",/json/)
                    .expect(401)
                    .send({
                        text: 'assa',
                        pid: 2
                    })
                    .end((err, res) => {
                        assert.equal(res.body.status, 'fail');
                        assert.equal(res.body.error, 'No token');
                        

                        done(err);
                    });
            });


    });





    describe("Users area", function() {
        var token;
        var token2;
        var token3;

        it('Login ', function(done){
            request(app)
                .post('/api/v1/user/session')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send(user)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');

                    token = res.body.data.token;
                    assert.typeOf(token, 'string');

                    done(err);
                });
        });

        it('Login 2', function(done){
            request(app)
                .post('/api/v1/user/session')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send(secondUser)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');

                    token2 = res.body.data.token;
                    assert.typeOf(token, 'string');

                    done(err);
                });
        });

        it('Login 3', function(done){
            request(app)
                .post('/api/v1/user/session')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send(secondUser)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    token3 = res.body.data.token;
                    assert.typeOf(token, 'string');
                    done(err);
                });
        });

        var parentCommentId;
        it('Post comment', function(done){
            request(app)
                .post('/api/v1/comment')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send({
                    text: 'assa',
                    pid: null,
                    token: token
                })
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');

                    parentCommentId = res.body.data.comment._id;
                    assert.typeOf(parentCommentId, 'string');


                    done(err);
                });
        });

        it('Get comments max-depth after first comment', function(done){
            request(app)
                .get('/api/v1/comment/max-depth')
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data.max_depth, 0);
                    done(err);
                });
        });

        it('Create comment with wrong token', function(done){
            request(app)
                .post('/api/v1/comment')
                .type('form')
                .expect("Content-type",/json/)
                .expect(401)
                .send({
                    text: 'response to you',
                    pid: parentCommentId,
                    token: 'aasassassd22'
                })
                .end((err, res) => {
                    assert.equal(res.body.status, 'fail');
                    done(err);
                });
        });



        var childParentCommentId;
        it('Create child comment', function(done){
            request(app)
                .post('/api/v1/comment')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send({
                    text: 'response to you',
                    pid: parentCommentId,
                    token: token2
                })
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');

                    childParentCommentId = res.body.data.comment._id;

                    assert.typeOf(childParentCommentId, 'string');
                    assert.deepEqual(res.body.data.comment.path,  [parentCommentId]);

                    done(err);
                });
        });


        it('Get comments max-depth after first child comment', function(done){
            request(app)
                .get('/api/v1/comment/max-depth')
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data.max_depth, 1);
                    done(err);
                });
        });

        var childChildCommentId;
        it('Create child of child comment', function(done){
            request(app)
                .post('/api/v1/comment')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send({
                    text: 'response to you',
                    pid: childParentCommentId,
                    token: token
                })
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    
                    childChildCommentId  = res.body.data.comment._id;
                    assert.typeOf(childChildCommentId, 'string');
                    assert.deepEqual(res.body.data.comment.path,  [parentCommentId, childParentCommentId])

                    done(err);
                });
        });

        var newRootCommentId;
        it('Create new root comment', function(done){
            request(app)
                .post('/api/v1/comment')
                .type('form')
                .expect("Content-type",/json/)
                .expect(200)
                .send({
                    text: 'response to you',
                    pid: [],
                    token: token
                })
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    newRootCommentId = res.body.data.comment._id;
                    assert.typeOf(newRootCommentId, 'string');
                    assert.deepEqual(res.body.data.comment.path,  []);
                    done(err);
                });
        });


        it('Get comments', function(done){
            request(app)
                .get('/api/v1/comment')
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data.length, 2);
                  
                    assert.equal(res.body.data[0]['_id'], parentCommentId);
                    assert.equal(res.body.data[0]['childrens'][0
                        ]['_id'], childParentCommentId);
                     assert.equal(res.body.data[0]['childrens'][0
                        ]['childrens'][0
                        ]['_id'], childChildCommentId);
                    assert.equal(res.body.data[1]['_id'], newRootCommentId);
                    done(err);
                });
        });



        it('Get comments max-depth', function(done){
            request(app)
                .get('/api/v1/comment/max-depth')
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data.max_depth, 2);
                    done(err);
                });
        });


        it('Get users', function(done){
            request(app)
                .get('/api/v1/user')
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data.users[0]['username'], user['username']);
                    assert.equal(res.body.data.users[1]['username'], secondUser['username']);
                    assert.equal(res.body.data.users[2]['username'], thirdUser['username']);
                    done(err);
                });
        });



    });

});