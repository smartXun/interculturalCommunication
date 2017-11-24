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
      const data = res.data
      let list = data.map((ans)=>{
        const content = JSON.parse(ans.content)
        const firstText = content.filter((item)=>{
          return item.type=='text'
        })[0].content
        return { q_id: ans.q_id ,que: ans.que, content: firstText }
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