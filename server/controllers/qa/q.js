const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const fs = require('fs')

const addWithImage = async (ctx, next) => {
  const { pageData, imageIndex, imageCount, qID } = ctx.req.body
  const { filename, path, mimetype } = ctx.req.file
  if (imageIndex == 0){
    if (!pageData){
      fs.unlinkSync(path)
      ctx.body = { success: true, token, userInfo }
    }else{
      fs.unlinkSync(path)
      console.log(pageData)
    }
  }else{

  }
}

const addWithoutImage = async (ctx, next) => {
  const { pageData } = ctx.req.body
  const user = await knex('mUser').insert({ name: acc, email: email, password: pwd, image_url: image_url })
}

module.exports = { addWithImage, addWithoutImage }