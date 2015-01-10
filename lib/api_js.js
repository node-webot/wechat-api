var urllib = require('urllib');
var util = require('./util');
var crypto = require('crypto');
var wrapper = util.wrapper;


var Ticket = function (ticket, expireTime) {
  if (!(this instanceof Ticket)) return new Ticket(ticket, expireTime);
  this.ticket = ticket;
  this.expireTime = expireTime;
};

Ticket.prototype.isValid = function () {
  return !!this.ticket && (new Date().getTime()) < this.expireTime;
};


exports.regTicket = function (getTicketToken, saveTicketToken) {
  this.getTicketToken = getTicketToken || function (callback) {
    callback(null, this.store);
  };
  this.saveTicketToken = saveTicketToken || function (ticketToken, callback) {
    this.store = ticketToken;
    if (process.env.NODE_ENV === 'production') {
      console.warn('Don\'t save ticket in memory, when cluster or multi-computer!');
    }
    callback(null);
  };
};

exports.getTicket = function (callback) {
  this.preRequest(this._getTicket, arguments);
};

exports._getTicket = function (callback) {
  var that = this;
  var url = this.prefix + 'ticket/getticket?access_token=' + this.token.accessToken+'&type=jsapi';
  urllib.request(url, {dataType: 'json'}, wrapper(function(err, data) {
    if (err) return callback(err);
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    var ticket = Ticket(data.ticket, expireTime);
    that.saveTicketToken(ticket, function (err) {
      if (err) return callback(err);
      callback(err, ticket);
    });
  }));
};


//param:{debug, jsApiList, url}
exports.getJsConfig = function(param, callback) {
  var that=this;
  this.getTicket(function(err, ticket) {
    if (err) return callback(err);
    var nonceStr=createNonceStr();
    var jsapi_ticket=ticket.ticket;
    var timestamp=createTimestamp();
    var signature=sign(nonceStr, jsapi_ticket, timestamp, param.url);
    var result={
      debug:param.debug,
      appId:that.appid,
      timestamp:timestamp,
      nonceStr:nonceStr,
      signature:signature,
      jsApiList:param.jsApiList
    };
    callback(null, result);
  });
};


//===================================================
var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须与调用 JSAPI 时的页面 URL 完全一致
 *
 * @returns
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
  var signature=shasum.digest('hex');

  return signature;
};
