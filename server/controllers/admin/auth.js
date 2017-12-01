const knex = require('../../knex.js')
const conf = require('../../config.js')
const jwt = require('jsonwebtoken')

const login = async (ctx, next) => {
  const { acc, pwd } = ctx.request.body;
  console.log(acc,pwd)
  if (!acc || !pwd) {
    ctx.body = { success: false, message: '参数错误' }
  } else {
    const user = await knex('aUser').where({ name: acc }).first()
    if (user) {
      if (pwd == user.password) {
        let userToken = { id: user.u_id }
        const token = jwt.sign(userToken, conf.jwtSecret, { expiresIn: '7d' })  //token签名 有效期为7天
        ctx.body = { success: true, token }
      } else {
        ctx.body = { success: false, message: '用户名密码错误' }
      }
    } else {
      ctx.body = { success: false, message: '用户不存在' }
    }
  }
}


module.exports = { login }