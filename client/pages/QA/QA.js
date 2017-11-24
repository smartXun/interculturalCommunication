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
        if (ans.content){
          const content = JSON.parse(ans.content)
          const firstText = content.filter((item) => {
            return item.type == 'text'
          })[0].content.replace(/(\&nbsp\;)+/g, '')
          const create_time = util.diffDate(new Date(), new Date(ans.create_time))
          return { q_id: ans.q_id, que: ans.que, content: firstText, create_time, comment_num: ans.comment_num }
        }else{
          return { q_id: ans.q_id, que: ans.que }
        }
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