'use strict';

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 客服消息，发送文字消息
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendText('openid', 'Hello world', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} text 发送的消息内容
 * @param {Function} callback 回调函数
 */
exports.sendText = function (openid, text, callback) {
  this.preRequest(this._sendText, arguments);
};

/**
 * 客服消息，发送文字消息，带客服账号
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {String} text 发送的消息内容
 * @param {Function} callback 回调函数
 */
exports.sendTextFromCs = function (openid, cs_account, text, callback) {
  this.preRequest(this._sendTextFromCs, arguments);
};


/*!
 * 客服消息，带客服账号，发送文字消息的未封装版本
 */
exports._sendTextFromCs = function (openid, cs_account, text, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"text",
  //  "text": {
  //    "content":"Hello World"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype': 'text',
    'text': {
      'content': text
    },
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 客服消息，发送文字消息的未封装版本
 */
exports._sendText = function (openid, text, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"text",
  //  "text": {
  //    "content":"Hello World"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype': 'text',
    'text': {
      'content': text
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送图片消息
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendImage('openid', 'media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID，参见uploadMedia方法
 * @param {Function} callback 回调函数
 */
exports.sendImage = function (openid, mediaId, callback) {
  this.preRequest(this._sendImage, arguments);
};

/*!
 * 客服消息，发送图片消息的未封装版本
 */
exports._sendImage = function (openid, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"image",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'image',
    'image': {
      'media_id': mediaId
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送图片消息，带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendImage('openid', 'media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {String} mediaId 媒体文件的ID，参见uploadMedia方法
 * @param {Function} callback 回调函数
 */
exports.sendImageFromCs = function (openid,cs_account, mediaId, callback) {
  this.preRequest(this._sendImageFromCs, arguments);
};

/*!
 * 客服消息，发送图片消息的未封装版本
 */
exports._sendImageFromCs = function (openid,cs_account, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"image",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'image',
    'image': {
      'media_id': mediaId
    },
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送语音消息
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendVoice('openid', 'media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID
 * @param {Function} callback 回调函数
 */
exports.sendVoice = function (openid, mediaId, callback) {
  this.preRequest(this._sendVoice, arguments);
};

/*!
 * 客服消息，发送语音消息的未封装版本
 */
exports._sendVoice = function (openid, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"voice",
  //  "voice": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype': 'voice',
    'voice': {
      'media_id': mediaId
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送语音消息，带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendVoice('openid', 'media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {String} mediaId 媒体文件的ID
 * @param {Function} callback 回调函数
 */
exports.sendVoiceFromCs = function (openid,cs_account, mediaId, callback) {
  this.preRequest(this._sendVoiceFromCs, arguments);
};

/*!
 * 客服消息，发送语音消息的未封装版本
 */
exports._sendVoiceFromCs = function (openid,cs_account, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"voice",
  //  "voice": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype': 'voice',
    'voice': {
      'media_id': mediaId
    },
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送视频消息
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendVideo('openid', 'media_id', 'thumb_media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID
 * @param {String} thumbMediaId 缩略图文件的ID
 * @param {Function} callback 回调函数
 */
exports.sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  this.preRequest(this._sendVideo, arguments);
};

/*!
 * 客服消息，发送视频消息的未封装版本
 */
exports._sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"video",
  //  "video": {
  //    "media_id":"MEDIA_ID"
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'video',
    'video': {
      'media_id': mediaId,
      'thumb_media_id': thumbMediaId
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送视频消息，带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendVideo('openid', 'media_id', 'thumb_media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {String} mediaId 媒体文件的ID
 * @param {String} thumbMediaId 缩略图文件的ID
 * @param {Function} callback 回调函数
 */
exports.sendVideoFromCs = function (openid,cs_account, mediaId, thumbMediaId, callback) {
  this.preRequest(this._sendVideoFromCs, arguments);
};

/*!
 * 客服消息，发送视频消息的未封装版本
 */
exports._sendVideoFromCs = function (openid,cs_account, mediaId, thumbMediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"video",
  //  "video": {
  //    "media_id":"MEDIA_ID"
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'video',
    'video': {
      'media_id': mediaId,
      'thumb_media_id': thumbMediaId
    },
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送音乐消息
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * var music = {
 *  title: '音乐标题', // 可选
 *  description: '描述内容', // 可选
 *  musicurl: 'http://url.cn/xxx', 音乐文件地址
 *  hqmusicurl: "HQ_MUSIC_URL",
 *  thumb_media_id: "THUMB_MEDIA_ID"
 * };
 * api.sendMusic('openid', music, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {Object} music 音乐文件
 * @param {Function} callback 回调函数
 */
exports.sendMusic = function (openid, music, callback) {
  this.preRequest(this._sendMusic, arguments);
};

/*!
 * 客服消息，发送音乐消息的未封装版本
 */
exports._sendMusic = function (openid, music, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"music",
  //  "music": {
  //    "title":"MUSIC_TITLE", // 可选
  //    "description":"MUSIC_DESCRIPTION", // 可选
  //    "musicurl":"MUSIC_URL",
  //    "hqmusicurl":"HQ_MUSIC_URL",
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'music',
    'music': music
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送音乐消息，带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * var music = {
 *  title: '音乐标题', // 可选
 *  description: '描述内容', // 可选
 *  musicurl: 'http://url.cn/xxx', 音乐文件地址
 *  hqmusicurl: "HQ_MUSIC_URL",
 *  thumb_media_id: "THUMB_MEDIA_ID"
 * };
 * api.sendMusic('openid', music, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {Object} music 音乐文件
 * @param {Function} callback 回调函数
 */
exports.sendMusicFromCs = function (openid,cs_account, music, callback) {
  this.preRequest(this._sendMusicFromCs, arguments);
};

/*!
 * 客服消息，发送音乐消息的未封装版本
 */
exports._sendMusicFromCs = function (openid,cs_account, music, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"music",
  //  "music": {
  //    "title":"MUSIC_TITLE", // 可选
  //    "description":"MUSIC_DESCRIPTION", // 可选
  //    "musicurl":"MUSIC_URL",
  //    "hqmusicurl":"HQ_MUSIC_URL",
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'music',
    'music': music,
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送图文消息（点击跳转到外链）
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * var articles = [
 *  {
 *    "title":"Happy Day",
 *    "description":"Is Really A Happy Day",
 *    "url":"URL",
 *    "picurl":"PIC_URL"
 *  },
 *  {
 *    "title":"Happy Day",
 *    "description":"Is Really A Happy Day",
 *    "url":"URL",
 *    "picurl":"PIC_URL"
 *  }];
 * api.sendNews('openid', articles, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {Array} articles 图文列表
 * @param {Function} callback 回调函数
 */
exports.sendNews = function (openid, articles, callback) {
  this.preRequest(this._sendNews, arguments);
};

/*!
 * 客服消息，发送图文消息（点击跳转到外链）的未封装版本
 */
exports._sendNews = function (openid, articles, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"news",
  //  "news":{
  //    "articles": [
  //      {
  //        "title":"Happy Day",
  //        "description":"Is Really A Happy Day",
  //        "url":"URL",
  //        "picurl":"PIC_URL"
  //      },
  //      {
  //        "title":"Happy Day",
  //        "description":"Is Really A Happy Day",
  //        "url":"URL",
  //        "picurl":"PIC_URL"
  //      }]
  //   }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'news',
    'news': {
      'articles': articles
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送图文消息（点击跳转到外链），带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * var articles = [
 *  {
 *    "title":"Happy Day",
 *    "description":"Is Really A Happy Day",
 *    "url":"URL",
 *    "picurl":"PIC_URL"
 *  },
 *  {
 *    "title":"Happy Day",
 *    "description":"Is Really A Happy Day",
 *    "url":"URL",
 *    "picurl":"PIC_URL"
 *  }];
 * api.sendNews('openid', articles, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {Array} articles 图文列表
 * @param {Function} callback 回调函数
 */
exports.sendNewsFromCs = function (openid,cs_account, articles, callback) {
  this.preRequest(this._sendNewsFromCs, arguments);
};

/*!
 * 客服消息，发送图文消息（点击跳转到外链）的未封装版本
 */
exports._sendNewsFromCs = function (openid,cs_account, articles, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"news",
  //  "news":{
  //    "articles": [
  //      {
  //        "title":"Happy Day",
  //        "description":"Is Really A Happy Day",
  //        "url":"URL",
  //        "picurl":"PIC_URL"
  //      },
  //      {
  //        "title":"Happy Day",
  //        "description":"Is Really A Happy Day",
  //        "url":"URL",
  //        "picurl":"PIC_URL"
  //      }]
  //   }
  // }
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'news',
    'news': {
      'articles': articles
    },
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送图文消息（点击跳转到图文消息页面）
 * 详细细节 http://mp.weixin.qq.com/wiki/14/d9be34fe03412c92517da10a5980e7ee.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendMpNews('openid', 'mediaId' , callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 图文消息的id
 * @param {Function} callback 回调函数
 */
exports.sendMpNews = function (openid, mediaId, callback) {
  this.preRequest(this._sendMpNews, arguments);
};

/*!
 * 客服消息，发送图文消息（点击跳转到图文消息页面） 的未封装版本
 */
exports._sendMpNews = function (openid, mediaId, callback) {
   //{
   // "touser":"OPENID",
   // "msgtype":"mpnews",
   // "mpnews":
   //  {
   //     "media_id":"MEDIA_ID"
   //  }
   //}
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'mpnews',
    'mpnews': {
      'media_id': mediaId
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送图文消息（点击跳转到图文消息页面），带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/14/d9be34fe03412c92517da10a5980e7ee.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendMpNews('openid', 'mediaId' , callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {String} mediaId 图文消息的id
 * @param {Function} callback 回调函数
 */
exports.sendMpNewsFromCs = function (openid,cs_account, mediaId, callback) {
  this.preRequest(this._sendMpNewsFromCs, arguments);
};

/*!
 * 客服消息，发送图文消息（点击跳转到图文消息页面） 的未封装版本
 */
exports._sendMpNewsFromCs = function (openid,cs_account, mediaId, callback) {
  //{
  // "touser":"OPENID",
  // "msgtype":"mpnews",
  // "mpnews":
  //  {
  //     "media_id":"MEDIA_ID"
  //  }
  //}
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    'touser': openid,
    'msgtype':'mpnews',
    'mpnews': {
      'media_id': mediaId
    },
    'customservice':{
      'kf_account': cs_account
    }
  };
  this.request(url, postJSON(data), wrapper(callback));
};


/**
 * 客服消息，发送卡卷消息
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendCard('openid', 'card', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {Object} wxcard 卡卷相关信息
 * @param {Function} callback 回调函数
 */
exports.sendCard = function (openid, card, callback) {
  this.preRequest(this._sendCard, arguments);
};

/*!
 * 客服消息，发送卡卷消息的未封装版本
 */
exports._sendCard = function (openid, card, callback) {
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var that = this;
  this.getCardExt(card, function (err, result) {
    var data = {
      'touser': openid,
      'msgtype':'wxcard',
      'wxcard': {
        'card_id': card.card_id,
        'card_ext': result
      }
    };
    that.request(url, postJSON(data), wrapper(callback));
  });
};


/**
 * 客服消息，发送卡卷消息，带客服账号
 * 详细细节 http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html#.E5.AE.A2.E6.9C.8D.E6.8E.A5.E5.8F.A3-.E5.8F.91.E6.B6.88.E6.81.AF
 * Examples:
 * ```
 * api.sendCard('openid', 'card', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} cs_account 客服账号
 * @param {Object} card 卡卷相关信息
 * @param {Function} callback 回调函数
 */
exports.sendCardFromCs = function (openid,cs_account, card, callback) {
  this.preRequest(this._sendCardFromCs, arguments);
};

/*!
 * 客服消息，发送卡卷消息的未封装版本
 */
exports._sendCardFromCs = function (openid,cs_account, card, callback) {
  var url = this.endpoint + '/cgi-bin/message/custom/send?access_token=' + this.token.accessToken;
  var that = this;
  this.getCardExt(card, function (err, result) {
    var data = {
      'touser': openid,
      'msgtype':'wxcard',
      'wxcard': {
        'card_id': card.card_id,
        'card_ext': result
      },
      'customservice':{
        'kf_account': cs_account
      }
    };
    that.request(url, postJSON(data), wrapper(callback));
  });
};
