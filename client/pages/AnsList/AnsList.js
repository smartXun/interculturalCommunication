const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    que: null,
    ansList: []
  },
  onLoad: function (options) {
    this.setData({ id: options.id})
    this.getData()
  },
  onPullDownRefresh: function () {
    this.getData()
  },
  getData: function () {
    const AnsListUrl = url.QueDetail + "/" + this.data.id
    util.http_get(AnsListUrl, (res)=>{
      wx.stopPullDownRefresh()
      let que = res.data.que
      que.create_time = util.diffDate(new Date(), new Date(que.create_time))
      let ansList = res.data.ansList
      ansList.forEach((ans) => {
        ans.create_time = util.diffDate(new Date(), new Date(ans.create_time))
        const content = JSON.parse(ans.content)
        let firstText = content.filter((item) => {
          return item.type == 'text'
        })[0]
        if (firstText) {
          ans.content = firstText.content.replace(/^(\&nbsp\;)/, '')
        } else {
          ans.content = ''
        }
      })
      this.setData({ que, ansList })
    })
  },
  toNewA: function(){
    wx.navigateTo({ url: '../NewA/NewA?id=' + this.data.que.id })
  },
  like: function(){
    util.http_post(url.QueLike, { queId: this.data.que.id } ,(res) => {
      if(res.success){
        util.showSuccess('Success')
        let que = this.data.que
        que.like_num += 1
        this.setData({ que })
      }else{
        util.showModel('Notice', res.message)
      }
    })
  },
  toAnswer: function(e){
    wx.navigateTo({ url: '../Answer/Answer?id=' + e.currentTarget.dataset.id })
  }
})