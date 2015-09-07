var fs = require('fs');
var path = require('path');
var formstream = require('formstream');

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
  var url = 'https://api.weixin.qq.com/shakearound/account/register?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/account/auditstatus?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/device/applyid?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
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
  var url = 'https://api.weixin.qq.com/shakearound/device/update?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/device/bindlocation?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/device/search?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/page/add?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/page/update?access_token=' + this.token.accessToken;
  this.request(url, postJSON(page), wrapper(callback));
});

/**
 * 页面管理: 删除页面
 * 接口说明:
 * 删除已有的页面，包括在摇一摇页面出现的主标题、副标题、图片和点击进去的超链接。
 * 只有页面与设备没有关联关系时，才可被删除。
 * 详情请参见：http://mp.weixin.qq.com/wiki/5/6626199ea8757c752046d8e46cf13251.html
 * Page_ids:
 * ```
 * {
 *   "page_ids":[12345,23456,34567]
 * }
 * ```
 * Examples:
 * ```
 * api.deletePages(options, callback);
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
 * @name deletePages
 * @param {Object} page_ids 请求参数
 * @param {Function} callback 回调函数
 */
make(exports, 'deletePages', function (page_ids, callback) {
  var data = {page_ids: page_ids};
  var url = 'https://api.weixin.qq.com/shakearound/page/delete?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/page/search?access_token=' + this.token.accessToken;
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
    var url = 'https://api.weixin.qq.com/shakearound/material/add?access_token=' + that.token.accessToken;
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
 * 详情请参见：http://mp.weixin.qq.com/wiki/12/c8120214ec0ba08af5dfcc0da1a11400.html
 * Options:
 * ```
 * {
 *  "device_identifier": {
 *    // 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先
 *    "device_id":10011
 *    "uuid":"FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
 *    "major":1002,
 *    "minor":1223
 *  },
 *  "page_ids":[12345, 23456, 334567],
 *  "bind" :0,  //关联操作标志位， 0为解除关联关系，1为建立关联关系
 *  "append":0, //新增操作标志位， 0为覆盖，1为新增
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
  var url = 'https://api.weixin.qq.com/shakearound/device/bindpage?access_token=' + this.token.accessToken;
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

  var url = 'https://api.weixin.qq.com/shakearound/user/getshakeinfo?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/statistics/device?access_token=' + this.token.accessToken;
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
  var url = 'https://api.weixin.qq.com/shakearound/statistics/page?access_token=' + this.token.accessToken;
  this.request(url, postJSON(options), wrapper(callback));
});
