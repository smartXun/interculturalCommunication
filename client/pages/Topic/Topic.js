const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    backValue: '',
    isChooseLanguage: false
  },
  onLoad: function (options) {
    this.setData({ topicId: options.id });
    const topDetailUrl = url.TopicDetail + "/" + options.id
    util.http_get(topDetailUrl, (res) => {
      let topic = res.data
      let contents = JSON.parse(topic.content)
      this.setData({ topic, contents });
    })
    const BackListUrl = url.BackList + "/" + options.id
    util.http_get(BackListUrl, (res) => {
      let backlist = res.data
      backlist.forEach((back) => { back.create_time = util.diffDate(new Date(), new Date(back.create_time)) })
      this.setData({ backlist });
    })
  },
  chooseLanguage: function () {
    this.setData({ isChooseLanguage: !this.data.isChooseLanguage })
  },
  cancleChooseLanguage: function () {
    this.setData({ isChooseLanguage: false })
  },
  translate_request: function (content, language, cb) {
    util.http_post(url.Translate, {
      transText: content.toLowerCase(),
      to: language
    }, (res) => {
      const results = res.result
      let resultString = ''
      results.forEach((item) => {
        resultString += item
      })
      cb(resultString)
    })
  },
  translate_content: function (e) {
    const index = e.currentTarget.dataset.index
    const that = this
    wx.showActionSheet({
      itemList: ['Chinese', 'English'],
      success: function (res) {
        util.showLoading()
        if (res.tapIndex === 0) {
          that.translate_request(that.data.contents[index].content, 'zh-CN', resultString => {
            util.hideLoading()
            let contents = that.data.contents
            contents[index].content = resultString
            that.setData({ contents })
          })
        } else {
          that.translate_request(that.data.contents[index].content, 'en', resultString => {
            util.hideLoading()
            let contents = that.data.contents
            contents[index].content = resultString
            that.setData({ contents })
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  translateAll: function (language) {
    this.setData({ isChooseLanguage: false })
    util.showLoading()
    let content = JSON.parse(this.data.topic.content)
    let textList = content.filter((item) => { return item.type == 'text' })
    const promise = textList.map((item) => {
      return new Promise((resolve, reject) => {
        this.translate_request(item.content, language, resultString => {
          item.content = resultString
          resolve()
        })
      })
    })
    Promise.all(promise).then(() => {
      util.hideLoading()
      this.setData({ contents: content })
    })
  },
  translateChinese: function () {
    this.translateAll('zh-CN')
  },
  translateEnglish: function () {
    this.translateAll('en')
  },
  favorite: function(){
    if (this.data.topic.islike){
      const TopicDisLikeUrl = url.TopicDisLike + '/' + this.data.topicId
      util.http_post(TopicDisLikeUrl, {}, (res) => {
        if (res.success) { 
          let topic = this.data.topic
          topic.islike = false
          this.setData({ topic }) }
      })
    }else{
      const TopicLikeUrl = url.TopicLike + '/' + this.data.topicId
      util.http_post(TopicLikeUrl, {}, (res) => {
        if (res.success) {
          let topic = this.data.topic
          topic.islike = true
          this.setData({ topic })
        }
      })
    }
  },
  backValueInput: function(e){
    if (e.detail.value == ''){
      this.setData({ isFocus: false, isReply: false })
    }else{
      this.setData({ backValue: e.detail.value })
    }
  },
  reply: function(e){
    const replyToName = e.currentTarget.dataset.name
    const replyToId = e.currentTarget.dataset.replyid
    const backId = e.currentTarget.dataset.id
    wx.navigateTo({ url: '../Comment/Comment?id=' + this.data.topicId + '&type=reply&replyToName=' + replyToName + '&replyToId=' + replyToId + '&backId=' + this.data.backId})
  },
  comment: function(){
    wx.navigateTo({ url: '../Comment/Comment?id=' + this.data.topicId + '&type=topic' })
  }
})