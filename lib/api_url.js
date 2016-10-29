'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 短网址服务
 * 详细细节 http://mp.weixin.qq.com/wiki/10/165c9b15eddcfbd8699ac12b0bd89ae6.html
 * Examples:
 * ```
 * api.shorturl('http://mp.weixin.com', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} longUrl 需要转换的长链接，支持http://、https://、weixin://wxpay格式的url
 * @param {Function} callback 回调函数
 */
exports.shorturl = function (longUrl, callback) {
  this.preRequest(this._shorturl, arguments);
};

/*!
 * 短网址服务
 */
exports._shorturl = function (longUrl, callback) {
  // https://api.weixin.qq.com/cgi-bin/shorturl?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/shorturl?access_token=' + this.token.accessToken;
  var data = {
    'action': 'long2short',
    'long_url': longUrl
  };
  this.request(url, postJSON(data), wrapper(callback));
};
