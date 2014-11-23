var config = require('./config');
var API = require('../');
var expect = require('expect.js');

describe('api_get_ip', function () {
  var api = new API(config.appid, config.appsecret);

  before(function (done) {
    api.getAccessToken(done);
  });

  describe('getIpList', function () {
    it('should ok', function (done) {
      api.getIp(function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.only.have.keys('ip_list');
        done();
      });
    });
  });
});
