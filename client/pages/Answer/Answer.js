const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    isChooseLanguage: false
  },
  onLoad: function (options) {
    this.setData({ ansId: options.id })
  },
  onShow:function(){
    const AnsDetailUrl = url.AnsDetail + "/" + this.data.ansId
    util.http_get(AnsDetailUrl, (res) => {
      let ans = res.data.ans
      const que = res.data.que
      ans.create_time = util.diffDate(new Date(), new Date(ans.create_time))
      ans.content = JSON.parse(ans.content)
      console.log(ans)
      this.setData({ ans, que })
    })

    const CommentListUrl = url.CommentList + "/" + this.data.ansId
    util.http_get(CommentListUrl, (res) => {
      let comments = res.data.comments
      comments.forEach((comment) => {
        comment.create_time = util.diffDate(new Date(), new Date(comment.create_time))
      })
      this.setData({ comments })
    })
  },
  comment: function(){
    wx.navigateTo({ url: '../Comment/Comment?id=' + this.data.ansId })
  },
  like:function(){
    util.http_post(url.AnsLike, { ansId: this.data.ansId }, (res) => {
      if (res.success) {
        util.showSuccess('Success')
        let ans = this.data.ans
        ans.like_num += 1
        this.setData({ ans })
      } else {
        util.showModel('Notice', res.message)
      }
    })
  },
  chooseLanguage: function(){
    this.setData({ isChooseLanguage:true })
  },
  cancleChooseLanguage: function(){
    this.setData({ isChooseLanguage: false })
  }
})