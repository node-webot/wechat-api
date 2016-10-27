'use strict';

// 微信门店接口文档请参考：http://mp.weixin.qq.com/wiki/16/8f182af4d8dcea02c56506306bdb2f4c.html
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 创建门店
 *
 * Tips:
 * - 创建门店接口调用成功后不会实时返回poi_id。
 * - 成功创建后，门店信息会经过审核，审核通过后方可使用并获取poi_id。
 * - 图片photo_url必须为上传图片接口(api.uploadLogo，参见卡券接口)生成的url。
 * - 门店类目categories请参考微信公众号后台的门店管理部分。
 *
 * Poi:
 * ```
 * {
 *   "sid": "5794560",
 *   "business_name": "肯打鸡",
 *   "branch_name": "东方路店",
 *   "province": "上海市",
 *   "city": "上海市",
 *   "district": "浦东新区",
 *   "address": "东方路88号",
 *   "telephone": "021-5794560",
 *   "categories": ["美食,快餐小吃"],
 *   "offset_type": 1,
 *   "longitude": 125.5794560,
 *   "latitude": 45.5794560,
 *   "photo_list": [{
 *     "photo_url": "https://5794560.qq.com/1"
 *   }, {
 *     "photo_url": "https://5794560.qq.com/2"
 *   }],
 *   "recommend": "脉娜鸡腿堡套餐,脉乐鸡,全家捅",
 *   "special": "免费WIFE,外卖服务",
 *   "introduction": "肯打鸡是全球大型跨国连锁餐厅,2015年创立于米国,在世界上大约拥有3 亿间分店,主要售卖肯打鸡等垃圾食品",
 *   "open_time": "10:00-18:00",
 *   "avg_price": 88
 * }
 * ```
 * Examples:
 * ```
 * api.addPoi(poi, callback);
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
 * @name addPoi
 * @param {Object} poi 门店对象
 * @param {Function} callback 回调函数
 */
make(exports, 'addPoi', function (poi, callback) {
  var data = {
    business: {
      base_info: poi
    }
  };
  var url = this.endpoint + '/cgi-bin/poi/addpoi?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 获取门店信息
 *
 * Examples:
 * ```
 * api.getPoi(POI_ID, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "sid": "5794560",
 *   "business_name": "肯打鸡",
 *   "branch_name": "东方路店",
 *   "province": "上海市",
 *   "city": "上海市",
 *   "district": "浦东新区",
 *   "address": "东方路88号",
 *   "telephone": "021-5794560",
 *   "categories": ["美食,快餐小吃"],
 *   "offset_type": 1,
 *   "longitude": 125.5794560,
 *   "latitude": 45.5794560,
 *   "photo_list": [{
 *     "photo_url": "https://5794560.qq.com/1"
 *   }, {
 *     "photo_url": "https://5794560.qq.com/2"
 *   }],
 *   "recommend": "脉娜鸡腿堡套餐,脉乐鸡,全家捅",
 *   "special": "免费WIFE,外卖服务",
 *   "introduction": "肯打鸡是全球大型跨国连锁餐厅,2015年创立于米国,在世界上大约拥有3 亿间分店,主要售卖肯打鸡等垃圾食品",
 *   "open_time": "10:00-18:00",
 *   "avg_price": 88,
 *   "available_state": 3,
 *   "update_status": 0
 * }
 * ```
 * @name getPoi
 * @param {Number} poiId 门店ID
 * @param {Function} callback 回调函数
 */
make(exports, 'getPoi', function (poiId, callback) {
  var url = this.endpoint + '/cgi-bin/poi/getpoi?access_token=' + this.token.accessToken;
  var data = {
    poi_id: poiId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 获取门店列表
 * Examples:
 * ```
 * api.getPois(0, 20, callback);
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
 *   "errmsg": "ok"
 *   "business_list": [{
 *     "base_info": {
 *       "sid": "100",
 *       "poi_id": "5794560",
 *       "business_name": "肯打鸡",
 *       "branch_name": "东方路店",
 *       "address": "东方路88号",
 *       "available_state": 3
 *     }
 *   }, {
 *     "base_info": {
 *       "sid": "101",
 *       "business_name": "肯打鸡",
 *       "branch_name": "西方路店",
 *       "address": "西方路88号",
 *       "available_state": 4
 *     }
 *   }],
 *   "total_count": "2",
 * }
 * ```
 * @name getPois
 * @param {Number} begin 开始位置，0即为从第一条开始查询
 * @param {Number} limit 返回数据条数，最大允许50，默认为20
 * @param {Function} callback 回调函数
 */
make(exports, 'getPois', function (begin, limit, callback) {
  var url = this.endpoint + '/cgi-bin/poi/getpoilist?access_token=' + this.token.accessToken;
  var data = {
    begin: begin,
    limit: limit
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 删除门店
 *
 * Tips:
 *
 * - 待审核门店不允许删除
 *
 * Examples:
 * ```
 * api.delPoi(POI_ID, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name delPoi
 * @param {Number} poiId 门店ID
 * @param {Function} callback 回调函数
 */
make(exports, 'delPoi', function (poiId, callback) {
  var url = this.endpoint + '/cgi-bin/poi/delpoi?access_token=' + this.token.accessToken;
  var data = {
    poi_id: poiId
  };
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 修改门店服务信息
 *
 * Tips:
 *
 * - 待审核门店不允许修改
 *
 * Poi:
 * ```
 * {
 *   "poi_id": "5794560",
 *   "telephone": "021-5794560",
 *   "photo_list": [{
 *     "photo_url": "https://5794560.qq.com/1"
 *   }, {
 *     "photo_url": "https://5794560.qq.com/2"
 *   }],
 *   "recommend": "脉娜鸡腿堡套餐,脉乐鸡,全家捅",
 *   "special": "免费WIFE,外卖服务",
 *   "introduction": "肯打鸡是全球大型跨国连锁餐厅,2015年创立于米国,在世界上大约拥有3 亿间分店,主要售卖肯打鸡等垃圾食品",
 *   "open_time": "10:00-18:00",
 *   "avg_price": 88
 * }
 * ```
 * 特别注意，以上7个字段，若有填写内容则为覆盖更新，若无内容则视为不修改，维持原有内容。
 * photo_list字段为全列表覆盖，若需要增加图片，需将之前图片同样放入list中，在其后增加新增图片。
 *
 * Examples:
 * ```
 * api.updatePoi(poi, callback);
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
 * @name updatePoi
 * @param {Object} poi 门店对象
 * @param {Function} callback 回调函数
 */
make(exports, 'updatePoi', function (poi, callback) {
  var data = {
    business: {
      base_info: poi
    }
  };
  var url = this.endpoint + '/cgi-bin/poi/updatepoi?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

/**
 * 门店类目表
 *
 * Tips:
 *
 * - 类目名称接口是为商户提供自己门店类型信息的接口。门店类目定位的越规范，能够精准的吸引更多用户，提高曝光率。
 *
 * Examples:
 * ```
 * api.getWXCategory(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @name getWXCategory
 * @param {Function} callback 回调函数
 */
make(exports, 'getWXCategory', function (callback) {
  var url = this.endpoint + '/cgi-bin/poi/getwxcategory?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
});

