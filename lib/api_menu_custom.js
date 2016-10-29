'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建个性化菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/0/c48ccd12b69ae023159b4bfaa7c39c20.html>
 *
 * Menu:
 * ```
 * {
 *  "button":[
 *    {
 *      "type":"click",
 *      "name":"今日歌曲",
 *      "key":"V1001_TODAY_MUSIC"
 *    },
 *    {
 *      "name":"菜单",
 *      "sub_button":[
 *        {
 *          "type":"view",
 *          "name":"搜索",
 *          "url":"http://www.soso.com/"
 *        },
 *        {
 *          "type":"click",
 *          "name":"赞一下我们",
 *          "key":"V1001_GOOD"
 *        }]
 *      }]
 *    }
 *  ],
 *  "matchrule":{
 *     "group_id":"2",
 *     "sex":"1", // 男1,女2
 *     "country":"中国",
 *     "province":"广东",
 *     "city":"广州",
 *     "client_platform_type":"2" // IOS(1), Android(2),Others(3)
 *   }
 * }
 * ```
 * Examples:
 * ```
 * api.createCustomMenu(menu, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * { menuid: 401550287 }
 *
 * ```
 * @param {Object} menu 菜单对象
 * @param {Function} callback 回调函数
 */
exports.createCustomMenu = function (menu, callback) {
  this.preRequest(this._createCustomMenu, arguments);
};

/*!
 * 创建个性化菜单的未封装版本
 */
exports._createCustomMenu = function (menu, callback) {
  var url = this.endpoint + '/cgi-bin/menu/addconditional?access_token=' + this.token.accessToken;
  this.request(url, postJSON(menu), wrapper(callback));
};


/**
 * 删除个性化菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/0/c48ccd12b69ae023159b4bfaa7c39c20.html>
 *
 * Examples:
 * ```
 * api.removeCustomMenu(menu_id,callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 *
 * @param {String} menu_id, 可以通过自定义菜单查询接口获取
 * @param {Function} callback 回调函数
 */
exports.removeCustomMenu = function (menu_id,callback) {
  this.preRequest(this._removeCustomMenu, arguments);
};

/*!
 * 删除个性化菜单的未封装版本
 */
exports._removeCustomMenu = function (menu_id,callback) {
  var url = this.endpoint + '/cgi-bin/menu/delconditional?access_token=' + this.token.accessToken;
  this.request(url, postJSON({
    'menuid' : menu_id
  }), wrapper(callback));
};



/**
 * 测试个性化菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/0/c48ccd12b69ae023159b4bfaa7c39c20.html>
 *
 * Examples:
 * ```
 * api.testCustomMenu(user_id,callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *    "button": [
 *       {
 *           "type": "view",
 *           "name": "tx",
 *           "url": "http://www.qq.com/",
 *           "sub_button": [ ]
 *       },
 *       {
 *           "type": "view",
 *           "name": "tx",
 *           "url": "http://www.qq.com/",
 *           "sub_button": [ ]
 *       },
 *       {
 *           "type": "view",
 *           "name": "tx",
 *           "url": "http://www.qq.com/",
 *           "sub_button": [ ]
 *       }
 *   ]
 * }
 * ```
 *
 * @param {String} user_id, 可以是粉丝的OpenID，也可以是粉丝的微信号。
 * @param {Function} callback 回调函数
 */
exports.testCustomMenu = function (user_id, callback) {
  this.preRequest(this._testCustomMenu, arguments);
};


/*!
 * 测试个性化菜单的未封装版本
 */
exports._testCustomMenu = function (user_id,callback) {
  var url = this.endpoint + '/cgi-bin/menu/trymatch?access_token=' + this.token.accessToken;
  this.request(url, postJSON({
    'user_id' : user_id
  }), wrapper(callback));
};
