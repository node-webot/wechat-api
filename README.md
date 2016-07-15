Open Wechat API
===========
开放平台版微信公众号API。该模块修改自[wechat-api](https://github.com/node-webot/wechat-api)，用于微信第三方平台调用
微信相关接口。该模块需配合[wechat-auth](https://github.com/markaii/wechat-auth)使用

## 模块状态
- [![Build Status](https://travis-ci.org/node-webot/wechat-api.png?branch=master)](https://travis-ci.org/node-webot/wechat-api)
- [![Dependencies Status](https://david-dm.org/node-webot/wechat-api.png)](https://david-dm.org/node-webot/wechat-api)

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

注意：common部分的api实例创建参见下文

## Installation

```sh
$ git clone https://github.com/markaii/open-wechat-api
```

## Usage

创建api实例，和[wechat-api](https://github.com/node-webot/wechat-api)不同的是，
access_token不再是通过appid和appsecret获取的，而是平台通过[wechat-auth](https://github.com/markaii/wechat-auth)获取的，
因此创建api实例时，将外部获取到的access_token传入构造函数创建实例。

注意：所有的接口调用和[wechat-api](https://github.com/node-webot/wechat-api)相同。

```js
var WechatAPI = require('open-wechat-api');

var api = new WechatAPI(appid, access_token); // access_token = { authorizer_access_token: "xxx", expires_at: "xxx"}
api.updateRemark('open_id', 'remarked', function (err, data, res) {
  // TODO
});
```

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
 repo age : 12 months
 active   : 61 days
 commits  : 141
 files    : 69
 authors  :
    99  Jackson Tian  70.2%
     9  tedyyu        6.4%
     5  Guan Bo       3.5%
     4  shuhankuang   2.8%
     4  Lou            Lin   2.8%
     3  minxianlong   2.1%
     2  xuming314     1.4%
     2  Colt Xie      1.4%
     1  liuxiaodong   0.7%
     1  looping       0.7%
     1  wuxq          0.7%
     1  wxhuang       0.7%
     1  xumian.wei    0.7%
     1  yelo          0.7%
     1  Ezios         0.7%
     1  Lin@Cloud+    0.7%
     1  Qun Lin       0.7%
     1  Will          0.7%
     1  brucewar      0.7%
     1  dan           0.7%
     1  ifeiteng      0.7%

```

## 捐赠
如果您觉得Wechat对您有帮助，欢迎请作者一杯咖啡

![捐赠wechat](https://cloud.githubusercontent.com/assets/327019/2941591/2b9e5e58-d9a7-11e3-9e80-c25aba0a48a1.png)

或者[![](http://img.shields.io/gratipay/JacksonTian.svg)](https://www.gittip.com/JacksonTian/)
