const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
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
      backlist.forEach((back) => {
        back.create_time = util.diffDate(new Date(), new Date(back.create_time))
      })
      this.data.backlist = backlist
      this.parseBackList()
    })
  },
  parseBackList: function(){
    let backlist = this.data.backlist
    backlist.forEach((back) => {
      if (app.globalData.backLikeList.includes(back.id)) { back.isLike = true } else { back.isLike = false }
      if (back.cite_id) {
        for (var i = 0; i < backlist.length; i++) {
          if (backlist[i].id == back.cite_id) {
            back.cite = backlist[i]
            break
          }
        }
      }
      if (back.replies) {
        back.replies.forEach((reply) => {
          if (app.globalData.replyLikeList.includes(reply.id)) { reply.isLike = true } else { reply.isLike = false }
          if (reply.cite_id) {
            for (var i = 0; i < back.replies.length; i++) {
              if (back.replies[i].id == reply.cite_id) {
                reply.cite = back.replies[i]
                break
              }
            }
          }
        })
      }
    })
    this.setData({ backlist });
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
  reply: function(e){
    const replyToName = e.currentTarget.dataset.name
    const replyToId = e.currentTarget.dataset.replyid
    const backId = e.currentTarget.dataset.id
    wx.navigateTo({ url: '../Comment/Comment?id=' + this.data.topicId + '&type=reply&replyToName=' + replyToName + '&replyToId=' + replyToId + '&backId=' + backId})
  },
  comment: function(){
    wx.navigateTo({ url: '../Comment/Comment?id=' + this.data.topicId + '&type=topic' })
  },
  comment_cite: function(e){
    const cite_id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '../Comment/Comment?id=' + this.data.topicId + '&type=topic&cite=' + cite_id })
  },
  reply_cite: function (e) {
    const backId = e.currentTarget.dataset.backid
    const cite_id = e.currentTarget.dataset.citeid
    wx.navigateTo({ url: '../Comment/Comment?backId=' + backId + '&type=reply&cite=' + cite_id })
  },
  comment_like: function(e){
    const backId = e.currentTarget.dataset.id
    util.showLoading()
    util.http_post(url.BackLike, { backId }, res=>{
      util.hideLoading()
      if(res.success){
        app.globalData.backLikeList.push(backId)
        this.parseBackList()
      }
    })
  },
  comment_canclelike: function(e){
    const backId = e.currentTarget.dataset.id
    util.showLoading()
    util.http_post(url.BackDisLike, { backId }, res => {
      util.hideLoading()
      if (res.success) {
        const index = app.globalData.backLikeList.findIndex(val => { return val === backId })
        app.globalData.backLikeList.splice(index,1)
        this.parseBackList()
      }
    })
  },
  reply_like: function (e) {
    const replyId = e.currentTarget.dataset.id
    util.showLoading()
    util.http_post(url.ReplyLike, { replyId }, res => {
      util.hideLoading()
      if (res.success) {
        app.globalData.replyLikeList.push(replyId)
        this.parseBackList()
      }
    })
  },
  reply_canclelike: function (e) {
    const replyId = e.currentTarget.dataset.id
    util.showLoading()
    util.http_post(url.ReplyDisLike, { replyId }, res => {
      util.hideLoading()
      if (res.success) {
        const index = app.globalData.replyLikeList.findIndex(val=>{ return val===replyId })
        app.globalData.replyLikeList.splice(index, 1)
        this.parseBackList()
      }
    })
  },
})