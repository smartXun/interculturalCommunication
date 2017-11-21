Page({
  data: {
    pageData:[],
    isEditing: false,
    editingIndex: 0,
    showModalStatus: false
  },
  onLoad: function (options) {
  
  },
  changeBlur: function(e){
    let newData = this.data.pageData
    const index = this.data.editingIndex
    if (e.detail.value == '') {
      newData.splice(index, 1)
    } else {
      newData[index].content = e.detail.value
    }
    this.setData({
      pageData: newData,
      isEditing: false
    })
  },
  edit: function(e){
    const index = e.currentTarget.dataset.index
    if (this.data.pageData && this.data.pageData[index]){
      const etype = this.data.pageData[index].type
      if (etype == 'image'){
        return;
      }
    }
    this.setData({
      isEditing: true,
      editingIndex: index
    })
  },
  addText: function(){
    let newData = this.data.pageData
    newData.push({ index: newData.length, type: 'text', content: '' })
    this.setData({
      pageData: newData,
      isEditing: true,
      editingIndex: newData.length-1
    })
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
    newData[index-1].index += 1;
    newData[index].index -= 1;
    newData.sort(function (a, b) { return a.index - b.index; })
    this.setData({ pageData: newData })
  },
  handBlockDown: function (e) {

  },
  handBlockClose: function (e) {

  }
})