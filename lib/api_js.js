var urllib = require('urllib');
var util = require('./util');
var crypto = require('crypto');
var wrapper = util.wrapper;

var Ticket = function (ticket, expireTime) {
  if (!(this instanceof Ticket)) {
    return new Ticket(ticket, expireTime);
  }
  this.ticket = ticket;
  this.expireTime = expireTime;
};

Ticket.prototype.isValid = function () {
  return !!this.ticket && (new Date().getTime()) < this.expireTime;
};

/**
 * 多台服务器负载均衡时，ticketToken需要外部存储共享。
 * 需要调用此registerTicketHandle来设置获取和保存的自定义方法。
 *
 * Examples:
 * ```
 * api.registerTicketHandle(getTicketToken, saveTicketToken);
 * // getTicketToken
 * function getTicketToken(callback) {
 *  settingModel.getItem({key: 'weixin_ticketToken'}, function (err, setting) {
 *    if (err) return callback(err);
 *    callback(null, setting.value);
 *  });
 * }
 * // saveTicketToken
 * function saveTicketToken(_ticketToken, callback) {
 *  settingModel.setItem({key:'weixin_ticketToken', value: ticketToken}, function (err) {
 *    if (err) return callback(err);
 *    callback(null);
 *  });
 * }
 * ```
 *
 * @param {Function} getTicketToken 获取外部ticketToken的函数
 * @param {Function} saveTicketToken 存储外部ticketToken的函数
 */
exports.registerTicketHandle = function (getTicketToken, saveTicketToken) {
  this.getTicketToken = getTicketToken || function (callback) {
    callback(null, this.ticketStore);
  };

  this.saveTicketToken = saveTicketToken || function (ticketToken, callback) {
    this.ticketStore = ticketToken;
    if (process.env.NODE_ENV === 'production') {
      console.warn("Dont save ticket in memory, when cluster or multi-computer!");
    }
    callback(null);
  };
};

/**
 * 获取js sdk所需的有效js ticket
 *
 * Callback:
 * - `err`, 异常对象
 * - `result`, 正常获取时的数据
 *
 * Result:
 * - `errcode`, 0为成功
 * - `errmsg`, 成功为'ok'，错误则为详细错误信息
 * - `ticket`, js sdk有效票据，如：bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA
 * - `expires_in`, 有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket
 *
 * @param {Function} callback 回调函数
 */
exports.getTicket = function (callback) {
  this.preRequest(this._getTicket, arguments);
};

exports._getTicket = function (callback) {
  var that = this;
  var url = this.prefix + 'ticket/getticket?access_token=' + this.token.accessToken + '&type=jsapi';
  urllib.request(url, {dataType: 'json'}, wrapper(function(err, data) {
    if (err) {
      return callback(err);
    }
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    var ticket = new Ticket(data.ticket, expireTime);
    that.saveTicketToken(ticket, function (err) {
      if (err) {
        return callback(err);
      }
      callback(err, ticket);
    });
  }));
};

/*!
 * 生成随机字符串
 */
var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

/*!
 * 生成时间戳
 */
var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

/*!
 * 排序查询字符串
 */
var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  return string.substr(1);
};

/*!
 * 签名算法
 *
 * @param {String} nonceStr 生成签名的随机串
 * @param {String} jsapi_ticket 用于签名的jsapi_ticket
 * @param {String} timestamp 时间戳
 * @param {String} url 用于签名的url，注意必须与调用JSAPI时的页面URL完全一致
 */
var sign = function (nonceStr, jsapi_ticket, timestamp, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: nonceStr,
    timestamp: timestamp,
    url: url
  };
  var string = raw(ret);
  var shasum = crypto.createHash('sha1');
  shasum.update(string);
  return shasum.digest('hex');
};

/**
 * 获取微信JS SDK Config的所需参数
 *
 * Examples:
 * ```
 * var param = {
 *  debug:false,
 *  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
 *  url: 'http://www.xxx.com'
 * };
 * api.getJsConfig(, callback);
 * ```
 *
 * Callback:
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的js sdk config所需参数
 *
 * @param {Object} param 参数
 * @param {Function} callback 回调函数
 */
exports.getJsConfig = function (param, callback) {
  var that = this;
  this.getTicket(function (err, ticket) {
    if (err) {
      return callback(err);
    }
    var nonceStr = createNonceStr();
    var jsAPITicket = ticket.ticket;
    var timestamp = createTimestamp();
    var signature = sign(nonceStr, jsAPITicket, timestamp, param.url);
    var result = {
      debug: param.debug,
      appId: that.appid,
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: param.jsApiList
    };
    callback(null, result);
  });
};
