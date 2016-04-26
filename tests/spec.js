var request = require('supertest');
var assert = require('chai').assert;
var should = require('should');
var app = require('../app');

var id = 0;

var user = {
    username: 'test',
    password: 'test'
}

describe('Testing REST API', function () {

  it('POST /api/v1/user ', function (done) {
    request(app)
      .post('/api/v1/user')
            .send(user)
            .end((err, res) => {
              console.log(res.body);
                //res.body.err.should.eql(0);
                //assert.equale()
                done()
            })
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

  it('GET / ', function (done) {
    request(app)
      .get('/')
      .set('Accept','application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.status, true);
        done();
      });
  });
});