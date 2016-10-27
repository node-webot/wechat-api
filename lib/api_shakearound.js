'use strict';

var fs = require('fs');
var path = require('path');
var formstream = require('formstream');
var crypto = require('crypto');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 申请开通功能
 * 接口说明:
 * 申请开通摇一摇周边功能。成功提交申请请求后，工作人员会在三个工作日内完成审核。若审核不通过，可以重新提交申请请求。
 * 若是审核中，请耐心等待工作人员审核，在审核中状态不能再提交申请请求。
 * 详情请参见：<http://mp.weixin.qq.com/wiki/13/025f1d471dc999928340161c631c6635.html>
 *
 * Options:
 * ```
 * {
 *  "name": "zhang_san",
 *  "phone_number": "13512345678",
 *  "email": "weixin123@qq.com",
 *  "industry_id": "0118",
 *  "qualification_cert_urls": [
 *    "http://shp.qpic.cn/wx_shake_bus/0/1428565236d03d864b7f43db9ce34df5f720509d0e/0",
 *    "http://shp.qpic.cn/wx_shake_bus/0/1428565236d03d864b7f43db9ce34df5f720509d0e/0"
 *  ],
 *  "apply_reason": "test"
 * }
 * ```
 *
 * Examples:
 * ```
 * api.registerShakeAccount(options, callback);
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
 *   "data" : { },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name registerShakeAccount
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'registerShakeAccount', function (options, callback) {
  var url = this.endpoint + '/shakearound/account/register?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 查询审核状态
 * 接口说明：
 * 查询已经提交的开通摇一摇周边功能申请的审核状态。在申请提交后，工作人员会在三个工作日内完成审核。
 * 详情请参见：http://mp.weixin.qq.com/wiki/13/025f1d471dc999928340161c631c6635.html
 * Examples:
 * ```
 * api.checkShakeAccountStatus(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "apply_time": 1432026025,
 *     "audit_comment": "test",
 *     "audit_status": 1,       //审核状态。0：审核未通过、1：审核中、2：审核已通过；审核会在三个工作日内完成
 *     "audit_time": 0
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name checkShakeAccountStatus
 * @param {Function} callback 回调函数
 */
make(exports, 'checkShakeAccountStatus', function (callback) {
  var url = this.endpoint + '/shakearound/account/auditstatus?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

/**
 * 设备管理: 申请设备ID。
 * 接口说明:
 * 申请配置设备所需的UUID、Major、Minor。若激活率小于50%，不能新增设备。单次新增设备超过500个，
 * 需走人工审核流程。审核通过后，可用返回的批次ID用“查询设备列表”接口拉取本次申请的设备ID。
 * 详情请参见：<http://mp.weixin.qq.com/wiki/15/b9e012f917e3484b7ed02771156411f3.html>
 *
 * Options:
 * ```
 * {
 *   "quantity":3,
 *   "apply_reason":"测试",
 *   "comment":"测试专用",
 *   "poi_id":1234
 * }
 * ```
 *
 * Examples:
 * ```
 * api.applyBeacons(options, callback);
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
 *   "data" : { ... },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name applyBeacons
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'applyBeacons', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/applyid?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 设备管理: 查询设备ID申请审核状态。
 * 接口说明:
 * 查询设备ID申请的审核状态。若单次申请的设备ID数量小于等于500个，系统会进行快速审核；
 * 若单次申请的设备ID数量大于500个，则在三个工作日内完成审核。
 * 详情请参见：<http://mp.weixin.qq.com/wiki/10/9926857d34ef8cea6bcd6cffb6cea80a.html>
 *
 * Options:
 * ```
 * {
 *   "apply_id": 12345
 * }
 * ```
 *
 * Examples:
 * ```
 * api.applyBeaconsStatus(apply_id, callback);
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
 *   "data" : { ... },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name applyBeaconsStatus
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'applyBeaconsStatus', function (apply_id, callback) {
  var data = {
    apply_id: apply_id
  };
  var url = this.endpoint + '/shakearound/device/applystatus?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 设备管理: 编辑设备的备注信息。
 * 接口说明:
 * 可用设备ID或完整的UUID、Major、Minor指定设备，二者选其一。
 * 详情请参见：http://mp.weixin.qq.com/wiki/15/b9e012f917e3484b7ed02771156411f3.html
 * Options:
 * ```
 * {
 *  "device_identifier": {
 *    // 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *    "device_id": 10011,
 *    "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *    "major": 1002,
 *    "minor": 1223
 *  },
 *  "comment": "test"
 * }
 * ```
 * Examples:
 * ```
 * api.updateBeacon(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name updateBeacon
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'updateBeacon', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/update?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 设备管理: 配置设备与门店的关联关系。
 * 接口说明:
 * 修改设备关联的门店ID、设备的备注信息。可用设备ID或完整的UUID、Major、Minor指定设备，二者选其一。
 * 详情请参见：http://mp.weixin.qq.com/wiki/15/b9e012f917e3484b7ed02771156411f3.html
 * Options:
 * ```
 * {
 *   "device_identifier": {
 *     "device_id": 10011,
 *     "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *     "major": 1002,
 *     "minor": 1223
 *   },
 *   "poi_id": 1231
 * }
 * ```
 * Examples:
 * ```
 * api.bindBeaconLocation(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name bindBeaconLocation
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'bindBeaconLocation', function(options, callback) {
  var url = this.endpoint + '/shakearound/device/bindlocation?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 设备管理: 查询设备列表
 * 接口说明:
 * 查询已有的设备ID、UUID、Major、Minor、激活状态、备注信息、关联门店、关联页面等信息。
 * 可指定设备ID或完整的UUID、Major、Minor查询，也可批量拉取设备信息列表。
 * 详情请参见：http://mp.weixin.qq.com/wiki/15/b9e012f917e3484b7ed02771156411f3.html
 * Options:
 * 1) 查询指定设备时：
 * ```
 * {
 *  "device_identifier": [
 *    {
 *      "device_id":10011,
 *      "uuid":"FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *      "major":1002,
 *      "minor":1223
 *    }
 *  ]
 * }
 * ```
 * 2) 需要分页查询或者指定范围内的设备时：
 * ```
 * {
 *   "begin": 0,
 *   "count": 3
 * }
 * ```
 * 3) 当需要根据批次ID查询时：
 * ```
 * {
 *   "apply_id": 1231,
 *   "begin": 0,
 *   "count": 3
 * }
 * ```
 * Examples:
 * ```
 * api.getBeacons(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data": {
 *     "devices": [
 *       {
 *         "comment": "",
 *         "device_id": 10097,
 *         "major": 10001,
 *         "minor": 12102,
 *         "page_ids": "15369",
 *         "status": 1, //激活状态，0：未激活，1：已激活（但不活跃），2：活跃
 *         "poi_id": 0,
 *         "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
 *       },
 *       {
 *         "comment": "",
 *         "device_id": 10098,
 *         "major": 10001,
 *         "minor": 12103,
 *         "page_ids": "15368",
 *         "status": 1,
 *         "poi_id": 0,
 *         "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
 *       }
 *      ],
 *      "total_count": 151
 *    },
 *    "errcode": 0,
 *    "errmsg": "success."
 * }
 * ```
 *
 * @name getBeacons
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'getBeacons', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/search?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});


/**
 * 页面管理: 新增页面
 * 接口说明:
 * 新增摇一摇出来的页面信息，包括在摇一摇页面出现的主标题、副标题、图片和点击进去的超链接。
 * 其中，图片必须为用素材管理接口（uploadPageIcon函数）上传至微信侧服务器后返回的链接。
 * 详情请参见：http://mp.weixin.qq.com/wiki/5/6626199ea8757c752046d8e46cf13251.html
 * Page:
 * ```
 * {
 *   "title":"主标题",
 *   "description":"副标题",
 *   "page_url":" https://zb.weixin.qq.com",
 *   "comment":"数据示例",
 *   "icon_url":"http://shp.qpic.cn/wx_shake_bus/0/14288351768a23d76e7636b56440172120529e8252/120"
 *   //调用uploadPageIcon函数获取到该URL
 * }
 * ```
 * Examples:
 * ```
 * api.createPage(page, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "page_id": 28840
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name createPage
 * @param {Object} page 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'createPage', function (page, callback) {
  var url = this.endpoint + '/shakearound/page/add?access_token=' + this.token.accessToken;
  this.request(url, postJSON(page), wrapper(callback));
});

/**
 * 页面管理: 编辑页面信息
 * 接口说明:
 * 编辑摇一摇出来的页面信息，包括在摇一摇页面出现的主标题、副标题、图片和点击进去的超链接。
 * 详情请参见：http://mp.weixin.qq.com/wiki/5/6626199ea8757c752046d8e46cf13251.html
 * Page:
 * ```
 * {
 *   "page_id":12306,
 *   "title":"主标题",
 *   "description":"副标题",
 *   "page_url":" https://zb.weixin.qq.com",
 *   "comment":"数据示例",
 *   "icon_url":"http://shp.qpic.cn/wx_shake_bus/0/14288351768a23d76e7636b56440172120529e8252/120"
 *   //调用uploadPageIcon函数获取到该URL
 * }
 * ```
 * Examples:
 * ```
 * api.updatePage(page, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "page_id": 28840
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name updatePage
 * @param {Object} page 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'updatePage', function (page, callback) {
  var url = this.endpoint + '/shakearound/page/update?access_token=' + this.token.accessToken;
  this.request(url, postJSON(page), wrapper(callback));
});

/**
 * 页面管理: 删除页面
 * 接口说明:
 * 删除已有的页面，包括在摇一摇页面出现的主标题、副标题、图片和点击进去的超链接。
 * 只有页面与设备没有关联关系时，才可被删除。
 * 详情请参见：http://mp.weixin.qq.com/wiki/5/6626199ea8757c752046d8e46cf13251.html
 * page_id:
 * ```
 * {
 *   "page_id": 34567
 * }
 * ```
 * Examples:
 * ```
 * api.deletePage(page_id, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name deletePage
 * @param {Object} page_id 指定页面的id
 * @param {Function} callback 回调函数
 */
make(exports, 'deletePage', function (page_id, callback) {
  var data = {page_id: page_id};
  var url = this.endpoint + '/shakearound/page/delete?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 页面管理: 查询页面列表
 * 接口说明:
 * 查询已有的页面，包括在摇一摇页面出现的主标题、副标题、图片和点击进去的超链接。提供两种查询方式，可指定页面ID查询，也可批量拉取页面列表。
 * 详情请参见：http://mp.weixin.qq.com/wiki/5/6626199ea8757c752046d8e46cf13251.html
 * Options:
 * 1) 需要查询指定页面时：
 * ```
 * {
 *   "page_ids":[12345, 23456, 34567]
 * }
 * ```
 * 2) 需要分页查询或者指定范围内的页面时：
 * ```
 * {
 *   "begin": 0,
 *   "count": 3
 * }
 * ```
 *
 * Examples:
 * ```
 * api.getBeacons(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data": {
 *     "pages": [
 *        {
 *          "comment": "just for test",
 *          "description": "test",
 *          "icon_url": "https://www.baidu.com/img/bd_logo1",
 *          "page_id": 28840,
 *          "page_url": "http://xw.qq.com/testapi1",
 *          "title": "测试1"
 *        },
 *        {
 *          "comment": "just for test",
 *          "description": "test",
 *          "icon_url": "https://www.baidu.com/img/bd_logo1",
 *          "page_id": 28842,
 *          "page_url": "http://xw.qq.com/testapi2",
 *          "title": "测试2"
 *        }
 *      ],
 *      "total_count": 2
 *    },
 *    "errcode": 0,
 *    "errmsg": "success."
 * }
 * ```
 *
 * @name getPages
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'getPages', function (options, callback) {
  var url = this.endpoint + '/shakearound/page/search?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});


/**
 * 上传图片素材
 * 接口说明：
 * 上传在摇一摇页面展示的图片素材，素材保存在微信侧服务器上。
 * 格式限定为：jpg,jpeg,png,gif，图片大小建议120px*120 px，限制不超过200 px *200 px，图片需为正方形。
 * 详情请参见：http://mp.weixin.qq.com/wiki/5/e997428269ff189d8f9a4b9e177be2d9.html
 * Examples:
 * ```
 * api.uploadPageIcon('filepath', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "pic_url": "http://shp.qpic.cn/wechat_shakearound_pic/0/1428377032e9dd2797018cad79186e03e8c5aec8dc/120"
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name uploadPageIcon
 * @param {String} filepath 文件路径
 * @param {Function} callback 回调函数
 */
make(exports, 'uploadPageIcon', function (filepath, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var url = this.endpoint + '/shakearound/material/add?access_token=' + that.token.accessToken;
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    that.request(url, opts, callback);
  });
});

/**
 * 配置设备与页面的关联关系
 * 接口说明:
 * 配置设备与页面的关联关系。支持建立或解除关联关系，也支持新增页面或覆盖页面等操作。
 * 配置完成后，在此设备的信号范围内，即可摇出关联的页面信息。若设备配置多个页面，则随机出现页面信息。
 * 详情请参见：http://mp.weixin.qq.com/wiki/6/c449687e71510db19564f2d2d526b6ea.html
 * Options:
 * ```
 * {
 *  "device_identifier": {
 *    // 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *    "device_id":10011,
 *    "uuid":"FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *    "major":1002,
 *    "minor":1223
 *  },
 *  "page_ids":[12345, 23456, 334567]
 * }
 * ```
 * Examples:
 * ```
 * api.bindBeaconWithPages(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name bindBeaconWithPages
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'bindBeaconWithPages', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/bindpage?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 查询设备与页面的关联关系
 * 接口说明:
 * 查询设备与页面的关联关系。提供两种查询方式，可指定页面ID分页查询该页面所关联的所有的设备信息；
 * 也可根据设备ID或完整的UUID、Major、Minor查询该设备所关联的所有页面信息。
 * 详情请参见：http://mp.weixin.qq.com/wiki/6/c449687e71510db19564f2d2d526b6ea.html
 * Options:
 * 1) 当查询指定设备所关联的页面时：
 * ```
 * {
 *  "type": 1,
 *  "device_identifier": {
 *    // 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *    "device_id":10011,
 *    "uuid":"FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *    "major":1002,
 *    "minor":1223
 *  }
 * }
 * ```
 * 2) 当查询页面所关联的设备时：
 * {
 *  "type": 2,
 *  "page_id": 11101,
 *  "begin": 0,
 *  "count": 3
 * }
 * Examples:
 * ```
 * api.searchBeaconPageRelation(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "data": {
 *    "relations": [
 *      {
 *        "device_id": 797994,
 *        "major": 10001,
 *        "minor": 10023,
 *        "page_id": 50054,
 *        "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
 *      },
 *      {
 *        "device_id": 797994,
 *        "major": 10001,
 *        "minor": 10023,
 *        "page_id": 50055,
 *        "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
 *      }
 *    ],
 *    "total_count": 2
 *  },
 *  "errcode": 0,
 *  "errmsg": "success."
 * }
 * ```
 *
 * @name searchBeaconPageRelation
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'searchBeaconPageRelation', function (options, callback) {
  var url = this.endpoint + '/shakearound/relation/search?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 获取摇周边的设备及用户信息
 * 接口说明:
 * 获取设备信息，包括UUID、major、minor，以及距离、openID等信息。
 * 详情请参见：http://mp.weixin.qq.com/wiki/3/34904a5db3d0ec7bb5306335b8da1faf.html
 * Ticket:
 * ```
 * {
 *   "ticket":”6ab3d8465166598a5f4e8c1b44f44645”
 * }
 * ```
 * Examples:
 * ```
 * api.getShakeInfo(ticket, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name getShakeInfo
 * @param {Object} ticket 摇周边业务的ticket，可在摇到的URL中得到，ticket生效时间为30分钟
 * @param {Function} callback 回调函数
 */
make(exports, 'getShakeInfo', function (ticket, callback) {
  var data = {
    ticket: ticket
  };

  var url = this.endpoint + '/shakearound/user/getshakeinfo?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 数据统计: 以设备为维度的数据统计接口
 * 接口说明:
 * 查询单个设备进行摇周边操作的人数、次数，点击摇周边消息的人数、次数；查询的最长时间跨度为30天。
 * 详情请参见：http://mp.weixin.qq.com/wiki/0/8a24bcacad40fe7ee98d1573cb8a6764.html
 * Options:
 * ```
 * {
 *   "device_identifier": {
 *     "device_id":10011,  //设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *     "uuid":"FDA50693-A4E2-4FB1-AFCF-C6EB07647825", //UUID、major、minor，三个信息需填写完整，若填了设备编号，则可不填此信息。
 *     "major":1002,
 *     "minor":1223
 *   },
 *   "begin_date": 12313123311,
 *   "end_date": 123123131231
 * }
 * ```
 * Examples:
 * ```
 * api.getDeviceStatistics(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     {
 *       "click_pv": 0,
 *       "click_uv": 0,
 *       "ftime": 1425052800,
 *       "shake_pv": 0,
 *       "shake_uv": 0
 *     },
 *     {
 *       "click_pv": 0,
 *       "click_uv": 0,
 *       "ftime": 1425139200,
 *       "shake_pv": 0,
 *       "shake_uv": 0
 *     }
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name getDeviceStatistics
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'getDeviceStatistics', function (options, callback) {
  var url = this.endpoint + '/shakearound/statistics/device?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 数据统计: 批量查询设备统计数据接口
 * 接口说明:
 * 查询指定时间商家帐号下的每个设备进行摇周边操作的人数、次数，点击摇周边消息的人数、次数。
 * 只能查询最近90天内的数据，且一次只能查询一天。
 * 此接口无法获取当天的数据，最早只能获取前一天的数据。由于系统在凌晨处理前一天的数据，
 * 太早调用此接口可能获取不到数据，建议在早上8：00之后调用此接口。
 * 注意：对于摇周边人数、摇周边次数、点击摇周边消息的人数、点击摇周边消息的次数都为0的设备，不在结果列表中返回。
 * 详情请参见：<http://mp.weixin.qq.com/wiki/1/e0b035c89b0a9c95a8210204087fec69.html>
 * Options:
 * ```
 * {
 *   date: 1438704000,
 *   page_index: 1
 * }
 * ```
 * Examples:
 * ```
 * api.getDeviceStatisticsList(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 * "data": {
 *   "devices": [
 *     {
 *       "device_id": 10097,
 *       "major": 10001,
 *       "minor": 12102,
 *       "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
 *       "shake_pv": 1
 *       "shake_uv": 2
 *       "click_pv": 3
 *       "click_uv":4
 *     },
 *     {
 *       "device_id": 10097,
 *       "major": 10001,
 *       "minor": 12102,
 *       "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
 *       "shake_pv":1
 *       "shake_uv":2
 *       "click_pv":3
 *       "click_uv":4
 *     }
 *    ],
 *   },
 *   "date":1435075200
 *   "total_count": 151
 *   "page_index":1
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name getDeviceStatisticsList
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'getDeviceStatisticsList', function (options, callback) {
  var url = this.endpoint + '/shakearound/statistics/devicelist?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 数据统计: 以页面为维度的数据统计接口
 * 接口说明:
 * 查询单个页面通过摇周边摇出来的人数、次数，点击摇周边页面的人数、次数；查询的最长时间跨度为30天。
 * 详情请参见：http://mp.weixin.qq.com/wiki/0/8a24bcacad40fe7ee98d1573cb8a6764.html
 * Options:
 * ```
 * {
 *   "page_id": 12345,
 *   "begin_date": 12313123311,
 *   "end_date": 123123131231
 * }
 * ```
 * Examples:
 * ```
 * api.getPageStatistics(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     {
 *       "click_pv": 0,
 *       "click_uv": 0,
 *       "ftime": 1425052800,
 *       "shake_pv": 0,
 *       "shake_uv": 0
 *     },
 *     {
 *       "click_pv": 0,
 *       "click_uv": 0,
 *       "ftime": 1425139200,
 *       "shake_pv": 0,
 *       "shake_uv": 0
 *     }
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name getPageStatistics
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'getPageStatistics', function (options, callback) {
  var url = this.endpoint + '/shakearound/statistics/page?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 数据统计: 批量查询页面统计数据接口
 * 接口说明:
 * 查询指定时间商家帐号下的每个页面进行摇周边操作的人数、次数，点击摇周边消息的人数、次数。
 * 只能查询最近90天内的数据，且一次只能查询一天。
 * 此接口无法获取当天的数据，最早只能获取前一天的数据。由于系统在凌晨处理前一天的数据，
 * 太早调用此接口可能获取不到数据，建议在早上8：00之后调用此接口。
 * 注意：对于摇周边人数、摇周边次数、点击摇周边消息的人数、点击摇周边消息的次数都为0的设备，不在结果列表中返回。
 * 详情请参见：<http://mp.weixin.qq.com/wiki/1/e0b035c89b0a9c95a8210204087fec69.html>
 * Options:
 * ```
 * {
 *   date: 1425139200,
 *   page_index: 1
 * }
 * ```
 * Examples:
 * ```
 * api.getPageStatisticsList(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 * "data": {
 *   "pages": [
 *     {
 *       "page_id": 1,
 *       "shake_pv": 1,
 *       "shake_uv": 2,
 *       "click_pv": 3,
 *       "click_uv":4
 *     },
 *     {
 *       "page_id": 2,
 *       "shake_pv":1,
 *       "shake_uv":2,
 *       "click_pv":3,
 *       "click_uv":4
 *     }
 *    ],
 *   },
 *   "date":1435075200
 *   "total_count": 151
 *   "page_index":1
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name getPageStatisticsList
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'getPageStatisticsList', function (options, callback) {
  var url = this.endpoint + '/shakearound/statistics/pagelist?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 查询分组列表
 * 接口说明：
 * 查询账号下所有的分组。
 * options:
 * {
 *   begin: 0,
 *   count: 10
 * }
 * Examples:
 * ```
 * api.listBeaconGroup(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "total_count": 100,
 *     "groups":[
 *       {
 *          "group_id" : 123,
 *          "group_name" : "test1"
 *       },
 *       {
 *          "group_id" : 124,
 *          "group_name" : "test2"
 *       }
 *     ]
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name listBeaconGroup
 * @param {String} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'listBeaconGroup', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/group/getlist?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 查询分组详情
 * 接口说明：
 * 查询分组详情，包括分组名，分组id，分组里的设备列表
 * options:
 * {
  *  group_id: 123,
 *   begin: 0,
 *   count: 10
 * }
 * Examples:
 * ```
 * api.queryGroupBeacons(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "group_id" : 123,
 *     "group_name" : "test",
 *     "total_count": 100,
 *     "devices":[
 *       {
 *          "device_id" : 123456,
 *          "uuid" : "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *          "major" : 10001,
 *          "minor" : 10001,
 *          "comment" : "test device1",
 *          "poi_id" : 12345,
 *       },
 *       {
 *          "device_id" : 123457,
 *          "uuid" : "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *          "major" : 10001,
 *          "minor" : 10002,
 *          "comment" : "test device2",
 *          "poi_id" : 12345,
 *       }
 *     ]
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name queryGroupBeacons
 * @param {String} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'queryGroupBeacons', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/group/getdetail?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 新增分组
 * 接口说明：
 * 新建设备分组，每个帐号下最多只有100个分组。
 * group:
 * {
 *   group_name: 'test'
 * }
 * Examples:
 * ```
 * api.addBeaconGroup(group, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "group_id": 123,
 *     "group_name": 'test'
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name addBeaconGroup
 * @param {Object} group 分组信息
 * @param {Function} callback 回调函数
 */
make(exports, 'addBeaconGroup', function (group, callback) {
  var url = this.endpoint + '/shakearound/device/group/add?access_token=' + this.token.accessToken;
  this.request(url, postJSON(group), wrapper(callback));
});

/**
 * 编辑分组信息
 * 接口说明：
 * 编辑设备分组信息，目前只能修改分组名。
 * group:
 * {
 *   group_id: 123,
 *   group_name: 'test update'
 * }
 * Examples:
 * ```
 * api.updateBeaconGroup(group, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *     "group_id": 123,
 *     "group_name": 'test update'
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name updateBeaconGroup
 * @param {Object} group 分组信息
 * @param {Function} callback 回调函数
 */
make(exports, 'updateBeaconGroup', function (group, callback) {
  var url = this.endpoint + '/shakearound/device/group/update?access_token=' + this.token.accessToken;
  this.request(url, postJSON(group), wrapper(callback));
});

/**
 * 删除分组信息
 * 接口说明：
 * 删除设备分组，若分组中还存在设备，则不能删除成功。需把设备移除以后，才能删除。
 * group:
 * {
 *   group_id: 123
 * }
 * Examples:
 * ```
 * api.deleteBeaconGroup(group_id, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name deleteBeaconGroup
 * @param {Object} group 分组信息
 * @param {Function} callback 回调函数
 */
make(exports, 'deleteBeaconGroup', function (group_id, callback) {
  var data = {
    group_id: group_id
  };

  var url = this.endpoint + '/shakearound/device/group/delete?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 添加设备到分组
 * 接口说明：
 * 添加设备到分组，每个分组能够持有的设备上限为10000，并且每次添加操作的添加上限为1000。只有在摇周边申请的设备才能添加到分组。
 * Options:
 * ```
 * {
 *  "group_id": 123,
 *  "device_identifier": [
 *    {
 *      // 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *      "device_id": 10011,
 *      "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *      "major": 1002,
 *      "minor": 1223
 *    }
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.addGroupBeacons(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name addGroupBeacons
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'addGroupBeacons', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/group/adddevice?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 从分组中移除设备
 * 接口说明：
 * 从分组中移除设备，每次删除操作的上限为1000。
 * Options:
 * ```
 * {
 *  "group_id": 123,
 *  "device_identifier": [
 *    {
 *      // 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *      "device_id": 10011,
 *      "uuid": "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *      "major": 1002,
 *      "minor": 1223
 *    }
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.deleteGroupBeacons(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "data" : {
 *   },
 *   "errcode": 0,
 *   "errmsg": "success."
 * }
 * ```
 *
 * @name deleteGroupBeacons
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'deleteGroupBeacons', function (options, callback) {
  var url = this.endpoint + '/shakearound/device/group/deletedevice?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 创建红包活动
 * 接口说明:
 * 创建红包活动，设置红包活动有效期，红包活动开关等基本信息，返回活动id。
 * 详情请参见：http://mp.weixin.qq.com/wiki/12/9738788d171724b080b52f6e41490cb4.html
 * Options:
 * ```
 * {
 *   "use_template": 1,
 *   "logo_url": "https://lodejs.org/images/qr.jpg"
 * }
 * ```
 * Body:
 * ```
 * {
 *   "title": "抽奖活动名称",
 *   "desc": "抽奖活动描述",
 *   "onoff": 1,
 *   "begin_time": 1428854400,
 *   "expire_time": 1428940800,
 *   "sponsor_appid": "wx476f028272e53c62",
 *   "total": 10,
 *   "jump_url": "https://lodejs.org",
 *   "key": "u5pPq38tQP97yGn8iZxbBsfWvbn37poP"
 * }
 * ```
 * Examples:
 * ```
 * api.addLotteryInfo(options, body, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "",
 *   "lottery_id": "5794560",
 *   "page_id": 1,
 * }
 * ```
 *
 * @name addLotteryInfo
 * @param {Object} options 请求参数
 * @param {Object} body JSON格式的结构体
 * @param {Function} callback 回调函数
 */
make(exports, 'addLotteryInfo', function (options, body, callback) {
  var url = this.endpoint + '/shakearound/lottery/addlotteryinfo?&use_template=' + options.use_template + '&logo_url=' + options.logo_url + '&access_token=' + this.token.accessToken;
  this.request(url, postJSON(body), wrapper(callback));
});

/**
 * 录入红包信息
 * 接口说明:
 * 在调用"创建红包活动"接口之后，调用此接口录入红包信息。
 * 详情请参见：http://mp.weixin.qq.com/wiki/12/9738788d171724b080b52f6e41490cb4.html
 * Options:
 * ```
 * {
 *   "lottery_id": "5794560",
 *   "mchid": "1234567890",
 *   "sponsor_appid": "wx476f028272e53c62"
 *   "prize_info_list": [{
 *     "ticket": "v1|ZiPs2l0hpMBp3uwGI1rwp45vOdz/V/zQ/00jP9MeWT+e47/q1FJjwCIP34frSjzOxAEzJ7k2CtAg1pmcShvkChBWqbThxPm6MBuzceoHtj79iHuHaEn0WAO+j4sXnXnbGswFOlDYWg1ngvrRYnCY3g==",
 *   }]
 * }
 * ```
 * Examples:
 * ```
 * api.setPrizeBucket(options, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "",
 *   "success_num": 1,
 *   "repeat_ticket_list": [{
 *     "ticket": "v1|ZiPs2l0hpMBp3uwGI1rwp45vOdz/V/zQ/00jP9MeWT+e47/q1FJjwCIP34frSjzOxAEzJ7k2CtAg1pmcShvkChBWqbThxPm6MBuzceoHtj79iHuHaEn0WAO+j4sXnXnbGswFOlDYWg1ngvrRYnCY3g==",
 *   }]
 * }
 * ```
 *
 * @name setPrizeBucket
 * @param {Object} options 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'setPrizeBucket', function (options, callback) {
  var url = this.endpoint + '/shakearound/lottery/setprizebucket?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});

/**
 * 设置红包活动抽奖开关
 * 接口说明:
 * 开发者实时控制红包活动抽奖的开启和关闭。
 * 详情请参见：http://mp.weixin.qq.com/wiki/12/9738788d171724b080b52f6e41490cb4.html
 * Examples:
 * ```
 * api.setLotterySwitch(lotteryId, onoff, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": ""
 * }
 * ```
 *
 * @name setLotterySwitch
 * @param {String} lotteryId 红包抽奖id
 * @param {Number} onoff 活动抽奖开关，0：关闭，1：开启
 * @param {Function} callback 回调函数
 */
make(exports, 'setLotterySwitch', function (lotteryId, onoff, callback) {
  var url = this.endpoint + '/shakearound/lottery/setlotteryswitch?lottery_id=' + lotteryId + '&onoff=' + onoff + '&access_token=' + this.token.accessToken;
  this.request(url, wrapper(callback));
});

/**
 * 获取红包JSAPI参数
 * 接口说明:
 * 用于在第三方页面中，通过调用JSAPI来触发用户抽红包的操作。
 * 详情请参见：http://mp.weixin.qq.com/wiki/12/9738788d171724b080b52f6e41490cb4.html
 * Examples:
 * ```
 * api.getShakehbConfig(openid, lotteryId, key);
 * ```
 * Return:
 * ```
 * {
 *   "openid": "o-hVKuNknQQBZFDlbE8eibQzIX3o",
 *   "lottery_id": "5794560"
 *   "noncestr": "5K8264ILTKCH16CQ2502SI8ZNMTM67VS"
 *   "sign": "D6F2078841D003C09BF5263EDA3CD5F9"
 * }
 * ```
 *
 * @name getShakehbConfig
 * @param {String} openid 用户openid
 * @param {String} lotteryId 红包抽奖id
 * @param {String} key “创建红包活动”接口设置的key
 */
exports.getShakehbConfig = function (openid, lotteryId, key) {
  var params = {
    openid: openid,
    lottery_id: lotteryId,
    noncestr: Math.random().toString(36).substr(2, 15)
  };

  var query = Object.keys(params).sort().map(function(key) {
    return key + '=' + params[key];
  }).join('&');

  query += '&key=' + key;
  params.sign = crypto.createHash('md5').update(query).digest('hex').toUpperCase();

  return params;
};
