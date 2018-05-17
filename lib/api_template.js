'use strict';

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
};

exports._setIndustry = function (industryIds, callback) {
  var apiUrl = this.endpoint + '/cgi-bin/template/api_set_industry?access_token=' + this.token.accessToken;
  this.request(apiUrl, postJSON(industryIds), wrapper(callback));
};

/**
 * 获取设置的行业信息
 * Examples:
 * ```
 * api.getIndustry(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * // 结果示例
 * {
 *   "primary_industry":{"first_class":"运输与仓储","second_class":"快递"},
 *   "secondary_industry":{"first_class":"IT科技","second_class":"互联网|电子商务"}
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getIndustry = function(callback){
  this.preRequest(this._getIndustry, arguments);
};

exports._getIndustry = function (callback) {
  var apiUrl = this.endpoint + '/cgi-bin/template/get_industry?access_token=' + this.token.accessToken;
  this.request(apiUrl, {dataType: 'json'}, wrapper(callback));
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
};

exports._addTemplate = function (templateIdShort, callback) {
  var apiUrl = this.endpoint + '/cgi-bin/template/api_add_template?access_token=' + this.token.accessToken;
  var templateId = {
    template_id_short: templateIdShort
  };
  this.request(apiUrl, postJSON(templateId), wrapper(callback));
};

/**
 * 获取模板列表
 * Examples:
 * ```
 * api.getAllPrivateTemplate(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * // 结果示例
 * {
 *  "template_list": [{
 *       "template_id": "iPk5sOIt5X_flOVKn5GrTFpncEYTojx6ddbt8WYoV5s",
 *       "title": "领取奖金提醒",
 *       "primary_industry": "IT科技",
 *       "deputy_industry": "互联网|电子商务",
 *       "content": "{ {result.DATA} }\n\n领奖金额:{ {withdrawMoney.DATA} }\n领奖  时间:{ {withdrawTime.DATA} }\n银行信息:{ {cardInfo.DATA} }\n到账时间:  { {arrivedTime.DATA} }\n{ {remark.DATA} }",
 *       "example": "您已提交领奖申请\n\n领奖金额：xxxx元\n领奖时间：2013-10-10 12:22:22\n银行信息：xx银行(尾号xxxx)\n到账时间：预计xxxxxxx\n\n预计将于xxxx到达您的银行卡"
 *    }]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getAllPrivateTemplate = function(callback){
  this.preRequest(this._getAllPrivateTemplate, arguments);
};

exports._getAllPrivateTemplate = function (callback) {
  var apiUrl = this.endpoint + '/cgi-bin/template/get_all_private_template?access_token=' + this.token.accessToken;
  this.request(apiUrl, {dataType: 'json'}, wrapper(callback));
};

/**
 * 删除模板
 * Examples:
 * ```
 * var templateId = ”Dyvp3-Ff0cnail_CDSzk1fIc6-9lOkxsQE7exTJbwUE”
 * api.delPrivateTemplate(templateId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} templateId 公众帐号下模板消息ID
 */
exports.delPrivateTemplate = function(templateId, callback){
  this.preRequest(this._delPrivateTemplate, arguments);
};

exports._delPrivateTemplate = function (templateId, callback) {
  var apiUrl = this.endpoint + '/cgi-bin/template/del_private_template?access_token=' + this.token.accessToken;
  var data = {
    template_id: templateId
  };
  this.request(apiUrl, postJSON(data), wrapper(callback));
};

/**
 * 发送模板消息
 * 详细细节: http://mp.weixin.qq.com/wiki/17/304c1885ea66dbedf7dc170d84999a9d.html
 * Examples:
 * ```
 * var templateId: '模板id';
 * // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
 * var url: 'http://weixin.qq.com/download';
 * var data = {
 *    "first": {
 *      "value":"恭喜你购买成功！",
 *      "color":"#173177"
 *    },
 *    "keyword1":{
 *      "value":"巧克力",
 *      "color":"#173177"
 *    },
 *    "keyword2": {
 *      "value":"39.8元",
 *      "color":"#173177"
 *    },
 *    "keyword3": {
 *      "value":"2014年9月22日",
 *      "color":"#173177"
 *    },
 *    "remark":{
 *      "value":"欢迎再次购买！",
 *      "color":"#173177"
 *    }
 * };
 * api.sendTemplate('openid', templateId, dest, data, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} templateId 模板ID
 * @param {Object} dest 跳转目的地置空，则在发送后，点击模板消息会进入一个空白页面（ios），或无法点击（android）
 * @param {Object} data 渲染模板的数据
 * @param {Function} callback 回调函数
 */
exports.sendTemplate = function (openid, templateId, dest, data, callback, callback2) {
  this.preRequest(this._sendTemplate, arguments);
};

exports._sendTemplate = function (openid, templateId, dest, data, callback, callback2) {
  /*
   * duplicated interface `function (openid, templateId, url, topColor, data, callback)`
   */
  var apiUrl = this.endpoint + '/cgi-bin/message/template/send?access_token=' + this.token.accessToken;

  if (typeof data === 'string') {
    data = callback;
    callback = callback2;
  }

  var url, miniprogram;
  if (typeof dest === 'string') {
    url = dest;
  } else {
    if (!dest) {
      dest = {};
    }
    url = dest.url;
    miniprogram = dest.miniprogram;
  }

  var template = {
    touser: openid,
    template_id: templateId,
    url: url,
    miniprogram: miniprogram,
    data: data
  };
  this.request(apiUrl, postJSON(template), wrapper(callback));
};
