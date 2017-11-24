const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    que: null,
    ansList: []
  },
  onLoad: function (options) {
    const AnsListUrl = url.QueDetail + "/" + options.id
    util.http_get(AnsListUrl, (res)=>{
      let que = res.data.que
      que.create_time = util.diffDate(new Date(), new Date(que.create_time))
      let ansList = res.data.ansList
      this.setData({ que, ansList })
    })
  },
  toNewA: function(){
    wx.navigateTo({ url: '../NewA/NewA?id=' + this.data.que.id })
  },
  like: function(){
    util.http_post(url.QueLike, {} ,(res) => {
      if(res.success){

      }
    })
  }
})