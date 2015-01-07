var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

var methods = [
  'getArticleSummary',
  'getArticleTotal',
  'getUserRead',
  'getUserReadHour',
  'getUserShare',
  'getUserShareHour'
];

/**
 * 图文分析数据接口指的是用于获得公众平台官网数据统计模块中图文分析数据的接口
 * 详情请见：<http://mp.weixin.qq.com/wiki/8/c0453610fb5131d1fcb17b4e87c82050.html>
 * Examples:
 * ```
 * api.getArticleSummary(startDate, endDate, callback); // 只能取1天数据
 * api.getArticleTotal(startDate, endDate, callback); // 只能取1天数据
 * api.getUserRead(startDate, endDate, callback); // 只能取3天数据
 * api.getUserReadHour(startDate, endDate, callback); // 只能取1天数据
 * api.getUserShare(startDate, endDate, callback); // 只能取7天数据
 * api.getUserShareHour(startDate, endDate, callback); // 只能取1天数据
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "list":[...] // 详细请参见<http://mp.weixin.qq.com/wiki/8/c0453610fb5131d1fcb17b4e87c82050.html>
 * }
 * ```
 * @param {String} startDate 起始日期，格式为2014-12-08
 * @param {String} endDate 结束日期，格式为2014-12-08
 * @param {Function} callback 回调函数
 */
methods.forEach(function (method) {
  exports[method] = function (begin, end, callback) {
    this.preRequest(this['_' + method], arguments);
  };
});

/*!
* 获取分析数据的未封装版本
*/
methods.forEach(function (method) {
  exports['_' + method] = function (begin, end, callback) {
    var data = {
      begin_date: begin,
      end_date: end
    };
    var url = 'https://api.weixin.qq.com/datacube/' + method.toLowerCase() + '?access_token=' + this.token.accessToken;
    this.request(url, postJSON(data), wrapper(callback));
  };
});
