var config = require('./config');
var API = require('../');
var muk = require('muk');
var urllib = require('urllib');
var expect = require('expect.js');

describe('api_custom_service', function () {
  var api = new API(config.appid, config.appsecret);

  describe('getRecords', function () {
    describe('getRecords mock', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = {"recordlist": []};
          var res =  {
            headers: {
              'content-type': 'application/json'
            }
          };
          process.nextTick(function () {
            callback(null, data, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('getRecords should ok', function (done) {
        var condition = {
          "starttime" : 123456789,
          "endtime" : 987654321,
          // "openid" : "OPENID",
          "pagesize" : 10,
          "pageindex" : 1,
        };

        api.getRecords(condition, function (err, data, res) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('recordlist');
          done();
        });
      });
    });
  });

  describe('getCustomServiceList', function () {
    it('should unauthorized', function (done) {
      api.getCustomServiceList(function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('kf_list');
        done();
      });
    });
  });

  describe('getOnlineCustomServiceList', function () {
    it('should unauthorized', function (done) {
      api.getOnlineCustomServiceList(function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('kf_online_list');
        done();
      });
    });
  });
});
