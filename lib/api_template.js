var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 设置所属行业
 * Examples:
 * ```
 * var industryIds = {
 *  "industry_id1":'1',
 *  "industry_id2":"4"
 * };
 * api.setIndustry(industryIds, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {Object} industryIds 公众号模板消息所属行业编号
 */
exports.setIndustry = function(industryIds, callback){
  this.preRequest(this._setIndustry, arguments);
}

exports._setIndustry = function (industryIds, callback) {
  var apiUrl = this.prefix + 'template/api_set_industry?access_token=' + this.token.accessToken;
  this.request(apiUrl, postJSON(industryIds), wrapper(callback));
};

/**
 * 获得模板ID
 * Examples:
 * ```
 * var templateIdShort = 'TM00015';
 * api.addTemplate(templateIdShort, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} templateIdShort 模板库中模板的编号，有“TM**”和“OPENTMTM**”等形式
 */
exports.addTemplate = function(templateIdShort, callback){
  this.preRequest(this._addTemplate, arguments);
}

exports._addTemplate = function (templateIdShort, callback) {
  var apiUrl = this.prefix + 'template/api_add_template?access_token=' + this.token.accessToken;
  var templateId = {
    template_id_short: templateIdShort
  };
  this.request(apiUrl, postJSON(templateId), wrapper(callback));
};

/**
 * 发送模板消息
 * Examples:
 * ```
 * var templateId: '模板id';
 * // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
 * var url: 'http://weixin.qq.com/download';
 * var topcolor = '#FF0000'; // 顶部颜色
 * var data = {
 *  user:{
 *    "value":'黄先生',
 *    "color":"#173177"
 *  }
 * };
 * api.sendTemplate('openid', templateId, url, topColor, data, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} templateId 模板ID
 * @param {String} url URL置空，则在发送后，点击模板消息会进入一个空白页面（ios），或无法点击（android）
 * @param {String} topColor 顶部颜色
 * @param {Object} data 渲染模板的数据
 * @param {Function} callback 回调函数
 */
exports.sendTemplate = function (openid, templateId, url, topColor, data, callback) {
  this.preRequest(this._sendTemplate, arguments);
};

exports._sendTemplate = function (openid, templateId, url, topColor, data, callback) {
  var apiUrl = this.prefix + 'message/template/send?access_token=' + this.token.accessToken;
  var template = {
    touser: openid,
    template_id: templateId,
    url: url,
    topcolor: topColor,
    data: data
  };
  this.request(apiUrl, postJSON(template), wrapper(callback));
};