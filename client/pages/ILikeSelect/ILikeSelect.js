Page({
  data: {
  
  },
  toQuestionLike: function () {
    wx.navigateTo({ url: '../QuestionLike/QuestionLike' })
  },
  toAnswerLike: function () {
    wx.navigateTo({ url: '../AnswerLike/AnswerLike' })
  },
  toTopicLike: function () {
    wx.navigateTo({ url: '../TopicLike/TopicLike' })
  }
})