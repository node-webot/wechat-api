'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 获取分组列表
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html>
 * Examples:
 * ```
 * api.getGroups(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "groups": [
 *    {"id": 0, "name": "未分组", "count": 72596},
 *    {"id": 1, "name": "黑名单", "count": 36}
 *  ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
make(exports, 'getGroups', function (callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/get?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/groups/get?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 查询用户在哪个分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html>
 * Examples:
 * ```
 * api.getWhichGroup(openid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "groupid": 102
 * }
 * ```
 * @param {String} openid Open ID
 * @param {Function} callback 回调函数
 */
make(exports, 'getWhichGroup', function (openid, callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/getid?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/groups/getid?access_token=' + this.token.accessToken;
  var data = {
    'openid': openid
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 创建分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html>
 * Examples:
 * ```
 * api.createGroup('groupname', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"group": {"id": 107, "name": "test"}}
 * ```
 * @param {String} name 分组名字
 * @param {Function} callback 回调函数
 */
make(exports, 'createGroup', function (name, callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/create?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"name":"test"}}
  var url = this.endpoint + '/cgi-bin/groups/create?access_token=' + this.token.accessToken;
  var data = {
    'group': {'name': name}
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 更新分组名字
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html>
 * Examples:
 * ```
 * api.updateGroup(107, 'new groupname', callback);
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
 * @param {Number} id 分组ID
 * @param {String} name 新的分组名字
 * @param {Function} callback 回调函数
 */
make(exports, 'updateGroup', function (id, name, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"id":108,"name":"test2_modify2"}}
  var url = this.endpoint + '/cgi-bin/groups/update?access_token=' + this.token.accessToken;
  var data = {
    'group': {'id': id, 'name': name}
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 移动用户进分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html>
 * Examples:
 * ```
 * api.moveUserToGroup(openid, groupId, callback);
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
 * @param {String} openid 用户的openid
 * @param {Number} groupId 分组ID
 * @param {Function} callback 回调函数
 */
make(exports, 'moveUserToGroup', function (openid, groupId, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"openid":"oDF3iYx0ro3_7jD4HFRDfrjdCM58","to_groupid":108}
  var url = this.endpoint + '/cgi-bin/groups/members/update?access_token=' + this.token.accessToken;
  var data = {
    'openid': openid,
    'to_groupid': groupId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 删除分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html>
 * Examples:
 * ```
 * api.removeGroup(groupId, callback);
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
 * @param {Number} groupId 分组ID
 * @param {Function} callback 回调函数
 */
make(exports, 'removeGroup', function (groupId, callback) {
  var url = this.endpoint + '/cgi-bin/groups/delete?access_token=' + this.token.accessToken;
  var data = {
    'group': { id: groupId}
  };
  this.request(url, postJSON(data), wrapper(callback));
});
