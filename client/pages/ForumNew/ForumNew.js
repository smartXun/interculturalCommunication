const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
    headlineValue:'',
    pageData: [{
      index: 0, type: 'text', content: ''
    }],
    showModalStatus: false,
    linkValue: '',
    uploadProgress: [],
    isUploading: false,
    uploadingImages: []
  },
  headlineInput: function (e) {
    this.setData({ headlineValue: e.detail.value })
  },
  changeBlur: function (e) {
    let pageData = this.data.pageData
    pageData[0].content = e.detail.value.replace(/^ +/gm, function (all) {
      return all.replace(/ /g, '&nbsp;');
    })
    this.setData({ pageData })
  },
  edit: function (e) {
    const index = e.currentTarget.dataset.index
    if (this.data.pageData && this.data.pageData[index]) {
      const etype = this.data.pageData[index].type
      if (etype == 'image') {
        return;
      }
    }
    this.setData({
      isEditing: true,
      editingIndex: index
    })
  },
  linkInput: function (e) {
    this.setData({ linkValue: e.detail.value })
  },
  addVideo: function () {
    let newData = this.data.pageData
    const linksrc = this.data.linkValue
    newData.push({ index: newData.length, type: 'video', src: linksrc })
    this.setData({
      pageData: newData,
      linkValue: '',
      showModalStatus: false
    })
  },
  showModel: function () {
    this.setData({ showModalStatus: true })
  },
  hideModel: function () {
    this.setData({ showModalStatus: false, linkValue: '' })
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
        let newData = _this.data.pageData
        newData.push({ index: newData.length, type: 'image', src: res.tempFilePaths[0] })
        _this.setData({ pageData: newData })
      }
    })
  },
  submit: function () {
    const pageData = this.data.pageData
    const headlineValue = this.data.headlineValue.trim()
    if (!headlineValue){
      util.showModel('Notice', 'Please enter headline!')
      return
    }
    if (pageData.length < 0 || !pageData.some((item, index, arr) => {
      return item.type == 'text' && item.content
    })) {
      util.showModel('Notice', 'Please enter something!')
      return
    }
    const images = pageData.filter((currentValue, index, arr) => {
      return currentValue.type == 'image'
    })
    if (images.length > 0) {
      let uploadProgress = this.data.uploadProgress
      uploadProgress = []
      util.http_post(url.TopicPreAddWithImage, {
        title: this.data.headlineValue,
        pageData: this.data.pageData,
        imageCount: images.length
      }, (res) => {
        if (!res.success) return;
        images.forEach((image, index) => {
          uploadProgress.push(0)
          const uploadTask = wx.uploadFile({
            url: url.TopicAddWithImage,
            filePath: image.src,
            name: 'file',
            header: { Authorization: getApp().globalData.token },
            formData: { imageIndex: index },
          })
          uploadTask.onProgressUpdate((res) => {
            let uploadProgress = this.data.uploadProgress
            uploadProgress[index] = res.progress
            if (uploadProgress.every((value, index, arr) => {
              return value == 100
            })) {
              util.showSuccess('Success')
              setTimeout(() => {
                wx.navigateBack({ url: '../AnsList/AnsList?id=' + this.data.queId })
              }, 1000)
              this.setData({ uploadProgress, isUploading: false })
            } else {
              this.setData({ uploadProgress })
            }
          })
        })
      })
      this.setData({ uploadProgress, isUploading: true, uploadingImages: images })
    } else {
      util.http_put(url.TopicAddWithoutImage, { title: this.data.headlineValue, pageData: JSON.stringify(pageData) }, (res) => {
        if (res.success) {
          util.showSuccess("Success!");
          setTimeout(() => {
            wx.navigateBack({ url: '../AnsList/AnsList?id=' + this.data.queId })
          }, 1000)
        }
      })
    }
  }
})