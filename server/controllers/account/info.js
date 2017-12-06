const axios = require('axios')
const conf = require('../../config.js')
const knex = require('../../knex.js')
const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
  const user = ctx.request.user
  const userInfo = { nickName: user.name, email: user.email, avatarUrl: user.image_url }
  if (user.open_id) {
    ctx.body = { success: true, userType: 'wechat', userInfo: userInfo }
  } else {
    ctx.body = { success: true, userType: 'local', userInfo: userInfo }
  }
}