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
    if (!this.data.content.trim()){
      util.showModel('Notice', 'Please enter your question!')
      return
    }
    if(this.data.image){
      util.showLoading()
      const uploadTask = wx.uploadFile({
        url: url.QueAddWidthImage,
        filePath: this.data.image,
        name: 'file',
        header: { Authorization: getApp().globalData.token },
        formData: { content: this.data.content },
        success: function(res){
          console.log(res)
          util.hideLoading()
          util.showSuccess("Success!");
          setTimeout(() => {
            wx.switchTab({ url: '../QA/QA' })
          }, 500)
        }
      })
    }else{
      util.http_put(url.QueAdd, { content: this.data.content }, (res) => {
        if (res.success) {
          util.showSuccess("Success!");
          setTimeout(() => {
            wx.switchTab({ url: '../QA/QA' })
          }, 500)
        } else {
          util.showModel('Error', res.message)
        }
      })
    }
  },
  addImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['Photo Library', 'Camera'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({ image: res.tempFilePaths[0] })
      }
    })
  },
})