var host = 'https://5pa2v70w.qcloud.la';

module.exports = {
  UserInfo: host + '/weapp/user_info',
  WechatLogin: host + '/weapp/login_wechat',
  LocalLogin: host + '/weapp/login_local',
  LocalRegister: host + '/weapp/register_local',

  QueAdd: host + '/weapp/qa/q/add',
  QueDetail: host + '/weapp/qa/q',
  QueLike: host + '/weapp/qa/q/like',

  AnsDetail: host + '/weapp/qa/a',
  hotAnsList: host + '/weapp/qa/hotAnsList',
  AnsLike: host + '/weapp/qa/a/like',
  AnsAddWithImage: host + '/weapp/qa/a/addWithImage',
  AnsAddWithoutImage: host + '/weapp/qa/a/addWithoutImage',

  CommentAdd: host + '/weapp/qa/c/add',
  CommentList: host + '/weapp/qa/c/list',

}
