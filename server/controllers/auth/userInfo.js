const axios = require('axios')
const conf = require('../../config.js')
const knex = require('../../knex.js')
const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
  const user = ctx.request.user
  if (user.open_id){
    ctx.body = { success: false, message: '微信请用微信接口获取' }
  }else{
    const userInfo = { nickName: user.name, email: user.email, avatarUrl: user.image_url }
    ctx.body = { success: false, userInfo: userInfo }
  }
}