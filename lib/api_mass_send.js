'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 上传多媒体文件，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.uploadNews(news, callback);
 * ```
 * News:
 * ```
 * {
 *  "articles": [
 *    {
 *      "thumb_media_id":"qI6_Ze_6PtV7svjolgs-rN6stStuHIjs9_DidOHaj0Q-mwvBelOXCFZiq2OsIU-p",
 *      "author":"xxx",
 *      "title":"Happy Day",
 *      "content_source_url":"www.qq.com",
 *      "content":"content",
 *      "digest":"digest",
 *      "show_cover_pic":"1"
 *   },
 *   {
 *      "thumb_media_id":"qI6_Ze_6PtV7svjolgs-rN6stStuHIjs9_DidOHaj0Q-mwvBelOXCFZiq2OsIU-p",
 *      "author":"xxx",
 *      "title":"Happy Day",
 *      "content_source_url":"www.qq.com",
 *      "content":"content",
 *      "digest":"digest",
 *      "show_cover_pic":"0"
 *   }
 *  ]
 * }
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "type":"news",
 *  "media_id":"CsEf3ldqkAYJAU6EJeIkStVDSvffUJ54vqbThMgplD-VJXXof6ctX5fI6-aYyUiQ",
 *  "created_at":1391857799
 * }
 * ```
 *
 * @param {Object} news 图文消息对象
 * @param {Function} callback 回调函数
 */
exports.uploadNews = function (news, callback) {
  this.preRequest(this._uploadNews, arguments);
};

/*!
 * 上传图文消息的未封装版本
 */
exports._uploadNews = function (news, callback) {
  // https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=ACCESS_TOKEN
  var url = this.endpoint + '/cgi-bin/media/uploadnews?access_token=' + this.token.accessToken;
  this.request(url, postJSON(news), wrapper(callback));
};

/**
 * 将通过上传下载多媒体文件得到的视频media_id变成视频素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.uploadMPVideo(opts, callback);
 * ```
 * Opts:
 * ```
 * {
 *  "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
 *  "title": "TITLE",
 *  "description": "Description"
 * }
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "type":"video",
 *  "media_id":"IhdaAQXuvJtGzwwc0abfXnzeezfO0NgPK6AQYShD8RQYMTtfzbLdBIQkQziv2XJc",
 *  "created_at":1391857799
 * }
 * ```
 *
 * @param {Object} opts 待上传为素材的视频
 * @param {Function} callback 回调函数
 */
exports.uploadMPVideo = function (opts, callback) {
  this.preRequest(this._uploadMPVideo, arguments);
};

/*!
 * 上传视频消息的未封装版本
 */
exports._uploadMPVideo = function (opts, callback) {
  // https://file.api.weixin.qq.com/cgi-bin/media/uploadvideo?access_token=ACCESS_TOKEN
  var url = this.fileServerPrefix + 'media/uploadvideo?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 群发消息，分别有图文（news）、文本(text)、语音（voice）、图片（image）和视频（video）
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSend(opts, receivers, callback);
 * ```
 * opts:
 * ```
 * {
 *  "image":{
 *    "media_id":"123dsdajkasd231jhksad"
 *  },
 *  "msgtype":"image"
 * }
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {Object} opts 待发送的数据
 * @param {String|Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSend = function (opts, receivers, callback) {
  this.preRequest(this._massSend, arguments);
};

/*!
 * 群发消息的未封装版本
 */
exports._massSend = function (opts, receivers, callback) {
  var url;
  if (Array.isArray(receivers)) {
    opts.touser = receivers;
    url = this.endpoint + '/cgi-bin/message/mass/send?access_token=' + this.token.accessToken;
  } else {
    if (typeof receivers === 'boolean') {
      opts.filter = {
        'is_to_all': receivers
      };
    } else {
      opts.filter = {
        'group_id': receivers
      };
    }
    url = this.endpoint + '/cgi-bin/message/mass/sendall?access_token=' + this.token.accessToken;
  }
  // https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=ACCESS_TOKEN
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 群发图文（news）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSendNews(mediaId, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 图文消息的media id
 * @param {String|Array|Boolean} receivers 接收人。一个组，或者openid列表, 或者true（群发给所有人）
 * @param {Function} callback 回调函数
 */
exports.massSendNews = function (mediaId, receivers, callback) {
  var opts = {
    'mpnews': {
      'media_id': mediaId
    },
    'msgtype': 'mpnews'
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发文字（text）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSendText(content, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} content 文字消息内容
 * @param {String|Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendText = function (content, receivers, callback) {
  var opts = {
    'text': {
      'content': content
    },
    'msgtype': 'text'
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发声音（voice）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSendVoice(media_id, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 声音media id
 * @param {String|Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendVoice = function (mediaId, receivers, callback) {
  var opts = {
    'voice': {
      'media_id': mediaId
    },
    'msgtype': 'voice'
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发图片（image）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSendImage(media_id, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 图片media id
 * @param {String|Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendImage = function (mediaId, receivers, callback) {
  var opts = {
    'image': {
      'media_id': mediaId
    },
    'msgtype': 'image'
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发视频（video）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSendVideo(mediaId, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 视频media id
 * @param {String|Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendVideo = function (mediaId, receivers, callback) {
  var opts = {
    'mpvideo': {
      'media_id': mediaId
    },
    'msgtype': 'mpvideo'
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发视频（video）消息，直接通过上传文件得到的media id进行群发（自动生成素材）
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.massSendMPVideo(data, receivers, callback);
 * ```
 * Data:
 * ```
 * {
 *  "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
 *  "title": "TITLE",
 *  "description": "Description"
 * }
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {Object} data 视频数据
 * @param {String|Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendMPVideo = function (data, receivers, callback) {
  var that = this;
  // 自动帮转视频的media_id
  this.uploadMPVideo(data, function (err, result) {
    if (err) {
      return callback(err);
    }
    that.massSendVideo(result.media_id, receivers, callback);
  });
};

/**
 * 删除群发消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.deleteMass(message_id, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"ok"
 * }
 * ```
 *
 * @param {String} messageId 待删除群发的消息id
 * @param {Function} callback 回调函数
 */
exports.deleteMass = function (messageId, callback) {
  this.preRequest(this._deleteMass, arguments);
};

exports._deleteMass = function (messageId, callback) {
  var opts = {
    msg_id: messageId
  };
  var url = this.endpoint + '/cgi-bin/message/mass/delete?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 预览接口，预览图文消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.previewNews(openid, mediaId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id": 34182
 * }
 * ```
 *
 * @param {String} openid 用户openid
 * @param {String} mediaId 图文消息mediaId
 * @param {Function} callback 回调函数
 */
exports.previewNews = function (openid, mediaId, callback) {
  this.preRequest(this._previewNews, arguments);
};

exports._previewNews = function (openid, mediaId, callback) {
  var opts = {
    'touser': openid,
    'mpnews': {
      'media_id': mediaId
    },
    'msgtype': 'mpnews'
  };
  var url = this.endpoint + '/cgi-bin/message/mass/preview?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 预览接口，预览文本消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.previewText(openid, content, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id": 34182
 * }
 * ```
 *
 * @param {String} openid 用户openid
 * @param {String} content 文本消息
 * @param {Function} callback 回调函数
 */
exports.previewText = function (openid, content, callback) {
  this.preRequest(this._previewText, arguments);
};

exports._previewText = function (openid, content, callback) {
  var opts = {
    'touser': openid,
    'text': {
      'content': content
    },
    'msgtype':'text'
  };
  var url = this.endpoint + '/cgi-bin/message/mass/preview?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 预览接口，预览语音消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.previewVoice(openid, mediaId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id": 34182
 * }
 * ```
 *
 * @param {String} openid 用户openid
 * @param {String} mediaId 语音mediaId
 * @param {Function} callback 回调函数
 */
exports.previewVoice = function (openid, mediaId, callback) {
  this.preRequest(this._previewVoice, arguments);
};

exports._previewVoice = function (openid, mediaId, callback) {
  var opts = {
    'touser': openid,
    'voice': {
      'media_id': mediaId
    },
    'msgtype': 'voice'
  };
  var url = this.endpoint + '/cgi-bin/message/mass/preview?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 预览接口，预览图片消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.previewImage(openid, mediaId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id": 34182
 * }
 * ```
 *
 * @param {String} openid 用户openid
 * @param {String} mediaId 图片mediaId
 * @param {Function} callback 回调函数
 */
exports.previewImage = function (openid, mediaId, callback) {
  this.preRequest(this._previewImage, arguments);
};

exports._previewImage = function (openid, mediaId, callback) {
  var opts = {
    'touser': openid,
    'image': {
      'media_id': mediaId
    },
    'msgtype': 'image'
  };
  var url = this.endpoint + '/cgi-bin/message/mass/preview?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 预览接口，预览视频消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.previewVideo(openid, mediaId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id": 34182
 * }
 * ```
 *
 * @param {String} openid 用户openid
 * @param {String} mediaId 视频mediaId
 * @param {Function} callback 回调函数
 */
exports.previewVideo = function (openid, mediaId, callback) {
  this.preRequest(this._previewVideo, arguments);
};

exports._previewVideo = function (openid, mediaId, callback) {
  var opts = {
    'touser': openid,
    'mpvideo': {
      'media_id': mediaId
    },
    'msgtype': 'mpvideo'
  };
  var url = this.endpoint + '/cgi-bin/message/mass/preview?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 查询群发消息状态
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.getMassMessageStatus(messageId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "msg_id":201053012,
 *  "msg_status":"SEND_SUCCESS"
 * }
 * ```
 *
 * @param {String} messageId 消息ID
 * @param {Function} callback 回调函数
 */
exports.getMassMessageStatus = function (messageId, callback) {
  this.preRequest(this._getMassMessageStatus, arguments);
};

exports._getMassMessageStatus = function (messageId, callback) {
  var opts = {
    'msg_id': messageId
  };
  var url = this.endpoint + '/cgi-bin/message/mass/get?access_token=' + this.token.accessToken;
  this.request(url, postJSON(opts), wrapper(callback));
};
