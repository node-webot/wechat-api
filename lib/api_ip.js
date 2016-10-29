'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var make = util.make;

/**
 * 获取微信服务器IP地址
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/2ad4b6bfd29f30f71d39616c2a0fcedc.html>
 * Examples:
 * ```
 * api.getIp(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "ip_list":["127.0.0.1","127.0.0.1"]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
make(exports, 'getIp', function (callback) {
  // https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/getcallbackip?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});
