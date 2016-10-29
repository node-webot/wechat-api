'use strict';

// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
var urllib = require('urllib');
var util = require('./util');
var extend = require('util')._extend;
var wrapper = util.wrapper;

var AccessToken = function (accessToken, expireTime) {
  if (!(this instanceof AccessToken)) {
    return new AccessToken(accessToken, expireTime);
  }
  this.accessToken = accessToken;
  this.expireTime = expireTime;
};

/*!
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
AccessToken.prototype.isValid = function () {
  return !!this.accessToken && (new Date().getTime()) < this.expireTime;
};

/**
 * 根据appid和appsecret创建API的构造函数
 * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
 * 使用策略如下：
 *
 * 1. 调用用户传入的获取token的异步方法，获得token之后使用
 * 2. 使用appid/appsecret获取token。并调用用户传入的保存token方法保存
 *
 * Tips:
 *
 * - 如果跨机器运行wechat模块，需要注意同步机器之间的系统时间。
 *
 * Examples:
 * ```
 * var API = require('wechat-api');
 * var api = new API('appid', 'secret');
 * ```
 * 以上即可满足单进程使用。
 * 当多进程时，token需要全局维护，以下为保存token的接口。
 * ```
 * var api = new API('appid', 'secret', function (callback) {
 *   // 传入一个获取全局token的方法
 *   fs.readFile('access_token.txt', 'utf8', function (err, txt) {
 *     if (err) {return callback(err);}
 *     callback(null, JSON.parse(txt));
 *   });
 * }, function (token, callback) {
 *   // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
 *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
 *   fs.writeFile('access_token.txt', JSON.stringify(token), callback);
 * });
 * ```
 * @param {String} appid 在公众平台上申请得到的appid
 * @param {String} appsecret 在公众平台上申请得到的app secret
 * @param {Function} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
 * @param {Function} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
 */
var API = function (appid, appsecret, getToken, saveToken) {
  this.appid = appid;
  this.appsecret = appsecret;
  this.getToken = getToken || function (callback) {
    callback(null, this.store);
  };
  this.saveToken = saveToken || function (token, callback) {
    this.store = token;
    if (process.env.NODE_ENV === 'production') {
      console.warn('Don\'t save token in memory, when cluster or multi-computer!');
    }
    callback(null);
  };
  this.endpoint = 'https://api.weixin.qq.com';
  this.mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
  this.fileServerPrefix = 'http://file.api.weixin.qq.com/cgi-bin/';
  this.defaults = {};
  // set default js ticket handle
  this.registerTicketHandle();
};

/**
 * 用于设置接入点
 *
 * - 通用域名(api.weixin.qq.com)，使用该域名将访问官方指定就近的接入点；
 * - 上海域名(sh.api.weixin.qq.com)，使用该域名将访问上海的接入点；
 * - 深圳域名(sz.api.weixin.qq.com)，使用该域名将访问深圳的接入点；
 * - 香港域名(hk.api.weixin.qq.com)，使用该域名将访问香港的接入点。
 *
 * Examples:
 * ```
 * api.setEndpoint('api.weixin.qq.com');
 * ```
 * @param {String} domain 域名，默认为api.weixin.qq.com
 */
API.prototype.setEndpoint = function (domain) {
  this.endpoint = 'https://' + domain;
};

/**
 * 用于设置urllib的默认options
 *
 * Examples:
 * ```
 * api.setOpts({timeout: 15000});
 * ```
 * @param {Object} opts 默认选项
 */
API.prototype.setOpts = function (opts) {
  this.defaults = opts;
};

/**
 * 设置urllib的hook
 *
 * Examples:
 * ```
 * api.setHook(function (options) {
 *   // options
 * });
 * ```
 * @param {Function} beforeRequest 需要封装的方法
 */
API.prototype.request = function (url, opts, callback) {
  var options = {};
  extend(options, this.defaults);
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  for (var key in opts) {
    if (key !== 'headers') {
      options[key] = opts[key];
    } else {
      if (opts.headers) {
        options.headers = options.headers || {};
        extend(options.headers, opts.headers);
      }
    }
  }
  urllib.request(url, options, callback);
};

/*!
 * 根据创建API时传入的appid和appsecret获取access token
 * 进行后续所有API调用时，需要先获取access token
 * 详细请看：<http://mp.weixin.qq.com/wiki/11/0e4b294685f817b95cbed85ba5e82b8f.html>
 *
 * 应用开发者无需直接调用本API。
 *
 * Examples:
 * ```
 * api.getAccessToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
 * ```
 * @param {Function} callback 回调函数
 */
API.prototype.getAccessToken = function (callback) {
  var that = this;
  var url = this.endpoint + '/cgi-bin/token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
  this.request(url, {dataType: 'json'}, wrapper(function (err, data) {
    if (err) {
      return callback(err);
    }
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    var token = AccessToken(data.access_token, expireTime);
    that.saveToken(token, function (err) {
      if (err) {
        return callback(err);
      }
      callback(err, token);
    });
  }));
  return this;
};

/*!
 * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
 * 无需依赖getAccessToken为前置调用。
 * 应用开发者无需直接调用此API。
 *
 * Examples:
 * ```
 * api.preRequest(method, arguments);
 * ```
 * @param {Function} method 需要封装的方法
 * @param {Array} args 方法需要的参数
 */
API.prototype.preRequest = function (method, args, retryed) {
  var that = this;
  var callback = args[args.length - 1];
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  that.getToken(function (err, token) {
    if (err) {
      return callback(err);
    }
    var accessToken;
    // 有token并且token有效直接调用
    if (token && (accessToken = AccessToken(token.accessToken, token.expireTime)).isValid()) {
      // 暂时保存token
      that.token = accessToken;
      if (!retryed) {
        var retryHandle = function (err, data, res) {
          // 40001 重试
          if (data && data.errcode && data.errcode === 40001) {
            return that.preRequest(method, args, true);
          }
          callback(err, data, res);
        };
        // 替换callback
        var newargs = Array.prototype.slice.call(args, 0, -1);
        newargs.push(retryHandle);
        method.apply(that, newargs);
      } else {
        method.apply(that, args);
      }
    } else {
      // 使用appid/appsecret获取token
      that.getAccessToken(function (err, token) {
        // 如遇错误，通过回调函数传出
        if (err) {
          return callback(err);
        }
        // 暂时保存token
        that.token = token;
        method.apply(that, args);
      });
    }
  });
};

/**
 * 获取最新的token
 *
 * Examples:
 * ```
 * api.getLatestToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `token`, 获取的token
 *
 * @param {Function} method 需要封装的方法
 * @param {Array} args 方法需要的参数
 */
API.prototype.getLatestToken = function (callback) {
  var that = this;
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  that.getToken(function (err, token) {
    if (err) {
      return callback(err);
    }
    var accessToken;
    // 有token并且token有效直接调用
    if (token && (accessToken = AccessToken(token.accessToken, token.expireTime)).isValid()) {
      return callback(null, accessToken);
    }
    // 使用appid/appsecret获取token
    that.getAccessToken(callback);
  });
};

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
  for (var key in obj) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: '+ key);
    }
    API.prototype[key] = obj[key];
  }
};

/**
 * 用于扩展API.
 * 作用是：当微信的官方 API 添加新功能，而wechat-api没有来得及升级时，用这个方法快速添加此功能。
 * 当 api 升级后应该用 API 内提供的方法。
 * Examples:
 * ```
 * // 为 API 添加一个 createQr 方法。
 * API.ext("createQr", "https://api.weixin.qq.com/card/qrcode/create");
 * ```
 * Usage:
 * ```
 * // 调用这个 createQr 方法。
 *  api.createQr({'card_id': ’dkjeuDfsfeu3242w3dnjlq23i'}, callback);
 * ```
 * @param {String} functionName 用户调用的方法名
 * @param {String} apiUrl 此 API 的 url 地址
 * @param {Bool} override 如果填写 true 则覆盖原来 api 已有的方法， false 或不传，则抛错。
 */
API.patch = function (functionName, apiUrl, override) {
  if (typeof apiUrl !== 'string') {
    throw new Error('The second argument expect a type of string as the request url of wechat');
  }

  if (typeof functionName !== 'string') {
    throw new Error('The first argument expect a type of string as the name of new function');
  }

  if (API.prototype[functionName] || API.prototype['_' + functionName] ) {
    if (override !== true) {
      throw new Error('wechat-api already has a prototype named ['+ functionName + '], use "true" as third param to override it or change your new function name.');
    } else {
      console.warn('wechat-api already has a prototype named ['+ functionName + '], will override the orignal one.');
    }
  }

  util.make(API.prototype, functionName, function (info, callback) {
    var hasMark = apiUrl.indexOf('?') >= 0;
    var url = apiUrl + (hasMark ? '&access_token=': '?access_token=') + this.token.accessToken;
    this.request(url, util.postJSON(info), wrapper(callback));
  });
};

API.AccessToken = AccessToken;

module.exports = API;
