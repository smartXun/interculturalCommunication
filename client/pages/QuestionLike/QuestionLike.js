const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    util.http_get(url.QueLikeList, (res) => {
      let list = res.data
      list.forEach((que) => {
        que.create_time = util.diffDate(new Date(), new Date(que.create_time))
      });
      this.setData({ list })
    });
  },
})