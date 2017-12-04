var host = 'https://5pa2v70w.qcloud.la';

module.exports = {
  Translate: host + '/weapp/translate',

  UserInfo: host + '/weapp/user_info',
  WechatLogin: host + '/weapp/login_wechat',
  LocalLogin: host + '/weapp/login_local',
  LocalRegister: host + '/weapp/register_local',
  LocalChangePassword: host + '/weapp/change_pwd_local',
  CommentToMe: host + '/weapp/account/comment/tome',
  MyComment: host + '/weapp/account/comment/my',

  QueAdd: host + '/weapp/qa/q/add',
  QueDetail: host + '/weapp/qa/q',
  QueList: host + '/weapp/qa/q/list',
  QueLike: host + '/weapp/qa/q/like',
  QueLikeList: host + '/weapp/qa/q/likelist',

  AnsDetail: host + '/weapp/qa/a',
  AnsLike: host + '/weapp/qa/a/like',
  AnsLikeList: host + '/weapp/qa/a/likelist',
  AnsPreAddWithImage: host + '/weapp/qa/a/preAddWithImage',
  AnsAddWithImage: host + '/weapp/qa/a/addWithImage',
  AnsAddWithoutImage: host + '/weapp/qa/a/addWithoutImage',

  CommentAdd: host + '/weapp/qa/c/add',
  CommentList: host + '/weapp/qa/c/list',

  TopicDetail: host + '/weapp/forum/topic',
  TopicLike: host + '/weapp/forum/topic/like',
  TopicDisLike: host + '/weapp/forum/topic/dislike',
  TopicLikeList: host + '/weapp/forum/topic/likelist',
  TopicList: host + '/weapp/forum/topic/list',
  TopicPreAddWithImage: host + '/weapp/forum/topic/preAddWithImage',
  TopicAddWithImage: host + '/weapp/forum/topic/addWithImage',
  TopicAddWithoutImage: host + '/weapp/forum/topic/addWithoutImage',

  BackList: host + '/weapp/forum/back/list',
  BackAddd: host + '/weapp/forum/back/add',

  ArticleDetail: host + '/weapp/kit/article',
  ArticleList: host + '/weapp/kit/article/list/',
  ArticleLike: host + '/weapp/kit/article/like',
}
