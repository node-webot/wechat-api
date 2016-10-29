'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
/**
 * 创建标签
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.createTag(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "tag": [
 *    "id": 134, // 标签id
 *    "name": "广东"
 *  ]
 * }
 * ```
 * @param {String} name tag name
 * @param {Function} callback 回调函数
 */
exports.createTag = function (name, callback) {
  this.preRequest(this._createTag, arguments);
};

/*!
 * 创建标签的未封装版本
 */
exports._createTag = function (name, callback) {
  // https://api.weixin.qq.com/cgi-bin/tags/create?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/tags/create?access_token=' + this.token.accessToken;
  var data = {
    'tag': {
      'name': name
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 获取公众号已创建的标签
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.getTags(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "tags":[{
 *    'id':1,
 *    'name': '黑名单',
 *    'count': 0  // 此标签下粉丝数
 *  },{
 *    'id':2,
 *    'name': '星标组',
 *    'count':0
 *  }]
 * }
 * ```
 * @param {String} openid Open ID
 * @param {Function} callback 回调函数
 */
exports.getTags = function (callback) {
  this.preRequest(this._getTags, arguments);
};

/*!
 * 获取公众号已创建的标签的未封装版本
 */
exports._getTags = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/tags/get?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/tags/get?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 编辑标签
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.editTag(id, name, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}}
 * ```
 * @param {Number} id 标签ID
 * @param {String} name 标签新名字
 * @param {Function} callback 回调函数
 */
exports.editTag = function (id, name, callback) {
  this.preRequest(this._editTag, arguments);
};

/*!
 * 编辑标签的未封装版本
 */
exports._editTag = function (id, name, callback) {
  // https://api.weixin.qq.com/cgi-bin/tags/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"tag":{"id":134, "name":"test"}}
  var url = this.endpoint + '/cgi-bin/tags/update?access_token=' + this.token.accessToken;
  var data = {
    'tag': {
      'id': id,
      'name': name
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 删除标签
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.deleteTag(id, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {Number} id 标签ID
 * @param {Function} callback 回调函数
 */
exports.deleteTag = function (id, callback) {
  this.preRequest(this._deleteTag, arguments);
};

/*!
 * 删除标签的未封装版本
 */
exports._deleteTag = function (id, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/tags/delete?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"tag":{"id":108}}
  var url = this.endpoint + '/cgi-bin/tags/delete?access_token=' + this.token.accessToken;
  var data = {
    'tag': {'id': id}
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 获取标签下粉丝列表
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.getTagUsers(tagid, openid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "count": 2,
 *   "data":{
 *     "openid":[
 *       ...
 *     ]
 *   },
 *   "next_openid": "..."
 * }
 * ```
 * @param {Number} tagId 标签ID
 * @param {String} openid 分页起始openid
 * @param {Function} callback 回调函数
 */
exports.getTagUsers = function (tagId, openid, callback) {
  this.preRequest(this._getTagUsers, arguments);
};

/*!
 * 获取标签下粉丝列表的未封装版本
 */
exports._getTagUsers = function (tagId, openid, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"tagid":108, "next_openid":"oDF3iYx0ro3_7jD4HFRDfrjdCM58"}
  var url = this.endpoint + '/cgi-bin/user/tag/get?access_token=' + this.token.accessToken;
  var data = {
    'tagid': tagId,
    'next_openid': openid
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 批量为用户打标签
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.memberBatchtagging(tagId, openList, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {Number} tagId 标签ID
 * @param {Array} openList 用户openids
 * @param {Function} callback 回调函数
 */
exports.membersBatchtagging = function (tagId, openList, callback) {
  this.preRequest(this._membersBatchtagging, arguments);
};

/*!
 * 批量为用户打标签的未封装版本
 */
exports._membersBatchtagging = function (tagId, openList, callback) {
  // https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/tags/members/batchtagging?access_token=' + this.token.accessToken;
  var data = {
    'openid_list':openList,
    'tagid': tagId
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 批量为用户取消标签
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.memberBatchuntagging(tagId, openList, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {Number} tagId 标签ID
 * @param {Array} openList 用户openids
 * @param {Function} callback 回调函数
 */
exports.membersBatchuntagging = function (tagId, openList, callback) {
  this.preRequest(this._membersBatchuntagging, arguments);
};

/*!
 * 批量为用户取消标签的未封装版本
 */
exports._membersBatchuntagging = function (tagId, openList, callback) {
  // https://api.weixin.qq.com/cgi-bin/tags/members/batchuntagging?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/tags/members/batchuntagging?access_token=' + this.token.accessToken;
  var data = {
    'openid_list':openList,
    'tagid': tagId
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 获取用户身上的标签列表
 * 详情请见：<http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN>
 * Examples:
 * ```
 * api.getUserTags(openid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"tagid_list": [134, 2]}
 * ```
 * @param {openid} 用户openid
 * @param {Function} callback 回调函数
 */
exports.getUserTags = function (openid, callback) {
  this.preRequest(this._getUserTags, arguments);
};

/*!
 * 获取用户身上的标签列表的未封装版本
 */
exports._getUserTags = function (openid, callback) {
  // https://api.weixin.qq.com/cgi-bin/tags/getidlist?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/tags/getidlist?access_token=' + this.token.accessToken;
  var data = {
    'openid':openid
  };
  this.request(url, postJSON(data), wrapper(callback));
};

