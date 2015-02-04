var expect = require('chai').expect;
var client = require('redis').createClient();
var User = require('../../server/model/user');
var app = require('../../index');
var request = require('supertest');
var io = require('socket.io-client');
var config = require('../../server/config');

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

    describe('POST /api/handshake', function(){

      it('should have the route', function(done){
        request(app)
          .post('/api/handshake')
          .expect(200,done)
      });

      // This is the first thing the phone does when connecting to the backend.
      it('should return new user object if no id is provided', function(done){
        request(app)
          .post('/api/handshake')
          .send({name: "Jeff"})
          .expect(200)
          .end(function(err,resp){
            var data = resp.body;
            expect(data.id).not.to.be.undefined();
            expect(data.name).to.equal("Jeff");
            done(err);
          });
      });


      // This is the first thing the phone does, after he already figured out his id.
      it('should return existing user object if id is provided', function(done){
        request(app)
          .post('/api/handshake')
          .send({id: user.id}) // Phone should send just the ID
          .expect(200)
          .end(function(err,resp){
            var data = resp.body;
            expect(data.id).not.to.be.undefined();
            expect(data.name).to.equal("Jose");// This is the user we created at the star
            done(err);
          });
      });


    });

    xdescribe('POST /api/sessions', function(){

      xit('should set session to true', function(done){
        request(app)
          .post('/api/sessions/')
          .send({id: user.id})
          .expect(200)
          .end(function(err, data){
            if(err){ done(err); return;}
            // Should be stored in sessions:userid
            client.get('sessions:'+user.id,function(err, data){
              if(err){ done(err); return;}
              expect(data).not.to.be.null();
              done();
            });
          });
      });

      xit('should not work if id is not a user', function(done){
        request(app)
          .post('/api/sessions/')
          .send({id: 9000})
          .expect(400,done);
      });

    });

    xdescribe('Socket events', function(){
      var client1;
      var client2;
      var options ={
        'force new connection': true
      };
      beforeEach(function(done){
        client1 = io.connect('http://localhost:'+config.port, options);
        client1.on('connect',function(){
          client2 = io.connect('http://localhost:'+config.port, options);
          client2.on('connect',function(){
            done();
          });
        });
      });

      it('when emitting session-start without an id, should not notify the rest', function(done){
        client2.on('session-start',function(){
          done("should not broadcast if id was not on the emit");
        });
        client1.emit('session-start',{name:'Jose'});
      });


    });



  });
});

