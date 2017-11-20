const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
    app.userInfoReadyCallback = ()=> {
      this.getData()
    }
  },
  getData: function(){
    util.http_get(url.QAList, (res) => {
      console.log(res)
    });
  }
})