const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const jwt = require('jsonwebtoken')

const login = async (ctx, next) => {
  const { acc, pwd } = ctx.request.body;
  
  if( !acc || !pwd ){
    ctx.body = { success: false, message: 'Paramater Error!' }
  }else{
    const user = await knex('mUser').where({ name: acc }).first()
    if (user) {
      if (pwd == user.password) {
        let userToken = { id: user.u_id }
        const token = jwt.sign(userToken, conf.jwtSecret, { expiresIn: '7d' })  //token签名 有效期为7天
        const userInfo = { nickName: user.name, email: user.email, avatarUrl: user.image_url }
        ctx.body = { success: true, token, userInfo }
      } else {
        ctx.body = { success: false, message: 'Wrong Password!' }
      }
    } else {
      ctx.body = { success: false, message: 'Username Not Exist!' }
    }
  }
}

const register = async (ctx, next) => {
  const { acc, email, pwd } = ctx.req.body
  const { filename, path, mimetype } = ctx.req.file
  const res = await knex('mUser').where({ name: acc }).first()
  if (res) {
    ctx.body = { success: false, message: "Username Exist!" }
  } else {
    const data = await cos.up(filename, path)
    const image_url = "http://" + data.Location

    const user = await knex('mUser').insert({ name: acc, email: email, password: pwd, image_url: image_url })
    if (user) {
      const u_id = user[0]
      let userToken = { id: u_id }
      const token = jwt.sign(userToken, conf.jwtSecret, { expiresIn: '7d' })  //token签名 有效期为7天
      const userInfo = { nickName: acc, email: email, avatarUrl: image_url }
      ctx.body = { success: true, token, userInfo }
    } else {
      ctx.body = { success: false, message: "Create Fail!" }
    }
  }
}

const changepwd = async (ctx, next) => {
  const { acc, oldPwd, newPwd } = ctx.request.body;
  const user = await knex('mUser').where({ name: acc }).first()
  if (user) {
    if (oldPwd == user.password) {
      await knex('mUser').where({ name: acc }).update({ password: newPwd })
      ctx.body = { success: true }
    } else {
      ctx.body = { success: false, message: 'Wrong Password!' }
    }
  } else {
    ctx.body = { success: false, message: 'Username Not Exist!' }
  }
}

module.exports = { login, register, changepwd }