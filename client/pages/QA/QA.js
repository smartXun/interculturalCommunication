const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    list:[]
  },
  onShow: function (options) {
    this.getData()
  },
  getData: function(){
    util.http_get(url.hotAnsList, (res) => { this.setData({ list: res.data }) });
  },
  newqa: function(){
    wx.navigateTo({ url: '../NewQ/NewQ' })
  },
  toAnsList: function(e){
    wx.navigateTo({ url: '../AnsList/AnsList?id=' + e.currentTarget.dataset.id })
  }
})