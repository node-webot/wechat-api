'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建自定义菜单
 * 详细请看：http://mp.weixin.qq.com/wiki/13/43de8269be54a0a6f64413e4dfa94f39.html
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
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.createMenu(menu, callback);
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
 * @param {Object} menu 菜单对象
 * @param {Function} callback 回调函数
 */
exports.createMenu = function (menu, callback) {
  this.preRequest(this._createMenu, arguments);
};

/*!
 * 创建自定义菜单的未封装版本
 */
exports._createMenu = function (menu, callback) {
  var url = this.endpoint + '/cgi-bin/menu/create?access_token=' + this.token.accessToken;
  this.request(url, postJSON(menu), wrapper(callback));
};

/**
 * 获取菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/5/f287d1a5b78a35a8884326312ac3e4ed.html>
 *
 * Examples:
 * ```
 * api.getMenu(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result: （注意:如果有个性化菜单被设置,返回的结果会具有更多信息,请参考微信文档)
 * ```
 * // 结果示例
 * {
 *  "menu": {
 *    "button":[
 *      {"type":"click","name":"今日歌曲","key":"V1001_TODAY_MUSIC","sub_button":[]},
 *      {"type":"click","name":"歌手简介","key":"V1001_TODAY_SINGER","sub_button":[]},
 *      {"name":"菜单","sub_button":[
 *        {"type":"view","name":"搜索","url":"http://www.soso.com/","sub_button":[]},
 *        {"type":"view","name":"视频","url":"http://v.qq.com/","sub_button":[]},
 *        {"type":"click","name":"赞一下我们","key":"V1001_GOOD","sub_button":[]}]
 *      }
 *    ]
 *  }
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getMenu = function (callback) {
  this.preRequest(this._getMenu, arguments);
};

/*!
 * 获取自定义菜单的未封装版本
 */
exports._getMenu = function (callback) {
  var url = this.endpoint + '/cgi-bin/menu/get?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 删除自定义菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/16/8ed41ba931e4845844ad6d1eeb8060c8.html>
 * Examples:
 * ```
 * api.removeMenu(callback);
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
 * @param {Function} callback 回调函数
 */
exports.removeMenu = function (callback) {
  this.preRequest(this._removeMenu, arguments);
};

/*!
 * 删除自定义菜单的未封装版本
 */
exports._removeMenu = function (callback) {
  var url = this.endpoint + '/cgi-bin/menu/delete?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};


/**
 * 获取自定义菜单配置
 * 详细请看：<http://mp.weixin.qq.com/wiki/17/4dc4b0514fdad7a5fbbd477aa9aab5ed.html>
 * Examples:
 * ```
 * api.getMenuConfig(callback);
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
 * @param {Function} callback 回调函数
 */
exports.getMenuConfig = function (callback) {
  this.preRequest(this._getMenuConfig, arguments);
};

/*!
 * 获取自定义菜单配置的未封装版本
 */
exports._getMenuConfig = function (callback) {
  var url = this.endpoint + '/cgi-bin/get_current_selfmenu_info?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};
