const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    util.http_get(url.QAList, (res)=>{
      console.log(res)
    });
  },
})