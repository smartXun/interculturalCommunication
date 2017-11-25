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
          ans.content = content.filter((item) => {
            return item.type == 'text'
          })[0].content.replace(/^(\&nbsp\;)/, '')
          return ans
        }else{
          return { q_id: ans.q_id, que: ans.que, create_time, comment_num: ans.comment_num }
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