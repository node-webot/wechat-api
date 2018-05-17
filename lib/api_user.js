'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 获取用户基本信息。可以设置lang，其中zh_CN 简体，zh_TW 繁体，en 英语。默认为en
 * 详情请见：<http://mp.weixin.qq.com/wiki/14/bb5031008f1494a59c6f71fa0f319c66.html>
 * Examples:
 * ```
 * api.getUser(openid, callback);
 * api.getUser({openid: 'openid', lang: 'en'}, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "subscribe": 1,
 *  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
 *  "nickname": "Band",
 *  "sex": 1,
 *  "language": "zh_CN",
 *  "city": "广州",
 *  "province": "广东",
 *  "country": "中国",
 *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
 *  "subscribe_time": 1382694957
 * }
 * ```
 * @param {String|Object} options 用户的openid。或者配置选项，包含openid和lang两个属性。
 * @param {Function} callback 回调函数
 */
exports.getUser = function (options, callback) {
  this.preRequest(this._getUser, arguments);
};

/*!
 * 获取用户基本信息的未封装版本
 */
exports._getUser = function (options, callback) {
  if (typeof options !== 'object') {
    options = {
      openid: options,
      lang: 'en'
    };
  }
  // https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID
  var url = this.endpoint + '/cgi-bin/user/info?openid=' + options.openid + '&lang=' + options.lang + '&access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 *  批量获取用户基本信息
 * Example:
 * ```
 * api.batchGetUsers(['openid1', 'openid2'], callback)
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "user_info_list": [{
 *     "subscribe": 1,
 *     "openid": "otvxTs4dckWG7imySrJd6jSi0CWE",
 *     "nickname": "iWithery",
 *     "sex": 1,
 *     "language": "zh_CN",
 *     "city": "Jieyang",
 *     "province": "Guangdong",
 *     "country": "China",
 *     "headimgurl": "http://wx.qlogo.cn/mmopen/xbIQx1GRqdvyqkMMhEaGOX802l1CyqMJNgUzKP8MeAeHFicRDSnZH7FY4XB7p8XHXIf6uJA2SCunTPicGKezDC4saKISzRj3nz/0",
 *     "subscribe_time": 1434093047,
 *     "unionid": "oR5GjjgEhCMJFyzaVZdrxZ2zRRF4",
 *     "remark": "",
 *     "groupid": 0
 *   }, {
 *     "subscribe": 0,
 *     "openid": "otvxTs_JZ6SEiP0imdhpi50fuSZg",
 *     "unionid": "oR5GjjjrbqBZbrnPwwmSxFukE41U",
 *   }]
 * }
 * ```
 * @param {Array} openids 用户的openid数组。
 * @param {Function} callback 回调函数
 */
exports.batchGetUsers = function (openids, callback) {
  this.preRequest(this._batchGetUsers, arguments);
};

/*!
 * 批量获取用户基本信息的未封装版本
 */
exports._batchGetUsers = function (openids, callback) {
  var url = this.endpoint + '/cgi-bin/user/info/batchget?access_token=' + this.token.accessToken;
  var data = {};
  data.user_list = openids.map(function (openid) {
    return {openid: openid, language: 'zh-CN'};
  });
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 获取关注者列表
 * 详细细节 http://mp.weixin.qq.com/wiki/0/d0e07720fc711c02a3eab6ec33054804.html
 * Examples:
 * ```
 * api.getFollowers(callback);
 * // or
 * api.getFollowers(nextOpenid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "total":2,
 *  "count":2,
 *  "data":{
 *    "openid":["","OPENID1","OPENID2"]
 *  },
 *  "next_openid":"NEXT_OPENID"
 * }
 * ```
 * @param {String} nextOpenid 调用一次之后，传递回来的nextOpenid。第一次获取时可不填
 * @param {Function} callback 回调函数
 */
exports.getFollowers = function (nextOpenid, callback) {
  this.preRequest(this._getFollowers, arguments);
};

/*!
 * 获取关注者列表的未封装版本
 */
exports._getFollowers = function (nextOpenid, callback) {
  // https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID
  if (typeof nextOpenid === 'function') {
    callback = nextOpenid;
    nextOpenid = '';
  }
  var url = this.endpoint + '/cgi-bin/user/get?next_openid=' + nextOpenid + '&access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 设置用户备注名
 * 详细细节 http://mp.weixin.qq.com/wiki/1/4a566d20d67def0b3c1afc55121d2419.html
 * Examples:
 * ```
 * api.updateRemark(openid, remark, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"ok"
 * }
 * ```
 * @param {String} openid 用户的openid
 * @param {String} remark 新的备注名，长度必须小于30字符
 * @param {Function} callback 回调函数
 */
exports.updateRemark = function (openid, remark, callback) {
  this.preRequest(this._updateRemark, arguments);
};

/*!
 * 设置用户备注名的未封装版本
 */
exports._updateRemark = function (openid, remark, callback) {
  // https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/user/info/updateremark?access_token=' + this.token.accessToken;
  var data = {
    openid: openid,
    remark: remark
  };
  this.request(url, postJSON(data), wrapper(callback));
};
