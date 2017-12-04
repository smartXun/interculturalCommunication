const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    swiper_index: 0,
    my_list:[],
    tome_list:[]
  },
  onLoad: function (options) {
    util.http_get(url.CommentToMe, res => {
      if(res.success){
        let tome_list = this.data.tome_list
        let list = res.data
        list.forEach((item)=>{
          item.create_time = util.diffDate(new Date(), new Date(item.create_time))
        })
        tome_list = tome_list.concat(list)
        this.setData({ tome_list })
      }
    })

    util.http_get(url.MyComment, res => {
      if (res.success) {
        let my_list = this.data.my_list
        let list = res.data
        list.forEach((item) => {
          item.create_time = util.diffDate(new Date(), new Date(item.create_time))
        })
        my_list = my_list.concat(list)
        this.setData({ my_list })
      }
    })
  },
  tab: function (e) {
    this.setData({ swiper_index: e.currentTarget.dataset.id })
  },
  onSwiperChange: function (e) {
    this.setData({ swiper_index: e.detail.current })
  },
})