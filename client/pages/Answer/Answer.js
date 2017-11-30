const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    reloadContent: false,
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
      let contents = JSON.parse(ans.content)
      this.setData({ ans, que, contents })
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
    this.setData({ isChooseLanguage: !this.data.isChooseLanguage })
  },
  cancleChooseLanguage: function(){
    this.setData({ isChooseLanguage: false })
  },
  translateChinese: function () {
    this.setData({ isChooseLanguage: false })
    util.showLoading()
    let content = JSON.parse(this.data.ans.content)
    let textList = content.filter((item) => { return item.type == 'text' })
    const promise = textList.map((item)=>{
      return new Promise((resolve, reject)=>{
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
    Promise.all(promise).then(()=>{
      util.hideLoading()
      this.setData({ contents: content })
    })
  },
  translateEnglish: function () {
    this.setData({ isChooseLanguage: false })
    util.showLoading()
    let content = JSON.parse(this.data.ans.content)
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
  }
})