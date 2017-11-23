const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    const AnsListUrl = url.AnsList + "?id=" + options.id
    util.http_get(AnsListUrl, (res)=>{
      this.setData({ List: res.data })
    })
  },
})