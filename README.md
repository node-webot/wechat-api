Wechat API
===========
微信公共平台API。

## 模块状态
- [![NPM version](https://badge.fury.io/js/wechat-api.png)](http://badge.fury.io/js/wechat)
- [![Build Status](https://travis-ci.org/node-webot/wechat-api.png?branch=master)](https://travis-ci.org/node-webot/wechat-api)
- [![Dependencies Status](https://david-dm.org/node-webot/wechat-api.png)](https://david-dm.org/node-webot/wechat-api)
- [![Coverage Status](https://coveralls.io/repos/node-webot/wechat-api/badge.png)](https://coveralls.io/r/node-webot/wechat-api)

## 功能列表
- 发送客服消息（文本、图片、语音、视频、音乐、图文）
- 菜单操作（查询、创建、删除）
- 二维码（创建临时、永久二维码，查看二维码URL）
- 分组操作（查询、创建、修改、移动用户到分组）
- 用户信息（查询用户基本信息、获取关注者列表）
- 媒体文件（上传、获取）
- 群发消息（文本、图片、语音、视频、图文）
- 客服记录（查询客服记录，查看客服、查看在线客服）
- 群发消息
- 公众号支付（发货通知、订单查询）
- 微信小店（商品管理、库存管理、邮费模板管理、分组管理、货架管理、订单管理、功能接口）
- 模版消息
- 网址缩短
- 语义查询
- 数据分析
- JSSDK服务端支持
- 素材管理
- 摇一摇周边

详细参见[API文档](http://doxmate.cool/node-webot/wechat-api/api.html)

企业版本请前往：<https://github.com/node-webot/wechat-enterprise>

## Installation

```sh
$ npm install wechat-api
```

## Usage

```js
var WechatAPI = require('wechat-api');

var api = new WechatAPI(appid, appsecret);
api.updateRemark('open_id', 'remarked', function (err, data, res) {
  // TODO
});
```

### patch()扩展

当微信官方文档已更新，但本库未来得及更新，而又想用新的微信 api 时，可调用 patch 方法来扩展新功能。
```js
var WechatAPI = require('wechat-api');
var api = new WechatAPI(appid, appsecret);

// 扩展新api : updateInfo
// 第一个参数为扩展的新方法名，第二个参数为此 api 调用的微信的 apiurl 地址，会自动加上 token
WechatAPI.patch("updateInfo", "https://api.weixin.qq.com/card/membercard/updateuser");


// 调用刚扩展的方法，与其它 api 接口方法一样。
api.updateInfo(jsonInfo, function (err, data, res) {
  // TODO
});
```
#### 覆盖已有的接口
当要扩展的新接口名称已在 API 内定义，会抛出异常：
`wechat-api already has a prototype named [uploadLogo]`
如果知道这个异常的含义且依然想定义这个接口名称，应该给第三个参数传入`true`:
```js
WechatAPI.patch("uploadLogo", "https://api.weixin.qq.com/card/membercard/updateuser", true);
```
执行后控制台会输出警告，并覆盖原来`uploadLogo`这个接口。

> **提示** 当有新的微信接口开放或发现有用但 wechat-api 尚未加入开发的接口时，请在本库中相应的 js 文件中增加对新接口定义并提交 PullRequest 以便大家都能使用这个新接口。如果没有开发能力，请提交 issue. 

> **警告** 这个覆盖不只会覆盖 api 中的微信接口，所有定义给 api 的方法/成员变量 等都有可能被覆盖，请谨慎请用

### 多进程
当多进程时，token需要全局维护，以下为保存token的接口。
```
var WechatAPI = require('wechat-api');
var api = new WechatAPI('appid', 'secret', function (callback) {
  // 传入一个获取全局token的方法
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    if (err) {return callback(err);}
    callback(null, JSON.parse(txt));
  });
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});
```

## Show cases
### Node.js API自动回复

![Node.js API自动回复机器人](http://nodeapi.diveintonode.org/assets/qrcode.jpg)

欢迎关注。

代码：<https://github.com/JacksonTian/api-doc-service>

你可以在[CloudFoundry](http://www.cloudfoundry.com/)、[appfog](https://www.appfog.com/)、[BAE](http://developer.baidu.com/wiki/index.php?title=docs/cplat/rt/node.js)等搭建自己的机器人。

## 详细API
原始API文档请参见：[消息接口指南](http://mp.weixin.qq.com/wiki/index.php?title=消息接口指南)。


## License
The MIT license.

## 交流群
QQ群：157964097，使用疑问，开发，贡献代码请加群。

## 感谢
感谢以下贡献者：

```

 project  : wechat-api
 repo age : 1 year, 9 months
 active   : 97 days
 commits  : 211
 files    : 72
 authors  :
   136  Jackson Tian       64.5%
    10  tedyyu             4.7%
     9  greenkeeperio-bot  4.3%
     7  Limjoe             3.3%
     6  Guan Bo            2.8%
     5  SunLn              2.4%
     4  shuhankuang        1.9%
     4  Lou                 Lin   1.9%
     3  minxianlong        1.4%
     2  Colt Xie           0.9%
     2  xuming314          0.9%
     1  brucewar           0.5%
     1  dan                0.5%
     1  ifeiteng           0.5%
     1  kai_hao            0.5%
     1  liuxiaodong        0.5%
     1  looping            0.5%
     1  simonyan           0.5%
     1  wuxq               0.5%
     1  wxhuang            0.5%
     1  xumian.wei         0.5%
     1  yelo               0.5%
     1  BeeSui             0.5%
     1  yuyuan             0.5%
     1  Eric               0.5%
     1  Ezios              0.5%
     1  JaydanHuang        0.5%
     1  Lin@Cloud+         0.5%
     1  Monson Shao        0.5%
     1  Qun Lin            0.5%
     1  Silver Lao         0.5%
     1  Table              0.5%
     1  Wang Yitong        0.5%
     1  Will               0.5%

```

## 捐赠
如果您觉得Wechat对您有帮助，欢迎请作者一杯咖啡

![捐赠wechat](https://cloud.githubusercontent.com/assets/327019/2941591/2b9e5e58-d9a7-11e3-9e80-c25aba0a48a1.png)

或者[![](http://img.shields.io/gratipay/JacksonTian.svg)](https://www.gittip.com/JacksonTian/)
