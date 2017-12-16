var host = 'https://5pa2v70w.qcloud.la';
// var host = 'https://486236730.iegcrossculture.club';

module.exports = {
  Translate: host + '/weapp/translate',

  WechatLogin: host + '/weapp/login_wechat',
  LocalLogin: host + '/weapp/login_local',
  LocalRegister: host + '/weapp/register_local',
  LocalChangePassword: host + '/weapp/change_pwd_local',

  UserInfo: host + '/weapp/account/info',
  CommentToMe: host + '/weapp/account/comment/tome',
  MyComment: host + '/weapp/account/comment/my',
  MyPostList: host + '/weapp/account/post/list',
  MyPostDelete: host + '/weapp/account/post/delete',

  QueAdd: host + '/weapp/qa/q/add',
  QueAddWidthImage: host + '/weapp/qa/q/addWithImage',
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
  BackAdd: host + '/weapp/forum/back/add',
  BackLike: host + '/weapp/forum/back/like',
  BackDisLike: host + '/weapp/forum/back/dislike',
  BackLikeList: host + '/weapp/forum/back/likelist',
  ReplyAdd: host + '/weapp/forum/reply/add',
  ReplyLike: host + '/weapp/forum/reply/like',
  ReplyDisLike: host + '/weapp/forum/reply/dislike',
  ReplyLikeList: host + '/weapp/forum/reply/likelist',

  ArticleDetail: host + '/weapp/kit/article',
  ArticleList: host + '/weapp/kit/article/list/',
  ArticleLike: host + '/weapp/kit/article/like',

  ArticleBackAdd: host + '/weapp/kit/back/add',
}
