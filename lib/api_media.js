'use strict';

var path = require('path');
var fs = require('fs');

var formstream = require('formstream');

var util = require('./util');
var wrapper = util.wrapper;

/**
 * 新增临时素材，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/5/963fc70b80dc75483a271298a76a8d59.html>
 * Examples:
 * ```
 * api.uploadMedia('filepath', type, callback);
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
 * - `exports.uploadImage(filepath, callback);`
 * - `exports.uploadVoice(filepath, callback);`
 * - `exports.uploadVideo(filepath, callback);`
 * - `exports.uploadThumb(filepath, callback);`
 *
 * @param {String} filepath 文件路径
 * @param {String} type 媒体类型，可用值有image、voice、video、thumb
 * @param {Function} callback 回调函数
 */
exports.uploadMedia = function (filepath, type, callback) {
  this.preRequest(this._uploadMedia, arguments);
};

/*!
 * 上传多媒体文件的未封装版本
 */
exports._uploadMedia = function (filepath, type, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var url = that.endpoint + '/cgi-bin/media/upload?access_token=' + that.token.accessToken + '&type=' + type;
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    that.request(url, opts, wrapper(callback));
  });
};

/**
 * 流式新增临时素材，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 拓展自uploadMedia，实现上游上传的流数据重定向到微信服务器，省去自己服务器的文件缓存。
 * Examples:
 * ```
 * api.uploadMediaStream(req, type, callback);
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
 * - `exports.uploadImageStream(req, callback);`
 * - `exports.uploadVoiceStream(req, callback);`
 * - `exports.uploadVideoStream(req, callback);`
 * - `exports.uploadThumbStream(req, callback);`
 *
 * @param {String} req 上游Stream对象，必须包含headers属性；例如expressjs中request对象。
 * @param {String} type 媒体类型，可用值有image、voice、video、thumb
 * @param {Function} callback 回调函数
 */
exports.uploadMediaStream = function (req, type, callback) {
  this.preRequest(this._uploadMediaStream, arguments);
};

/*!
 * 流式上传多媒体文件的未封装版本
 */
exports._uploadMediaStream = function (req, type, callback) {
  var that = this;
  var url = that.endpoint + '/cgi-bin/media/upload?access_token=' + that.token.accessToken + '&type=' + type;
  var opts = {
    dataType: 'json',
    type: 'POST',
    timeout: 60000, // 60秒超时
    headers: req.headers,
    stream: req
  };
  delete opts.headers.host;
  that.request(url, opts, callback);
};

['image', 'voice', 'video', 'thumb'].forEach(function (type) {
  var method = 'upload' + type[0].toUpperCase() + type.substring(1);
  exports[method] = function (filepath, callback) {
    this.uploadMedia(filepath, type, callback);
  };
  exports[method+'Stream'] = function (req, callback) {
    this.uploadMediaStream(req, type, callback);
  };
});

/**
 * 获取临时素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/11/07b6b76a6b6e8848e855a435d5e34a5f.html>
 * Examples:
 * ```
 * api.getMedia('media_id', callback);
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
exports.getMedia = function (mediaId, callback) {
  this.preRequest(this._getMedia, arguments);
};

/*!
 * 获取临时素材的未封装版本
 */
exports._getMedia = function (mediaId, callback) {
  var url = this.endpoint + '/cgi-bin/media/get?access_token=' + this.token.accessToken + '&media_id=' + mediaId;
  var opts = {
    timeout: 60000 // 60秒超时
  };
  this.request(url, opts, wrapper(function (err, data, res) {
    // handle some err
    if (err) {
      return callback(err);
    }
    var contentType = res.headers['content-type'];
    if (contentType === 'application/json' || contentType === 'text/plain') {
      var ret;
      try {
        ret = JSON.parse(data);
        if (ret.errcode) {
          err = new Error(ret.errmsg);
          err.name = 'WeChatAPIError';
        }
      } catch (ex) {
        callback(ex, data, res);
        return;
      }
      return callback(err, ret, res);
    }
    // 输出Buffer对象
    callback(null, data, res);
  }));
};


/**
 * 上传图文消息内的图片获取URL
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.uploadImage('filepath');
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"url":  "http://mmbiz.qpic.cn/mmbiz/gLO17UPS6FS2xsypf378iaNhWacZ1G1UplZYWEYfwvuU6Ont96b1roYsCNFwaRrSaKTPCUdBK9DgEHicsKwWCBRQ/0"}
 * ```
 *
 * @param {String} filepath 图片文件路径
 * @param {Function} callback 回调函数
 */
exports.uploadImage = function (filepath, callback) {
  this.preRequest(this._uploadImage, arguments);
};

/*!
 * 上传图片未封装版本
 */
exports._uploadImage = function (filepath, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var url = that.endpoint + '/cgi-bin/media/uploadimg?access_token=' + that.token.accessToken;
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    that.request(url, opts, wrapper(callback));
  });
};

/**
 * 上传来自上游管道的图文消息内的图片，并获取URL。
 * 拓展于uploadImage，用于客户端直接上传文件管道重定向到微信服务器，不经过自身缓存服务器文件。
 * Examples:
 * ```
 * api.uploadImageStream(req, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"url":  "http://mmbiz.qpic.cn/mmbiz/gLO17UPS6FS2xsypf378iaNhWacZ1G1UplZYWEYfwvuU6Ont96b1roYsCNFwaRrSaKTPCUdBK9DgEHicsKwWCBRQ/0"}
 * ```
 *
 * @param {Object} req 上游Stream对象，必须包含headers属性；例如expressjs中request对象。
 * @param {Function} callback 回调函数
 */
exports.uploadImageStream = function (req, callback) {
  this.preRequest(this._uploadImageStream, arguments);
};

/*!
 * 上传来自上游管道的图文消息内的图片未封装版本
 */
exports._uploadImageStream = function (req, callback) {
  var that = this;
  var url = that.endpoint + '/cgi-bin/media/uploadimg?access_token=' + that.token.accessToken;
  var opts = {
    dataType: 'json',
    type: 'POST',
    timeout: 60000, // 60秒超时
    headers: req.headers,
    stream: req
  };
  delete opts.headers.host;
  that.request(url, opts, callback);
};
