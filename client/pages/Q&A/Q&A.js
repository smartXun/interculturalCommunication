const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    app.userInfoReadyCallback = ()=> {
      this.getData()
    }
  },
  getData: function(){
    util.http_get(url.QAList, (res) => {
      this.setData({
        list: res.data
      })
    });
  },
  newqa: function(){
    wx.navigateTo({ url: '../NewQA/NewQA' })
  }
})