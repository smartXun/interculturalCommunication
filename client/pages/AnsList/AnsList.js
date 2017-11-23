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
      this.setData({ que: res.data.que, ansList:res.data.ansList })
    })
  },
  toNewA: function(){
    wx.navigateTo({ url: '../NewA/NewA?id=' + this.data.que.id })
  },
  like: function(){
    
  }
})