const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    this.getData()
  },
  getData: function(){
    util.http_get(url.QueList, (res) => {
      if(!res.data)return
      const data = res.data
      let list = data.map((que)=>{
        que.create_time = util.diffDate(new Date(), new Date(que.create_time))
        if (que.ans){
          const content = JSON.parse(que.ans)
          let firstText = content.filter((item) => {
            return item.type == 'text'
          })[0]
          let images = content.filter((item) => {
            return item.type == 'image'
          })
          que.images = []
          for (var i = 0; i < images.length; i++ ){
            if(i>=2){break;}
            que.images.push(images[i])
          }
          if (firstText) {
            que.firstText = firstText.content.replace(/^(\&nbsp\;)/, '')
          }
        }
        return que
      })
      this.setData({ list: list }) 
    });
  },
  newqa: function(){
    wx.navigateTo({ url: '../NewQ/NewQ' })
  },
  toAnsList: function(e){
    wx.navigateTo({ url: '../AnsList/AnsList?id=' + e.currentTarget.dataset.id })
  }
})