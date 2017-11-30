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
  sendBack: function(e){
    util.http_put(url.BackAddd, { topicId: this.data.topicId, content: e.detail.value } ,(res) => {
      if(res.success){
        util.showSuccess('Success')
      }
    })
    this.setData({ backValue: '' })
  },
  chooseLanguage: function () {
    this.setData({ isChooseLanguage: !this.data.isChooseLanguage })
  },
  cancleChooseLanguage: function () {
    this.setData({ isChooseLanguage: false })
  },
  translateChinese: function () {
    this.setData({ isChooseLanguage: false })
    util.showLoading()
    let content = JSON.parse(this.data.topic.content)
    let textList = content.filter((item) => { return item.type == 'text' })
    const promise = textList.map((item) => {
      return new Promise((resolve, reject) => {
        util.http_post(url.Translate, {
          transText: item.content.toLowerCase(),
          to: 'zh-CN'
        }, (res) => {
          const results = res.result
          let resultString = ''
          results.forEach((item) => {
            resultString += item
          })
          item.content = resultString
          resolve()
        })
      })
    })
    Promise.all(promise).then((results) => {
      util.hideLoading()
      this.setData({ contents: content })
    })
  },
  translateEnglish: function () {
    this.setData({ isChooseLanguage: false })
    util.showLoading()
    let content = JSON.parse(this.data.topic.content)
    let textList = content.filter((item) => { return item.type == 'text' })
    const promise = textList.map((item) => {
      return new Promise((resolve, reject) => {
        util.http_post(url.Translate, {
          transText: item.content.toLowerCase(),
          to: 'en'
        }, (res) => {
          const results = res.result
          let resultString = ''
          results.forEach((item) => {
            resultString += item
          })
          item.content = resultString
          resolve()
        })
      })
    })
    Promise.all(promise).then((results) => {
      util.hideLoading()
      this.setData({ contents: content })
    })
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
  }
})