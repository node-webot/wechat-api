'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 用于清零调用频次限制
 * @name clearQuota
 * @param {String} appid 应用id
 * @param {Function} callback 回调函数
 */
make(exports, 'clearQuota', function (appid, callback) {
  var data = {
    appid: appid
  };
  // https://api.weixin.qq.com/cgi-bin/clear_quota?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/clear_quota?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});
