const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
    loaded:false,
    list:[]
  },
  onLoad: function (options) {
    this.setData({ userInfo:app.globalData.userInfo })
    this.getData()
  },
  getData: function(){
    util.showLoading()
    util.http_get(url.Historical, res => {
      util.hideLoading()
      if(res.data && res.data.length>0){
        let list = this.data.list
        let data = res.data
        console.log(data)
        data.forEach((item)=>{
          item.create_time = util.diffDate(new Date(), new Date(item.create_time))
          if (item.type=="ans"){
            item.content = JSON.parse(item.content).filter((item) => { return item.type == 'text' })[0].content.replace(/^(\&nbsp\;)/, '')
          }
        })
        list = list.concat(data)
        this.setData({ list })
      }else{
        this.setData({ loaded:true })
      }
    })
  }
})