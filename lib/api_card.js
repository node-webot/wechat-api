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

/**
 * 创建用于投放的卡卷二维码，支持投放单张卡卷和多张卡卷
 * Examples:
 * ```
 * api.createCardQRCode('info', 'expire_seconds', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode": 0,
 *  "errmsg": "ok",
 *  "ticket":      "gQHB8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0JIV3lhX3psZmlvSDZmWGVMMTZvAAIEsNnKVQMEIAMAAA==",//获取ticket后需调用换取二维码接口获取二维码图片，详情见字段说明。
 *  "expire_seconds": 1800,
 *  "url": "http://weixin.qq.com/q/BHWya_zlfioH6fXeL16o ",
 *  "show_qrcode_url": " https://mp.weixin.qq.com/cgi-bin/showqrcode?  ticket=gQH98DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0czVzRlSWpsamlyM2plWTNKVktvAAIE6SfgVQMEgDPhAQ%3D%3D"
 *  }
 * ```
 *
 * @name createCardQRCode
 * @param {Object} info 卡卷信息，支持单张和多张模式
 * 二维码投放单张卡卷
 * ```
 * {
 *   "expire_seconds": 1800,
 *    "card": {
 *       "card_id": "pAtUNs1c3cBtMs5KeL8FP1f3fOaE"
 *     }
 * }
 * ```
 * ```
 * 二维码投放多张卡卷
 * {
 *   "expire_seconds": 1800,
 *    "multiple_card": {
 *       "card_list": [
 *           {
 *             "card_id": "pAtUNs-HV0evhGTWbU3ohp99tW7k"
 *           },
 *           {
 *             "card_id": "pAtUNs1c3cBtMs5KeL8FP1f3fOaE"
 *           }
 *       ]
 *   }
 * }
 * @param {number} expire_seconds 二维码的有效时间，范围是60 ~ 1800秒。不填默认为永久有效。
 * @param {Function} callback 回调函数
 */
make(exports, 'createCardQRCode', function (info, expire_seconds, callback) {
  if(typeof expire_seconds === 'function') {
    callback = expire_seconds;
    expire_seconds = null;
  }
  var url = 'https://api.weixin.qq.com/card/qrcode/create?access_token=' + this.token.accessToken;
  var data = {
    action_name: 'QR_'+Object.keys(info)[0].toUpperCase(),
    expire_seconds: expire_seconds,
    action_info: info
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

make(exports, 'updateCard', function (cardId, cardType, cardInfo, callback) {
  var url = 'https://api.weixin.qq.com/card/update?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  data[cardType.toLowerCase()] = cardInfo;
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

/**
 * 设置开卡字段接口
 * ```
 * Examples:
 * ```
 * api.activateMembercardUserForm(info, callback);
 *
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
 *
 * @name activateMembercardUserForm
 * @param {Object} info 参数
 * @param {Function} callback 回调函数
 */
make(exports, 'activateMembercardUserForm', function (info, callback) {
  var url = 'https://api.weixin.qq.com/card/membercard/activateuserform/set?access_token=' + this.token.accessToken;
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

/**
 * 导入code接口
 * 接口说明
 * 开发者可调用该接口将自定义code导入微信卡券后台，由微信侧代理存储并下发code，本接口仅用于支持自定义code的卡券参与互通。
 * code:
 * ```
 * [
 *   "11111",
 *   "22222",
 *   "33333"
 * ]
 * ```
 * Examples:
 * ```
 * api.importCustomizedCodes('cardId', code, callback);
 *
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
 *
 * @name importCustomizedCodes
 * @param {String} cardId 卡券ID
 * @param {Array} code 待导入自定义code
 * @param {Function} callback 回调函数
 */
make(exports, 'importCustomizedCodes', function (cardId, code, callback) {
  var url = 'https://api.weixin.qq.com/card/code/deposit?access_token=' + this.token.accessToken;
  var data = {
    "card_id": cardId,
    "code": code
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 核查code接口
 * 接口说明
 * 支持开发者调用该接口查询code导入微信后台的情况。
 * code:
 * ```
 * [
 *   "11111",
 *   "22222",
 *   "33333"
 * ]
 * ```
 * Examples:
 * ```
 * api.checkCustomizedCodes('cardId', code, callback);
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
 *  "exist_code":["11111","22222"],
 *  "not_exist_code":["33333"]
 * }
 * ```
 *
 * @name checkCustomizedCodes
 * @param {String} cardId 卡券ID
 * @param {Array} code 待核查自定义code
 * @param {Function} callback 回调函数
 */
make(exports, 'checkCustomizedCodes', function (cardId, code, callback) {
  var url = 'http://api.weixin.qq.com/card/code/checkcode?access_token=' + this.token.accessToken;
  var data = {
    "card_id": cardId,
    "code": code
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 查询导入code数目接口
 * 接口说明
 * 支持开发者调用该接口查询code导入微信后台成功的数目。
 * Examples:
 * ```
 * api.getDepositCodesCount('cardId', callback);
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
 *  "count":123
 * }
 * ```
 *
 * @name getDepositCodesCount
 * @param {String} cardId 卡券ID
 * @param {Function} callback 回调函数
 */
make(exports, 'getDepositCodesCount', function (cardId, callback) {
  var url = 'http://api.weixin.qq.com/card/code/getdepositcount?access_token=' + this.token.accessToken;
  var data = {
    "card_id": cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 拉取卡券概况数据
 * @param  {String} beginDate             开始时间
 * @param  {String} endDate               结束时间（结束时间不能为当天，不然会报错，可设为昨天）
 * @param  {int} source                卡券来源，0为公众平台创建的卡券数据、1是API创建的卡券数据
 */
make(exports, 'getTotalCardDataInfo', function (beginDate, endDate, source, callback) {
  var url = 'https://api.weixin.qq.com/datacube/getcardbizuininfo?access_token=' + this.token.accessToken;
  var data = {
    "begin_date": beginDate,
    "end_date": endDate,
    "cond_source": source
  };
  this.request(url, postJSON(data), wrapper(callback));
});


/**
 * 获取免费券数据
 * @param  {String} cardId                cardId 卡券ID
 * @param  {String} beginDate             开始时间
 * @param  {String} endDate               结束时间（结束时间不能为当天，不然会报错，可设为昨天）
 * @param  {int} source                卡券来源，0为公众平台创建的卡券数据、1是API创建的卡券数据
 */
make(exports, 'getCardDataInfo', function (cardId, beginDate, endDate, source, callback) {
  var url = 'https://api.weixin.qq.com/datacube/getcardcardinfo?access_token=' + this.token.accessToken;
  var data = {
    "begin_date": beginDate,
    "end_date": endDate,
    "cond_source": source,
    "card_id": cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});


