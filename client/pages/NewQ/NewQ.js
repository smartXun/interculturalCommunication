const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    content: ''
  },
  contentInput: function (e) {
    this.setData({ content: e.detail.value })
  },
  submit: function () {
    util.http_put(url.QueAdd, { content: this.data.content }, (res) => {
      if(res.success){
        util.showSuccess("Success!");
        setTimeout(()=>{
          wx.switchTab({ url: '../Q&A/Q&A' })
        },1000)
      }else{
        util.showModel('Error', res.message)
      }
    })
  }
})