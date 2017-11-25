const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    content: ''
  },
  onLoad: function (options) {
    this.setData({ ansId: options.id })
  },
  contentInput: function (e) {
    this.setData({ content: e.detail.value })
  },
  submit: function () {
    util.http_put(url.CommentAdd, { ansId: this.data.ansId ,content: this.data.content }, (res) => {
      if (res.success) {
        util.showSuccess("Success!");
        setTimeout(() => {
          wx.navigateBack({ url: '../Answer/Answer?id=' + this.data.ansId })
        }, 1000)
      } else {
        util.showModel('Error', res.message)
      }
    })
  }
})