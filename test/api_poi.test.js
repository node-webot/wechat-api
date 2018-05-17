'use strict';

var config = require('./config');
var API = require('../');
var expect = require('expect.js');

describe('api_poi', function(){

  var api = new API(config.appid, config.appsecret);

  describe('get category', function(){
    it('should ok', function(done){
      api.getWXCategory(function (err, data, res) {
        expect(err).to.not.be.ok();
        expect(data).to.have.property('category_list');
        expect(data.category_list.length).to.have.above(0);
        done();
      });
    });
  });
});
