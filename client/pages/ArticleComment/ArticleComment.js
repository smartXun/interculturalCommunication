const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    content: ''
  },
  onLoad: function (options) {
    this.setData({ articleId: options.id })
  },
  contentInput: function (e) {
    this.setData({ content: e.detail.value })
  },
  submit: function () {
    util.http_put(url.ArticleBackAdd, { articleId: this.data.articleId, content: this.data.content }, (res) => {
      if (res.success) {
        util.showSuccess("Success!");
        setTimeout(() => {
          wx.navigateBack({ url: '../Article/Article?id=' + this.data.articleId })
        }, 1000)
      } else {
        util.showModel('Error', res.message)
      }
    })
  }
})