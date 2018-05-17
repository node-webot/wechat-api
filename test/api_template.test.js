'use strict';

var config = require('./config');
var API = require('../');
var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

describe('api_template', function () {
  var api = new API(config.appid, config.appsecret);
  var mockError = function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = {'errcode':1, 'errmsg':'mock error'};
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
  };

  describe('sendTemplate', function () {
    it('sendTemplate should ok', function (done) {
      var templateId = '模板id';
      // 跳转目的地置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
      var dest = {
        url: 'http://weixin.qq.com/download',
        miniprogram:{
          appid: 'xiaochengxuappid12345',
          pagepath: 'index?foo=bar'
        }
      };
      var data = {
        user: {
          'value':'黄先生',
          'color':'#173177'
        }
      };
      api.sendTemplate(puling, templateId, dest, data, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err.message).to.contain('invalid template_id');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        var templateId = '模板id';
        // 跳转目的地置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
        var dest = {
          url: 'http://weixin.qq.com/download',
          miniprogram:{
            appid: 'xiaochengxuappid12345',
            pagepath: 'index?foo=bar'
          }
        };
        var data = {
          user: {
            'value':'黄先生',
            'color':'#173177'
          }
        };
        api.sendTemplate(puling, templateId, dest, data, function (err, data, res) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });

  describe('getIndustry', function () {
    it('getIndustry should ok', function (done) {
      api.getIndustry(function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('primary_industry');
          expect(data).to.have.property('secondary_industry');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
        }
        done();
      });
    });
  });

  describe('getAllPrivateTemplate', function () {
    it('getAllPrivateTemplate should ok', function (done) {
      api.getAllPrivateTemplate(function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('template_list');
          expect(data.template_list).to.be.an('array');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
        }
        done();
      });
    });
  });

  describe('delPrivateTemplate', function () {
    it('delPrivateTemplate should ok', function (done) {
      var templateId = '模板id';
      api.delPrivateTemplate(templateId, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err.message).to.contain('invalid template_id');
        }
        done();
      });
    });
  });
});
