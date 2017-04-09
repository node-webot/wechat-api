'use strict';

var path = require('path');
var fs = require('fs');
var formstream = require('formstream');

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 获取客服聊天记录
 * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1464937269_mUtmK&token=&lang=zh_CN
 *
 * Opts:
 * ```
 * {
 *  "starttime" : 123456789, 起始时间，unix时间戳
 *  "endtime" : 987654321,   结束时间，unix时间戳，每次查询时段不能超过24小时
 *  "msgid" : 1,             消息id顺序从小到大，从1开始
 *  "number" : 10000         每次获取条数，最多10000条
 * }
 * ```
 * Examples:
 * ```
 * api.getRecords(opts, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "recordlist": [
 *    {
 *      "worker": " test1",
 *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
 *      "opercode": 2002,
 *      "time": 1400563710,
 *      "text": " 您好，客服test1为您服务。"
 *    },
 *    {
 *      "worker": " test1",
 *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
 *      "opercode": 2003,
 *      "time": 1400563731,
 *      "text": " 你好，有什么事情？ "
 *    },
 *  ]
 * }
 * ```
 * @param {Object} opts 查询条件
 * @param {Function} callback 回调函数
 */
make(exports, 'getRecords', function (opts, callback) {
  // https://api.weixin.qq.com/customservice/msgrecord/getmsglist?access_token=ACCESS_TOKEN
  opts.msgid = opts.msgid || 1;
  var url = this.endpoint + '/customservice/msgrecord/getmsglist?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
});

/**
 * 获取客服基本信息
 * 详细请看：http://dkf.qq.com/document-3_1.html
 *
 * Examples:
 * ```
 * api.getCustomServiceList(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "kf_list": [
 *     {
 *       "kf_account": "test1@test",
 *       "kf_nick": "ntest1",
 *       "kf_id": "1001"
 *     },
 *     {
 *       "kf_account": "test2@test",
 *       "kf_nick": "ntest2",
 *       "kf_id": "1002"
 *     },
 *     {
 *       "kf_account": "test3@test",
 *       "kf_nick": "ntest3",
 *       "kf_id": "1003"
 *     }
 *   ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
make(exports, 'getCustomServiceList', function (callback) {
  // https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token= ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/customservice/getkflist?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 获取在线客服接待信息
 * 详细请看：http://dkf.qq.com/document-3_2.html
 *
 * Examples:
 * ```
 * api.getOnlineCustomServiceList(callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "kf_online_list": [
 *     {
 *       "kf_account": "test1@test",
 *       "status": 1,
 *       "kf_id": "1001",
 *       "auto_accept": 0,
 *       "accepted_case": 1
 *     },
 *     {
 *       "kf_account": "test2@test",
 *       "status": 1,
 *       "kf_id": "1002",
 *       "auto_accept": 0,
 *       "accepted_case": 2
 *     }
 *   ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
make(exports, 'getOnlineCustomServiceList', function (callback) {
  // https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token= ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/customservice/getonlinekflist?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

var md5 = function (input) {
  var crypto = require('crypto');
  var hash = crypto.createHash('md5');
  return hash.update(input).digest('hex');
};

/**
 * 添加客服账号
 * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html
 *
 * Examples:
 * ```
 * api.addKfAccount('test@test', 'nickname', 'password', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode" : 0,
 *  "errmsg" : "ok",
 * }
 * ```
 * @param {String} account 账号名字，格式为：前缀@公共号名字
 * @param {String} nick 昵称
 * @param {String} password 密码，可以直接传递明文，wechat模块自动进行md5加密
 * @param {Function} callback 回调函数
 */
make(exports, 'addKfAccount', function (account, nick, password, callback) {
  // https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/customservice/kfaccount/add?access_token=' + this.token.accessToken;
  var data = {
    'kf_account': account,
    'nickname': nick,
    'password': md5(password)
  };

  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 设置客服账号
 * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html
 *
 * Examples:
 * ```
 * api.updateKfAccount('test@test', 'nickname', 'password', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode" : 0,
 *  "errmsg" : "ok",
 * }
 * ```
 * @param {String} account 账号名字，格式为：前缀@公共号名字
 * @param {String} nick 昵称
 * @param {String} password 密码，可以直接传递明文，wechat模块自动进行md5加密
 * @param {Function} callback 回调函数
 */
make(exports, 'updateKfAccount', function (account, nick, password, callback) {
  // https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/customservice/kfaccount/update?access_token=' + this.token.accessToken;
  var data = {
    'kf_account': account,
    'nickname': nick,
    'password': md5(password)
  };

  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 删除客服账号
 * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html
 *
 * Examples:
 * ```
 * api.deleteKfAccount('test@test', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode" : 0,
 *  "errmsg" : "ok",
 * }
 * ```
 * @param {String} account 账号名字，格式为：前缀@公共号名字
 * @param {Function} callback 回调函数
 */
make(exports, 'deleteKfAccount', function (account, callback) {
  // https://api.weixin.qq.com/customservice/kfaccount/del?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/customservice/kfaccount/del?access_token=' + this.token.accessToken + '&kf_account=' + account;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 设置客服头像
 * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html
 *
 * Examples:
 * ```
 * api.setKfAccountAvatar('test@test', '/path/to/avatar.png', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode" : 0,
 *  "errmsg" : "ok",
 * }
 * ```
 * @param {String} account 账号名字，格式为：前缀@公共号名字
 * @param {String} filepath 头像路径
 * @param {Function} callback 回调函数
 */
make(exports, 'setKfAccountAvatar', function (account, filepath, callback) {
  // http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var url = that.endpoint + '/customservice/kfaccount/uploadheadimg?access_token=' + that.token.accessToken + '&kf_account=' + account;
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

/*********会话控制**********/

/**
 * 创建会话
 * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN
 *
 * Examples:
 * ```
 * api.createKfSession('test@test', 'openidxxx', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode" : 0,
 *  "errmsg" : "ok",
 * }
 * ```
 * @param {String} account 完整客服帐号，格式为：帐号前缀@公众号微信号
 * @param {String} openid 粉丝的openid
 * @param {Function} callback 回调函数
 */
make(exports, 'createKfSession', function (account, openid, callback) {
  //https://api.weixin.qq.com/customservice/kfsession/create?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/customservice/kfsession/create?access_token=' + this.token.accessToken;
  this.request(url, postJSON({
    kf_account: account,
    openid: openid
  }), wrapper(callback));
});

/**
 * 关闭会话
 * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN
 *
 * Examples:
 * ```
 * api.closeKfSession('test@test', 'openidxxx', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode" : 0,
 *  "errmsg" : "ok",
 * }
 * ```
 * @param {String} account 完整客服帐号，格式为：帐号前缀@公众号微信号
 * @param {String} openid 粉丝的openid
 * @param {Function} callback 回调函数
 */
make(exports, 'closeKfSession', function (account, openid, callback) {
  //https://api.weixin.qq.com/customservice/kfsession/close?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/customservice/kfsession/close?access_token=' + this.token.accessToken;
  this.request(url, postJSON({
    kf_account: account,
    openid: openid
  }), wrapper(callback));
});

/**
 * 获取客户会话状态
 * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN
 *
 * Examples:
 * ```
 * api.getKfSession('openidxxx', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *    "createtime" : 123456789,
 *    "kf_account" : "test1@test"
 * }
 * ```
 * @param {String} openid 粉丝的openid
 * @param {Function} callback 回调函数
 */
make(exports, 'getKfSession', function (openid, callback) {
  //https://api.weixin.qq.com/customservice/kfsession/getsession?access_token=ACCESS_TOKEN&openid=OPENID
  var url = this.endpoint + '/customservice/kfsession/getsession?access_token=' + this.token.accessToken + '&openid=' + openid;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 获取客服会话列表
 * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN
 *
 * Examples:
 * ```
 * api.getKfSessionList('openidxxx', callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *    "sessionlist" : [
 *       {
 *          "createtime" : 123456789,
 *          "openid" : "OPENID"
 *       },
 *       {
 *          "createtime" : 123456789,
 *          "openid" : "OPENID"
 *       }
 *    ]
 * }
 * ```
 * @param {String} account 完整客服帐号，格式为：帐号前缀@公众号微信号
 * @param {Function} callback 回调函数
 */
make(exports, 'getKfSessionList', function (account, callback) {
  //https://api.weixin.qq.com/customservice/kfsession/getsessionlist?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT
  var url = this.endpoint + '/customservice/kfsession/getsessionlist?access_token=' + this.token.accessToken + '&kf_account=' + account;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 获取未接入会话列表
 * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN
 *
 * Examples:
 * ```
 * api.getKfSessionWaitCase(callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *    "count" : 150,                    //未接入会话数量
 *    "waitcaselist" : [                //未接入会话列表，最多返回100条数据，按照来访顺序
 *       {
 *          "latest_time" : 123456789,
 *          "openid" : "OPENID"
 *       },
 *       {
 *          "latest_time" : 123456789,
 *          "openid" : "OPENID"
 *       }
 *    ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
make(exports, 'getKfSessionWaitCase', function (callback) {
  //https://api.weixin.qq.com/customservice/kfsession/getwaitcase?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/customservice/kfsession/getwaitcase?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});
