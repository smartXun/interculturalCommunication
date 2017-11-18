const { uploader } = require('../../qcloud.js')
const knex = require('../../knex.js')
const cos = require('../../cos.js')
const fs = require('fs')

const login = async (ctx, next) => {
  const { acc, pwd } = ctx.request.body;
  if( !acc || !pwd ){
    ctx.body = { success: false, message: '参数错误' }
  }else{
    const res = await knex('mUser').where({ name: acc }).first()
    if (res) {
      console.log(res)
      if (pwd == res.password) {
        ctx.body = { success: true, token: '12345678' }
        // const token = jwt.sign(userToken, secret, { expiresIn: '1h' })  //token签名 有效期为1小时
        // ctx.body.token = token;
      } else {
        ctx.body = { success: false, message: '用户不存在' }
      }
    } else {
      ctx.body = { success: false, message: '用户名密码错误' }
    }
  }
}

const register = async (ctx, next) => {
  const { acc, email, pwd } = ctx.req.body
  const { filename, path, mimetype } = ctx.req.file
  const res = await knex('mUser').where({ name: acc }).first()
  if(res){
    ctx.body = { success: false, msg: "用户名已存在" }
  }else{
    const data = await cos.up(filename, path)
    const user = await knex('mUser').insert({ name: acc, email: email, password: pwd, image_url: data.Location })
    if(user){
      ctx.body = { success: true, msg: "用户创建成功" }
    }else{
      ctx.body = { success: false, msg: "用户创建失败" }
    }
  }
}

module.exports = { login, register }