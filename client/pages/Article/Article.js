const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    this.setData({ articleId: options.id })
  },
  onShow: function () {
    const ArticleDetailUrl = url.ArticleDetail + "/" + this.data.articleId
    util.http_get(ArticleDetailUrl, (res) => {
      let article = res.data
      article.create_time = util.getTimeString(new Date(article.create_time))
      article.content = JSON.parse(article.content)
      this.setData({ article })
    })
  },
  like: function () {
    util.http_post(url.ArticleLike, { articleId: this.data.articleId }, (res) => {
      if (res.success) {
        util.showSuccess('Success')
        let article = this.data.article
        article.like_num += 1
        this.setData({ article })
      } else {
        util.showModel('Notice', res.message)
      }
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
        let article = that.data.article
        if (res.tapIndex === 0) {
          that.translate_request(article.content[index].content, 'zh-CN', resultString => {
            util.hideLoading()
            article.content[index].content = resultString
            that.setData({ article })
          })
        } else {
          that.translate_request(article.content[index].content, 'en', resultString => {
            util.hideLoading()
            article.content[index].content = resultString
            that.setData({ article })
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
    let article = this.data.article
    let content = article.content
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
      article.content = content
      this.setData({ article })
    })
  },
  translateChinese: function () {
    this.translateAll('zh-CN')
  },
  translateEnglish: function () {
    this.translateAll('en')
  }
})