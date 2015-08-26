var path = require('path');
var fs = require('fs');

var formstream = require('formstream');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 上传Logo
 * Examples:
 * ```
 * api.uploadLogo('filepath', callback);
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
 *  "errmsg":"ok",
 *  "url":"http://mmbiz.qpic.cn/mmbiz/iaL1LJM1mF9aRKPZJkmG8xXhiaHqkKSVMMWeN3hLut7X7hicFNjakmxibMLGWpXrEXB33367o7zHN0CwngnQY7zb7g/0"
 * }
 * ```
 *
 * @name uploadLogo
 * @param {String} filepath 文件路径
 * @param {Function} callback 回调函数
 */
make(exports, 'uploadLogo', function (filepath, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('buffer', filepath, path.basename(filepath), stat.size);
    var url = that.fileServerPrefix + 'media/uploadimg?access_token=' + that.token.accessToken;
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    that.request(url, opts, wrapper(callback));
  });
});

/**
 * @name addLocations
 * @param {Array} locations 位置
 * @param {Function} callback 回调函数
 */
make(exports, 'addLocations', function (locations, callback) {
  var data = {
    location_list: locations
  };
  var url = 'https://api.weixin.qq.com/card/location/batchadd?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getLocations', function (offset, count, callback) {
  var data = {
    offset: offset,
    count: count
  };
  var url = 'https://api.weixin.qq.com/card/location/batchget?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getColors', function (callback) {
  var url = 'https://api.weixin.qq.com/card/getcolors?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

make(exports, 'createCard', function (card, callback) {
  var url = 'https://api.weixin.qq.com/card/create?access_token=' + this.token.accessToken;
  var data = {card: card};
  this.request(url, postJSON(data), wrapper(callback));
});

exports.getRedirectUrl = function (url, encryptCode, cardId) {
  // TODO
};

make(exports, 'createQRCode', function (card, callback) {
  var url = 'https://api.weixin.qq.com/card/qrcode/create?access_token=' + this.token.accessToken;
  var data = {
    action_name: 'QR_CARD',
    action_info: {
      card: card
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'consumeCode', function (code, cardId, callback) {
  var url = 'https://api.weixin.qq.com/card/code/consume?access_token=' + this.token.accessToken;
  var data = {
    code: code,
    card_id: cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'decryptCode', function (encryptCode, callback) {
  var url = 'https://api.weixin.qq.com/card/code/decrypt?access_token=' + this.token.accessToken;
  var data = {
    encrypt_code: encryptCode
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'deleteCard', function (cardId, callback) {
  var url = 'https://api.weixin.qq.com/card/delete?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getCode', function (code, cardId, callback) {
  var url = 'https://api.weixin.qq.com/card/code/get?access_token=' + this.token.accessToken;
  var data = {
    code: code
  };
  if (typeof cardId !== 'function') {
    data.card_id = cardId;
  } else {
    callback = cardId;
  }
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getCards', function (offset, count, status_list, callback) {
  var url = 'https://api.weixin.qq.com/card/batchget?access_token=' + this.token.accessToken;
  var data = {
    offset: offset,
    count: count
  };
  if (typeof status_list !== 'function') {
    data.status_list = status_list;
  } else {
    callback = status_list;
  }  
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getCard', function (cardId, callback) {
  var url = 'https://api.weixin.qq.com/card/get?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateCode', function (code, cardId, newcode, callback) {
  var url = 'https://api.weixin.qq.com/card/code/update?access_token=' + this.token.accessToken;
  var data = {
    code: code,
    card_id: cardId,
    newcode: newcode
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'unavailableCode', function (code, cardId, callback) {
  var url = 'https://api.weixin.qq.com/card/code/unavailable?access_token=' + this.token.accessToken;
  var data = {
    code: code
  };
  if (typeof cardId !== 'function') {
    data.card_id = cardId;
  } else {
    callback = cardId;
  }
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateCard', function (cardId, cardInfo, callback) {
  var url = 'https://api.weixin.qq.com/card/update?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId,
    member_card: cardInfo
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateCardStock', function (cardId, num, callback) {
  var url = 'https://api.weixin.qq.com/card/modifystock?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  if (num > 0) {
    data.increase_stock_value = Math.abs(num);
  } else {
    data.reduce_stock_value = Math.abs(num);
  }
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'activateMembercard', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/membercard/activate?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'updateMembercard', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/membercard/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'updateMovieTicket', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/movieticket/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'checkInBoardingPass', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/boardingpass/checkin?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'updateLuckyMonkeyBalance', function (code, cardId, balance, callback) {
  var url = 'https://api.weixin.qq.com/card/luckymonkey/updateuserbalance?access_token=' + this.token.accessToken;
  var data = {
    "code": code,
    "card_id": cardId,
    "balance": balance
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateMeetingTicket', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/meetingticket/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'setTestWhitelist', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/testwhitelist/set?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});
