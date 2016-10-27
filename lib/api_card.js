'use strict';

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
  var url = this.endpoint + '/card/location/batchadd?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getLocations', function (offset, count, callback) {
  var data = {
    offset: offset,
    count: count
  };
  var url = this.endpoint + '/card/location/batchget?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getColors', function (callback) {
  var url = this.endpoint + '/card/getcolors?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

make(exports, 'createCard', function (card, callback) {
  var url = this.endpoint + '/card/create?access_token=' + this.token.accessToken;
  var data = {card: card};
  this.request(url, postJSON(data), wrapper(callback));
});

exports.getRedirectUrl = function (url, encryptCode, cardId) {
  // TODO
};

make(exports, 'createQRCode', function (card, callback) {
  var url = this.endpoint + '/card/qrcode/create?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/qrcode/create?access_token=' + this.token.accessToken;
  var data = {
    action_name: 'QR_'+Object.keys(info)[0].toUpperCase(),
    expire_seconds: expire_seconds,
    action_info: info
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'consumeCode', function (code, cardId, callback) {
  var url = this.endpoint + '/card/code/consume?access_token=' + this.token.accessToken;
  var data = {
    code: code,
    card_id: cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'decryptCode', function (encryptCode, callback) {
  var url = this.endpoint + '/card/code/decrypt?access_token=' + this.token.accessToken;
  var data = {
    encrypt_code: encryptCode
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'deleteCard', function (cardId, callback) {
  var url = this.endpoint + '/card/delete?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getCode', function (code, cardId, callback) {
  var url = this.endpoint + '/card/code/get?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/batchget?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/get?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateCode', function (code, cardId, newcode, callback) {
  var url = this.endpoint + '/card/code/update?access_token=' + this.token.accessToken;
  var data = {
    code: code,
    card_id: cardId,
    newcode: newcode
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'unavailableCode', function (code, cardId, callback) {
  var url = this.endpoint + '/card/code/unavailable?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/update?access_token=' + this.token.accessToken;
  var data = {
    card_id: cardId
  };
  data[cardType.toLowerCase()] = cardInfo;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateCardStock', function (cardId, num, callback) {
  var url = this.endpoint + '/card/modifystock?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/membercard/activate?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/membercard/activateuserform/set?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'getMembercard', function (info, callback) {
  var url = this.endpoint + '/card/membercard/userinfo/get?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'updateMembercard', function (info, callback) {
  var url = this.endpoint + '/card/membercard/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'updateMovieTicket', function (info, callback) {
  var url = this.endpoint + '/card/movieticket/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'checkInBoardingPass', function (info, callback) {
  var url = this.endpoint + '/card/boardingpass/checkin?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'updateLuckyMonkeyBalance', function (code, cardId, balance, callback) {
  var url = this.endpoint + '/card/luckymonkey/updateuserbalance?access_token=' + this.token.accessToken;
  var data = {
    'code': code,
    'card_id': cardId,
    'balance': balance
  };
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateMeetingTicket', function (info, callback) {
  var url = this.endpoint + '/card/meetingticket/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(info), wrapper(callback));
});

make(exports, 'setTestWhitelist', function (info, callback) {
  var url = this.endpoint + '/card/testwhitelist/set?access_token=' + this.token.accessToken;
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
  var url = this.endpoint + '/card/code/deposit?access_token=' + this.token.accessToken;
  var data = {
    'card_id': cardId,
    'code': code
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
  var url = this.endpoint + '/card/code/checkcode?access_token=' + this.token.accessToken;
  var data = {
    'card_id': cardId,
    'code': code
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
  var url = this.endpoint + '/card/code/getdepositcount?access_token=' + this.token.accessToken;
  var data = {
    'card_id': cardId
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
  var url = this.endpoint + '/datacube/getcardbizuininfo?access_token=' + this.token.accessToken;
  var data = {
    'begin_date': beginDate,
    'end_date': endDate,
    'cond_source': source
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
  var url = this.endpoint + '/datacube/getcardcardinfo?access_token=' + this.token.accessToken;
  var data = {
    'begin_date': beginDate,
    'end_date': endDate,
    'cond_source': source,
    'card_id': cardId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 设置商户的核销员
 * 接口说明
 * 开发者需调用该接口设置商户的核销员,并指定核销员的门店。
 * Examples:
 * ```
 * api.addConsumer('username', 'locationId', callback);
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
 * @name addConsumer
 * @param {String} username 店员的微信号,开发者须确认该微信号在设置之前已 经关注”卡券商户助手公众号“
 * @param {String} locationId 当前核销员关联的门店值
 * @param {Function} callback 回调函数
 */
make(exports, 'addConsumer', function (username, locationId, callback) {
  var url = this.endpoint + '/card/consumer/add?access_token=' + this.token.accessToken;
  var data = {
    'username': username,
    'is_super_consumer': true
  };
  if (locationId) {
    data.location_id = locationId;
    data.is_super_consumer = false;
  }
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 卡券开放类目查询接口
 * 接口说明
 * 通过调用该接口查询卡券开放的类目ID，类目会随业务发展变更，请每次用接口去查询获取实时卡券类目。
 * 注意：
 * 1. 本接口查询的返回值还有卡券资质ID,此处的卡券资质为：已微信认证的公众号通过微信公众平台申请卡券功能时，所需的资质。
 * 2.对于第三方开发者代制（无公众号）模式，子商户无论选择什么类目，均暂不需按照此返回提供资质，返回值仅参考类目ID 即可。
 * Examples:
 * ```
 * api.getApplyProtocol(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "category": [
 *        {
 *            "primary_category_id": 1,
 *            "category_name": "美食",
 *            "secondary_category": [
 *                {
 *                    "secondary_category_id": 101,
 *                    "category_name": "粤菜",
 *                    "need_qualification_stuffs": [
 *                        "food_service_license_id",
 *                        "food_service_license_bizmedia_id"
 *                    ],
 *                    "can_choose_prepaid_card": 1,
 *                    "can_choose_payment_card": 1
 *                },
 *        }
 *    ],
 *  "errcode":0,
 *  "errmsg":"ok"
 * }
 * ```
 *
 * @name getApplyProtocol
 * @param {Object} options 子商户相关资料
 * @param {Function} callback 回调函数
 */
make(exports, 'getApplyProtocol', function (callback) {
  var url = this.endpoint + '/card/getapplyprotocol?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 创建子商户接口
 * 接口说明
 * 支持母商户调用该接口传入子商户的相关资料，并获取子商户ID，用于子商户的卡券功能管理。
 * 子商户的资质包括：商户名称、商户logo（图片）、卡券类目、授权函（扫描件或彩照）、授权函有效期截止时间。
 * Examples:
 * ```
 * api.submitSubmerchant(options, callback);
 * ```
 * options:
 * {
 *  "brand_name": "aaaaaa",
 *  "app_id"："xxxxxxxxxxx",
 *  "logo_url": "http://mmbiz.xxxx",
 *  "protocol": "xxxxxxxxxx",
 *  "agreement_media_id":"xxxxxxxxxx",
 *  "operator_media_id":"xxxxxxxx",
 *  "end_time": 1438990559,
 *  "primary_category_id": 1,
 *  "secondary_category_id": 101
 * }
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name submitSubmerchant
 * @param {Object} options 子商户相关资料
 * @param {Function} callback 回调函数
 */
make(exports, 'submitSubmerchant', function (options, callback) {
  var url = this.endpoint + '/card/submerchant/submit?access_token=' + this.token.accessToken;
  var data = {
    'info': options
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 更新子商户接口
 * 接口说明
 * 支持调用该接口更新子商户信息。
 * Examples:
 * ```
 * api.updateSubmerchant(options, callback);
 * ```
 * options:
 * {
 *  "merchant_id": 12,
 *  "brand_name": "aaaaaa",
 *  "app_id"："xxxxxxxxxxx",
 *  "logo_url": "http://mmbiz.xxxx",
 *  "protocol": "xxxxxxxxxx",
 *  "agreement_media_id":"xxxxxxxxxx",
 *  "operator_media_id":"xxxxxxxx",
 *  "end_time": 1438990559,
 *  "primary_category_id": 1,
 *  "secondary_category_id": 101
 * }
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name updateSubmerchant
 * @param {Object} options 子商户相关资料
 * @param {Function} callback 回调函数
 */
make(exports, 'updateSubmerchant', function (options, callback) {
  var url = this.endpoint + '/card/submerchant/update?access_token=' + this.token.accessToken;
  var data = {
    'info': options
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 拉取单个子商户信息接口
 * 接口说明
 * 通过指定的子商户merchant_id，拉取该子商户的基础信息。
 * 注意，用母商户去调用接口，但接口内传入的是子商户的merchant_id。
 * Examples:
 * ```
 * api.getSubmerchant('merchantId', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name getSubmerchant
 * @param {String} merchantId 子商户相关资料
 * @param {Function} callback 回调函数
 */
make(exports, 'getSubmerchant', function (merchantId, callback) {
  var url = this.endpoint + '/card/submerchant/get?access_token=' + this.token.accessToken;
  var data = {
    'merchant_id': merchantId
  };
  this.request(url, postJSON(data), wrapper(callback));
});


/**
 * 批量拉取子商户信息接口
 * 接口说明
 * 母商户可以通过该接口批量拉取子商户的相关信息，一次调用最多拉取100个子商户的信息，可以通过多次拉去满足不同的查询需求
 * Examples:
 * ```
 * api.batchgetSubmerchant(data, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name batchgetSubmerchant
 * @param {Object} data 查询条件 {"begin_id": 0,"limit": 50,"status": "CHECKING"}
 * @param {Function} callback 回调函数
 */
make(exports, 'batchgetSubmerchant', function (data, callback) {
  var url = this.endpoint + '/card/submerchant/batchget?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});


/**
 * 拉取拉取会员信息接口
 * 接口说明
 * 支持开发者根据CardID和Code查询会员信息。
 * Examples:
 * ```
 * api.getMemberCardUserInfo({"card_id": abd5e78412e5d12ff,"code": 5566778811002233}, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name getMemberCardUserInfo
 * @param {Object} info 查询条件 {"card_id": abd5e78412e5d12ff,"code": 5566778811002233}
 * @param {Function} callback 回调函数
 */
make(exports, 'getMemberCardUserInfo', function (info, callback) {
  var url = this.endpoint + '/card/membercard/userinfo/get?access_token=' + this.token.accessToken;
  var data = info;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 更新会员信息
 * 接口说明
 * 当会员持卡消费后，支持开发者调用该接口更新会员信息。会员卡交易后的每次信息变更需通过该接口通知微信，便于后续消息通知及其他扩展功能。
 * Examples:
 * ```
 * api.updateMemberCardUserInfo(data, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name getMemberCardUserInfo
 * @param {Object} data 查询条件 {"card_id": abd5e78412e5d12ff,"code": 5566778811002233, "record_bonus" : 3000}
 * @param {Function} callback 回调函数
 */
make(exports, 'updateMemberCardUserInfo', function (data, callback) {
  var url = this.endpoint + '/card/membercard/updateuser?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});
