const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
    pageData: [],
    isEditing: false,
    editingIndex: 0,
    showModalStatus: false,
    linkValue: '',
    uploadProgress: [],
    isUploading: false,
    uploadingImages: []
  },
  onLoad: function (options) {
    const AnsListUrl = url.QueDetail + "/" + options.id
    util.http_get(AnsListUrl, (res) => {
      this.setData({ queId: options.id })
    })
  },
  changeBlur: function (e) {
    let newData = this.data.pageData
    const index = this.data.editingIndex
    if (e.detail.value == '') {
      newData.splice(index, 1)
    } else {
      newData[index].content = e.detail.value.replace(/\s/g, '&nbsp;')
    }
    this.setData({
      pageData: newData,
      isEditing: false
    })
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
  addText: function () {
    let newData = this.data.pageData
    newData.push({ index: newData.length, type: 'text', content: '' })
    this.setData({
      pageData: newData,
      isEditing: true,
      editingIndex: newData.length - 1
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
      itemList: ['从相册中选择', '拍照'],
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
  handBlockUp: function (e) {
    const index = e.target.dataset.index;
    if (index == 0) return;
    let newData = this.data.pageData;
    newData[index - 1].index += 1;
    newData[index].index -= 1;
    newData.sort(function (a, b) { return a.index - b.index; })
    this.setData({ pageData: newData })
  },
  handBlockDown: function (e) {
    const index = e.target.dataset.index;
    let newData = this.data.pageData;
    if (index == newData.length - 1) return;
    newData[index + 1].index -= 1;
    newData[index].index += 1;
    newData.sort(function (a, b) { return a.index - b.index; })
    this.setData({ pageData: newData })
  },
  handBlockClose: function (e) {
    let index = e.target.dataset.index;
    let newData = this.data.pageData;
    let self = this;
    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          newData.splice(index, 1);
          newData.map(function (n, i) { n.index = i })
          self.setData({ pageData: newData })
        }
      }
    });
  },
  submit: function () {
    const pageData = this.data.pageData
    const images = pageData.filter((currentValue, index, arr)=>{
      return currentValue.type=='image'
    })
    if (images.length > 0) {
      let uploadProgress = this.data.uploadProgress
      uploadProgress = []
      util.http_post(url.preAddWithImage,{
        queId: this.data.queId,
        pageData: this.data.pageData,
        imageCount: images.length
      },(res)=>{
        if(!res.success)return;
        images.forEach((image, index) => {
          uploadProgress.push(0)
          const formData = {
            queId: this.data.queId,
            imageIndex: index,
          }
          const uploadTask = wx.uploadFile({
            url: url.AnsAddWithImage,
            filePath: image.src,
            name: 'file',
            header:{ Authorization: getApp().globalData.token },
            formData: formData,
          })
          uploadTask.onProgressUpdate((res) => {
            let uploadProgress = this.data.uploadProgress
            uploadProgress[index] = res.progress
            if (uploadProgress.every((value, index, arr)=>{
              return value == 100
            })){
              this.setData({ uploadProgress, isUploading:false })
            }else{
              this.setData({ uploadProgress })
            }
          })
        })
      })
      this.setData({ uploadProgress, isUploading: true, uploadingImages: images })
    } else {
      util.http_put(url.AnsAddWithoutImage, { queId: this.data.queId, pageData: JSON.stringify(pageData) }, (res) => {
        if (res.success){
          util.showSuccess("Success!");
          setTimeout(() => {
            wx.navigateBack({ url: '../AnsList/AnsList?id=' + this.data.queId })
          }, 1000)
        }
      })
    }
  }
})