const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    content: ''
  },
  onLoad: function (options) {
    const { id, type, replyToName, replyToId, backId } = options
    this.setData({ id, type, replyToName, replyToId, backId })
  },
  contentInput: function (e) {
    this.setData({ content: e.detail.value })
  },
  submit: function () {
    const type = this.data.type
    const content = this.data.content
    if (!content) { util.showModel('Notice', 'Please enter your comment!'); return; }
    util.showLoading();
    if (type=='answer'){
      util.http_put(url.CommentAdd, { ansId: this.data.id, content }, (res) => {
        if (res.success) {
          util.showSuccess("Success!");
          setTimeout(() => {
            wx.navigateBack({ url: '../Answer/Answer?id=' + this.data.id })
          }, 500)
        } else {
          util.showModel('Error', res.message)
        }
      })
    } else if (type == 'topic') {
      util.http_put(url.BackAdd, { topicId: this.data.id, content }, (res) => {
        if (res.success) {
          util.showSuccess('Success')
          setTimeout(() => {
            wx.navigateBack({ url: '../Topic/Topic?id=' + this.data.id })
          }, 500)
        }
      })
    } else if (type == 'reply') {
      const backId = this.data.backId
      const replyToId = this.data.replyToId
      util.http_put(url.ReplyAdd, { backId, replyToId, content }, (res) => {
        if (res.success) {
          util.showSuccess('Success')
          setTimeout(() => {
            wx.navigateBack({ url: '../Topic/Topic?id=' + this.data.id })
          }, 500)
        }
      })
    }
  }
})