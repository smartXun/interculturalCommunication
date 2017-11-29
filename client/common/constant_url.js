var host = 'https://5pa2v70w.qcloud.la';

module.exports = {
  UserInfo: host + '/weapp/user_info',
  WechatLogin: host + '/weapp/login_wechat',
  LocalLogin: host + '/weapp/login_local',
  LocalRegister: host + '/weapp/register_local',

  QueAdd: host + '/weapp/qa/q/add',
  QueDetail: host + '/weapp/qa/q',
  QueList: host + '/weapp/qa/q/list',
  QueLike: host + '/weapp/qa/q/like',
  QueLikeList: host + '/weapp/qa/q/likelist',

  AnsDetail: host + '/weapp/qa/a',
  AnsLike: host + '/weapp/qa/a/like',
  AnsPreAddWithImage: host + '/weapp/qa/a/preAddWithImage',
  AnsAddWithImage: host + '/weapp/qa/a/addWithImage',
  AnsAddWithoutImage: host + '/weapp/qa/a/addWithoutImage',

  CommentAdd: host + '/weapp/qa/c/add',
  CommentList: host + '/weapp/qa/c/list',

  TopicDetail: host + '/weapp/forum/topic',
  TopicLike: host + '/weapp/forum/topic/like',
  TopicDisLike: host + '/weapp/forum/topic/dislike',
  TopicList: host + '/weapp/forum/topic/list',
  TopicPreAddWithImage: host + '/weapp/forum/topic/preAddWithImage',
  TopicAddWithImage: host + '/weapp/forum/topic/addWithImage',
  TopicAddWithoutImage: host + '/weapp/forum/topic/addWithoutImage',

  BackList: host + '/weapp/forum/back/list',
  BackAddd: host + '/weapp/forum/back/add',
}
