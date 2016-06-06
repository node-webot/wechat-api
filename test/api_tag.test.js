var expect = require('expect.js');
var config = require('./config');
var API = require('../');
var puling = 'oNeQKj7AquX1pADyghgvLmLTqIgQ';
var tagName = 'test_tag_name_v1';
var tagId = 103;

describe('api_tag.js', function () {
  var api = new API(config.appid, config.appsecret);
  before(function (done) {
    api.getAccessToken(done);
  });

  // 1 创建标签
  it('createTag should ok', function (done) {
    api.createTag(tagName, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('tag');
      done();
    });
  });

  // 2 获取公众号的所有标签
  it('getTags should ok', function (done) {
    api.getTags(function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('tags');
      expect(data.tags).to.be.an('array');
      done();
    });
  });

  // 3 编辑标签
  it('editTag should ok', function (done) {
    api.editTag(tagId, tagName + '1', function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errcode', 0);
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });

  // 4 删除标签
//  it('deleteTag should ok', function (done) {
//    api.deleteTag(103, function (err, data, res) {
//      expect(err).not.to.be.ok();
//      expect(data).to.have.property('errcode', 0);
//      expect(data).to.have.property('errmsg', 'ok');
//      done();
//    });
//  });


  // 6 批量为用户打标签 
  it('membersBatchtagging should ok', function (done) {
    api.membersBatchtagging(tagId, [puling], function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errcode', 0);
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });
 
  // 5 获取标签的所有粉丝
  it('getTagUsers should ok', function (done) {
    api.getTagUsers(tagId, '', function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('data');
      expect(data.data.openid).to.be.an('array');
      done();
    });
  });
 
  // 7 批量为用户取消标签 
  it('membersBatchuntagging should ok', function (done) {
    api.membersBatchuntagging(tagId, [puling], function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errcode', 0);
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });
 
  // 8 获取用户身上的标签列表 
  it('getUserTags should ok', function (done) {
    api.getUserTags(puling, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('tagid_list');
      expect(data.tagid_list).to.be.an('array');
      done();
    });
  });

});
