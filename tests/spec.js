var request = require('supertest');
var assert = require('chai').assert;
var chai = require("chai");
chai.should();
chai.use(require('chai-things'));

var app = require('../app');
var mongoose = require('mongoose');





var id = 0;

var user = {
    username: 'test',
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
            mongoose.connect('mongodb://localhost:27017/comments', function (err) {
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
                assert.typeOf(res.body.data._id, 'string');
                done(err);
            });
    });


    it('Create user again', function (done) {
        request(app)
            .post('/api/v1/user')
            .type('form')
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .send(user)
            .end((err, res) => {
                assert.equal(res.body.status, 'fail');
                assert.equal(res.body.error, 'Registration error');
                done(err);
            });
    });

  // it('GET /api/v1/user ', function (done) {
  //   request(app)
  //     .get('/api/v1/user')
  //     .set('Accept','application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .end(function (err, res) {
      
  //       done();
  //     });
  // });
  // 
  // 

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
                    token: token
                })
                .end((err, res) => {
                    assert.equal(res.body.status, 'success');

                    childParentCommentId = res.body.data.comment._id;

                    assert.typeOf(childParentCommentId, 'string');
                    assert.deepEqual(res.body.data.comment.path,  [parentCommentId])

                    done(err);
                });
        });

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
                    
                    assert.typeOf(res.body.data.comment._id, 'string');
                    assert.deepEqual(res.body.data.comment.path,  [parentCommentId, childParentCommentId])

                    done(err);
                });
        });

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
                    assert.typeOf(res.body.data.comment._id, 'string');
                    assert.deepEqual(res.body.data.comment.path,  [])

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
                    assert.equal(res.body.data.length, 4);
                    res.body.data.should.contain.a.thing.with.property('_id', parentCommentId);
                    res.body.data.should.contain.a.thing.with.property('_id', childParentCommentId);
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



    });

});