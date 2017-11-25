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
    util.http_get(url.hotAnsList, (res) => {
      if(!res.data)return
      const data = res.data
      let list = data.map((ans)=>{
        ans.create_time = util.diffDate(new Date(), new Date(ans.create_time))
        if (ans.content){
          const content = JSON.parse(ans.content)
          let firstText = content.filter((item) => {
            return item.type == 'text'
          })[0]
          let images = content.filter((item) => {
            return item.type == 'image'
          })
          ans.images = []
          for (var i = 0; i < images.length; i++ ){
            if(i>=2){break;}
            ans.images.push(images[i])
          }
          if (firstText) {
            ans.content = firstText.content.replace(/^(\&nbsp\;)/, '')
          }else{
            ans.content = ''
          }
        }
        return ans
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