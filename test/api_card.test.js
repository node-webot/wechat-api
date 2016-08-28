var config = require('./config');
var API = require('../');
var expect = require('expect.js');

describe('api_card', function () {
  var api = new API(config.appid, config.appsecret);

  describe('getApplyProtocol', function () {
    it('should ok', function (done) {
      api.getApplyProtocol(function (err, data, res) {
        expect(err).to.not.be.ok();
        expect(data).to.have.property('category');
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });
  });
  
  describe.skip('submitSubmerchant', function(){
    var options = {
     "brand_name": "aaaaaa",
      // "app_id":"xxxxxxxxxxx",
      "logo_url": "http://mmbiz.qpic.cn/mmbiz/O1DymY4NpO88CjYk0XWw9VAW99RMibqchv2OVDOibPpmMu65H47usx4fjyRwvRaZwCccibCiccMgwPk9unibewSQfjw/0?wx_fmt=jpeg",
      "protocol": "xxxxxxxxxx",
      "end_time": Math.round(Date.now()/1000),
      "primary_category_id": 1,
      "secondary_category_id": 101
    };
    
    before(function(done){
      api.uploadMedia('./test/fixture/image.jpg', 'image', function (err, data, res) {
        options.protocol = data.media_id;
        done(err)
      });
    });
    
    it('should ok', function(done){
      api.submitSubmerchant(options, function (err, data, res) {
        expect(err).to.not.be.ok();
        expect(data).to.have.property('info');
        expect(data.info).to.have.property('merchant_id');
        done();
      })
    })
  })
});
