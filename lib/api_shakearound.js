var path = require('path');
var fs = require('fs');
var sys_util = require('util');
var formstream = require('formstream');

var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;

//设备 beacons
//详情请参见：http://mp.weixin.qq.com/wiki/15/b9e012f917e3484b7ed02771156411f3.html

make(exports, 'applyBeacons', function(data, callback){
  var url = 'https://api.weixin.qq.com/shakearound/device/applyid?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updateBeacon', function(device_identifier, comment, callback) {
  var data = {
    device_identifier: device_identifier,
    comment: comment
  };
  var url = 'https://api.weixin.qq.com/shakearound/device/update?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'bindBeaconLocation', function(device_identifier, poi_id, callback){
  var data = {
    device_identifier: device_identifier,
    comment: comment
  };
  var url = 'https://api.weixin.qq.com/shakearound/device/bindlocation?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getBeacons', function (device_identifiers, apply_id, begin, count, callback) {
  var data = {};
  if(device_identifiers instanceof Array && device_identifiers.length > 0) {
    data = {device_identifiers: device_identifiers};
  }
  if(begin !== undefined && count !== undefined) {
    data = {
      begin: begin,
      count: count
    };

    if(apply_id !== undefined) {
      data.apply_id = apply_id;
    }
  }  

  var url = 'https://api.weixin.qq.com/shakearound/device/search?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

//页面 pages
//详情请参见：http://mp.weixin.qq.com/wiki/5/6626199ea8757c752046d8e46cf13251.html

make(exports, 'createPage', function (page, callback) {
  var data = page;  
  var url = 'https://api.weixin.qq.com/shakearound/page/add?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'updatePage', function (page, callback) {
  var data = page;
  var url = 'https://api.weixin.qq.com/shakearound/page/update?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'deletePages', function (page_ids, callback) {
  var data = {page_ids: page_ids};
  var url = 'https://api.weixin.qq.com/shakearound/page/delete?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

make(exports, 'getPages', function (page_ids, begin, count, callback) {
  var data = {};
  if(page_ids instanceof Array && page_ids.length > 0) {
    data = {page_ids: page_ids};
  }
  if(begin !== undefined && count !== undefined) {
    data = {
      begin: begin,
      count: count
    };
  }
  console.log('request body', data);

  var url = 'https://api.weixin.qq.com/shakearound/page/search?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

//上传图片素材
//详情请参见：http://mp.weixin.qq.com/wiki/5/e997428269ff189d8f9a4b9e177be2d9.html

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

//配置设备与页面的关联关系
//详情请参见：http://mp.weixin.qq.com/wiki/12/c8120214ec0ba08af5dfcc0da1a11400.html

make(exports, 'bindBeaconWithPages', function(device_identifier, page_ids, bind, append, callback) {
  var data = {
    device_identifier: device_identifier,
    page_ids: page_ids,
    bind: bind,
    append: append
  };

  var url = 'https://api.weixin.qq.com/shakearound/device/bindpage?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

//获取摇周边的设备及用户信息
//详情请参见：http://mp.weixin.qq.com/wiki/3/34904a5db3d0ec7bb5306335b8da1faf.html

make(exports, 'getShakeInfo', function(ticket, callback) {
  var data = {
    ticket: ticket
  };

  var url = 'https://api.weixin.qq.com/shakearound/user/getshakeinfo?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

//以设备为维度的数据统计接口
//详情请参见：http://mp.weixin.qq.com/wiki/0/8a24bcacad40fe7ee98d1573cb8a6764.html

make(exports, 'getDeviceStatistics', function(device_identifier, begin_date, end_date, callback) {
  var data = {
    device_identifier: device_identifier,
    begin_date: begin_date,
    end_date: end_date
  };

  var url = 'https://api.weixin.qq.com/shakearound/statistics/device?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});

//以页面为维度的数据统计接口
//详情请参见：http://mp.weixin.qq.com/wiki/0/8a24bcacad40fe7ee98d1573cb8a6764.html

make(exports, 'getPageStatistics', function(page_id, begin_date, end_date, callback) {
  var data = {
    page_id: page_id,
    begin_date: begin_date,
    end_date: end_date
  };

  var url = 'https://api.weixin.qq.com/shakearound/statistics/page?access_token=' + this.token.accessToken;
  this.request(url, postJSON(data), wrapper(callback));
});


