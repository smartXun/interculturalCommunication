const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    showModalStatus:false
  },
  onLoad: function (options) {
    this.getData()
  },
  getData: function () {
    util.http_get(url.MyPostList+'/0/20', (res) => {
      if (!res.data) return
      const data = res.data
      console.log(data)
      let list = data.map((topic) => {
        topic.create_time = util.diffDate(new Date(), new Date(topic.create_time))
        if (topic.content) {
          const content = JSON.parse(topic.content)
          let firstText = content.filter((item) => {
            return item.type == 'text'
          })[0]
          let images = content.filter((item) => {
            return item.type == 'image'
          })
          topic.images = []
          for (var i = 0; i < images.length; i++) {
            if (i >= 2) { break; }
            topic.images.push(images[i])
          }
          if (firstText) {
            topic.firstText = firstText.content.replace(/^(\&nbsp\;)/, '')
          }
        }
        return topic
      })
      this.setData({ list: list })
    });
  },
  delete_item_pop: function(e){
    const id = e.currentTarget.dataset.id
    this.setData({ id, showModalStatus:true })
  },
  hideModel: function(){
    this.setData({ showModalStatus: false })
  },
  delete_item:function(){
    const id = this.data.id
    util.showLoading()
    this.setData({ showModalStatus: false })
    util.http_post(url.MyPostDelete, { id },(res)=>{
      util.hideLoading()
      if(res.success){
        let list = this.data.list
        for(let i=0;i<list.length;i++){
          if (list[i].id == id){
            list.splice(i,1)
            break
          }
        }
        this.setData({ list: list })
      }
    })
  }
})