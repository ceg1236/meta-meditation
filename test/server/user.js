var expect = require('chai').expect;
var client = require('redis').createClient();
var User = require('../../server/model/user');
var app = require('../../index');
var request = require('supertest');

describe('user', function () {

  var user;

  before(function(){
    user = new User({id:10,name: 'Jose'});
  });

  it('can store user in redis if provided an ID', function(done){
    user.save().then(function(data){
      expect(data.name).to.equal('Jose');

      client.get('user:10', function(err, data){

        expect(JSON.parse(data).name).to.equal('Jose');
        done();
      });
    }).catch(function(err){
      done(err);
    });
  });

  it('should create an ID for new Users', function(done){
    var anon = new User({name:'Carl'});
    anon.save().then(function(data){
      expect(data.id).not.to.be.undefined();
      expect(data.name).to.equal('Carl');

      console.log('saved');
      client.get('user:'+data.id, function(err, data){

        expect(JSON.parse(data).name).to.equal('Carl');
        done();
      });
    }).catch(function(err){
      done(err);
    });
  });

  it('should find user in redis', function (done) {

    client.set('user:1041',JSON.stringify({name:'Fred'}),function (err, reply) {
      User.findById(1041).then(function(data){
        expect(data.name).to.equal('Fred');
        done();
      });

    })
  });

  describe('user integration', function(){

    xit('should provide id on handshake', function(){


    })

  });
});

