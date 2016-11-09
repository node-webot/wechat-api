'use strict';

var path = require('path');
var fs = require('fs');

var formstream = require('formstream');

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

/**
 * 上传永久素材，分别有图片（image）、语音（voice）、和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html>
 * Examples:
 * ```
 * api.uploadMaterial('filepath', type, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
 * ```
 * Shortcut:
 *
 * - `exports.uploadImageMaterial(filepath, callback);`
 * - `exports.uploadVoiceMaterial(filepath, callback);`
 * - `exports.uploadThumbMaterial(filepath, callback);`
 *
 * @param {String} filepath 文件路径
 * @param {String} type 媒体类型，可用值有image、voice、video、thumb
 * @param {Function} callback 回调函数
 */
make(exports, 'uploadMaterial', function (filepath, type, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var url = that.endpoint + '/cgi-bin/material/add_material?access_token=' + that.token.accessToken + '&type=' + type;
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    that.request(url, opts, wrapper(callback));
  });
});

['image', 'voice', 'thumb'].forEach(function (type) {
  var method = 'upload' + type[0].toUpperCase() + type.substring(1) + 'Material';
  exports[method] = function (filepath, callback) {
    this.uploadMaterial(filepath, type, callback);
  };
});

/**
 * 上传永久素材，视频（video）
 * 详情请见：<http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html>
 * Examples:
 * ```
 * var description = {
 *   "title":VIDEO_TITLE,
 *   "introduction":INTRODUCTION
 * };
 * api.uploadVideoMaterial('filepath', description, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"media_id":"MEDIA_ID"}
 * ```
 *
 * @param {String} filepath 视频文件路径
 * @param {Object} description 描述
 * @param {Function} callback 回调函数
 */
make(exports, 'uploadVideoMaterial', function (filepath, description, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    form.field('description', JSON.stringify(description));
    var url = that.endpoint + '/cgi-bin/material/add_material?access_token=' + that.token.accessToken + '&type=video';
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    that.request(url, opts, wrapper(callback));
  });
});

/**
 * 新增永久图文素材
 *
 * News:
 * ```
 * {
 *  "articles": [
 *    {
 *      "title": TITLE,
 *      "thumb_media_id": THUMB_MEDIA_ID,
 *      "author": AUTHOR,
 *      "digest": DIGEST,
 *      "show_cover_pic": SHOW_COVER_PIC(0 / 1),
 *      "content": CONTENT,
 *      "content_source_url": CONTENT_SOURCE_URL
 *    },
 *    //若新增的是多图文素材，则此处应还有几段articles结构
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.uploadNewsMaterial(news, callback);
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
 * @param {Object} news 图文对象
 * @param {Function} callback 回调函数
 */
exports.uploadNewsMaterial = function (news, callback) {
  this.preRequest(this._uploadNewsMaterial, arguments);
};

/*!
 * 新增永久图文素材的未封装版本
 */
exports._uploadNewsMaterial = function (news, callback) {
  var url = this.endpoint + '/cgi-bin/material/add_news?access_token=' + this.token.accessToken;
  this.request(url, postJSON(news), wrapper(callback));
};


/**
 * 更新永久图文素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html>
 * News:
 * ```
 * {
 *  "media_id":MEDIA_ID,
 *  "index":INDEX,
 *  "articles": {
 *    "title": TITLE,
 *    "thumb_media_id": THUMB_MEDIA_ID,
 *    "author": AUTHOR,
 *    "digest": DIGEST,
 *    "show_cover_pic": SHOW_COVER_PIC(0 / 1),
 *    "content": CONTENT,
 *    "content_source_url": CONTENT_SOURCE_URL
 *  }
 * }
 * ```
 * Examples:
 * ```
 * api.updateNewsMaterial(news, callback);
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
 * @param {Object} news 图文对象
 * @param {Function} callback 回调函数
 */
exports.updateNewsMaterial = function (news, callback) {
  this.preRequest(this._updateNewsMaterial, arguments);
};

/*!
 * 更新永久图文素材的未封装版本
 */
exports._updateNewsMaterial = function (news, callback) {
  var url = this.endpoint + '/cgi-bin/material/update_news?access_token=' + this.token.accessToken;
  this.request(url, postJSON(news), wrapper(callback));
};


/**
 * 根据媒体ID获取永久素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/4/b3546879f07623cb30df9ca0e420a5d0.html>
 * Examples:
 * ```
 * api.getMaterial('media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 *
 * @param {String} mediaId 媒体文件的ID
 * @param {Function} callback 回调函数
 */
exports.getMaterial = function (mediaId, callback) {
  this.preRequest(this._getMaterial, arguments);
};

/*!
 * 下载永久素材的未封装版本
 */
exports._getMaterial = function (mediaId, callback) {
  var url = this.endpoint + '/cgi-bin/material/get_material?access_token=' + this.token.accessToken;
  var opts = {
    type: 'POST',
    data: {'media_id': mediaId},
    headers: {
      'Content-Type': 'application/json'
    }
  };
  opts.timeout = 60000; // 60秒超时
  this.request(url, opts, wrapper(function (err, data, res) {
    // handle some err
    if (err) {
      return callback(err);
    }
    var contentType = res.headers['content-type'];
    if (contentType === 'application/json') {
      var ret;
      try {
        ret = JSON.parse(data);
        if (ret.errcode) {
          err = new Error(ret.errmsg);
          err.name = 'WeChatAPIError';
        }
      } catch (ex) {
        return callback(ex, data, res);
      }
      return callback(err, ret, res);
    }
    // 输出Buffer对象
    callback(null, data, res);
  }));
};

/**
 * 删除永久素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/5/e66f61c303db51a6c0f90f46b15af5f5.html>
 * Examples:
 * ```
 * api.removeMaterial('media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 *
 * @param {String} mediaId 媒体文件的ID
 * @param {Function} callback 回调函数
 */
exports.removeMaterial = function (mediaId, callback) {
  this.preRequest(this._removeMaterial, arguments);
};

/*!
 * 删除永久素材的未封装版本
 */
exports._removeMaterial = function (mediaId, callback) {
  var url = this.endpoint + '/cgi-bin/material/del_material?access_token=' + this.token.accessToken;
  this.request(url, postJSON({'media_id': mediaId}), wrapper(callback));
};


/**
 * 获取素材总数
 * 详情请见：<http://mp.weixin.qq.com/wiki/16/8cc64f8c189674b421bee3ed403993b8.html>
 * Examples:
 * ```
 * api.getMaterialCount(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 *
 * Result:
 * ```
 * {
 *  "voice_count":COUNT,
 *  "video_count":COUNT,
 *  "image_count":COUNT,
 *  "news_count":COUNT
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getMaterialCount = function (callback) {
  this.preRequest(this._getMaterialCount, arguments);
};



/*!
 * 删除永久素材的未封装版本
 */
exports._getMaterialCount = function (callback) {
  var url = this.endpoint + '/cgi-bin/material/get_materialcount?access_token=' + this.token.accessToken;
  this.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取永久素材列表
 * 详情请见：<http://mp.weixin.qq.com/wiki/12/2108cd7aafff7f388f41f37efa710204.html>
 * Examples:
 * ```
 * api.getMaterials(type, offset, count, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 *
 * Result:
 * ```
 * {
 *  "total_count": TOTAL_COUNT,
 *  "item_count": ITEM_COUNT,
 *  "item": [{
 *    "media_id": MEDIA_ID,
 *    "name": NAME,
 *    "update_time": UPDATE_TIME
 *  },
 *  //可能会有多个素材
 *  ]
 * }
 * ```
 * @param {String} type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
 * @param {Number} offset 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
 * @param {Number} count 返回素材的数量，取值在1到20之间
 * @param {Function} callback 回调函数
 */
exports.getMaterials = function (type, offset, count, callback) {
  this.preRequest(this._getMaterials, arguments);
};



/*!
 * 获取永久素材列表的未封装版本
 */
exports._getMaterials = function (type, offset, count, callback) {
  var url = this.endpoint + '/cgi-bin/material/batchget_material?access_token=' + this.token.accessToken;
  var data = {
    type: type,
    offset: offset,
    count: count
  };
  this.request(url, postJSON(data), wrapper(callback));
};
