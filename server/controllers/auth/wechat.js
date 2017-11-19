const axios = require('axios')
const conf = require('../../config.js')
const knex = require('../../knex.js')
const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
  const { code, nickName, avatarUrl } = ctx.request.body;
  if (!code || !nickName || !avatarUrl) {
    ctx.body = { success: false, message: '参数错误' }
  } else {
    const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
      conf.appId + '&secret=' + conf.appSecret + '&js_code=' + code + '&grant_type=authorization_code'
    const res = await axios.get(url)
    const { openid, session_key } = res.data
    const user = await knex('mUser').where({ open_id: openid }).first()
    if (user) {
      let userToken = { id: user.u_id }
      const token = jwt.sign(userToken, conf.jwtSecret, { expiresIn: '7d' })  //token签名 有效期为7天
      ctx.body = { success: true, token }
    } else {
      const user = await knex('mUser').insert({ name: nickName, image_url: avatarUrl, open_id: openid, session_key: session_key })
      if (user) {
        const u_id = user[0]
        let userToken = { id: user.u_id }
        const token = jwt.sign(userToken, conf.jwtSecret, { expiresIn: '7d' })  //token签名 有效期为7天
        ctx.body = { success: true, token }
      } else {
        ctx.body = { success: false, msg: "用户创建失败" }
      }
    }
  }
}