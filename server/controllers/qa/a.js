const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const jwt = require('jsonwebtoken')
const fs = require('fs')

var cache = {}
const preAddWithImage = async (ctx, next) => {
  const { pageData, imageCount, queId } = ctx.request.body
  const que = await knex('qa_que').where({ id: queId }).first()
  if (que.ans_num>0){
    ctx.body = { success: false, message:'This Question has been answered!' }
  }else{
    const user = ctx.request.user
    let images = []
    for (var i = 0; i < imageCount; i++) { images.push({}) }
    cache[queId + '_' + user.u_id] = { pageData, imageCount, images }
    ctx.body = { success: true }
  }
}
const addWithImage = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
    if (decoded.id) {
      const user = await knex('mUser').where({ u_id: decoded.id }).first()
      const { imageIndex, queId } = ctx.req.body
      const { filename, path, mimetype } = ctx.req.file
      let ansObj = cache[queId + '_' + user.u_id]
      if (!ansObj){
        fs.unlinkSync(path)
        ctx.body = { success: false, message: 'Bad request' }
      }else{
        ansObj.images[imageIndex] = { filename, path }
        if (!cache[queId + '_' + user.u_id].complete && ansObj.images.every((value, index, arr) => {
          return value && value.filename && value.path
        })) {
          cache[queId + '_' + user.u_id].complete = true
          let { pageData, images } = ansObj
          const promises = images.map((image, index, array) => {
            return cos.up(image.filename, image.path).then((data) => {
              image.url = "http://" + data.Location
            })
          })
          await Promise.all(promises)
          pageData.filter((item, index, arr) => {
            return item.type == 'image'
          }).forEach((item, index, arr) => {
            item.src = images[index].url
          })
          pageData = JSON.stringify(pageData)
          const ansID = await knex('qa_ans').insert({ q_id: queId, user_id: user.u_id, content: pageData })
          await knex('user_action').insert({ a_id: ansID, user_id: user.u_id })
          await knex('qa_que').where({ 'id': queId }).increment('ans_num', 1)
          delete cache[queId + '_' + user.u_id]
          ctx.body = { success: true }
        }
      }
    } else {
      ctx.body = { code: -1, message: 'token invalid' }
    }
  } else {
    ctx.body = { code: -1, msg: 'User authentication failed' }
  }
}

const addWithoutImage = async (ctx, next) => {
  const { queId, pageData } = ctx.request.body
  const user = ctx.request.user
  const ansID = await knex('qa_ans').insert({ q_id: queId, user_id: user.u_id, content: pageData })
  await knex('user_action').insert({ a_id: ansID, user_id: user.u_id })
  await knex('qa_que').where({ 'id': queId }).increment('ans_num', 1)
  if (ansID) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, message: "Create Answer Fail!" }
  }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  let ans = await knex('qa_ans').where({ id: id }).first()
  const ansUser = await knex('mUser').where({ 'u_id': ans.user_id }).first()
  ans.user = { name: ansUser.name, userAvatar: ansUser.image_url }
  const que = await knex('qa_que').where({ id: ans.q_id }).first()
  ctx.body = { data: { que, ans } }
}

const like = async (ctx, next) => {
  const { ansId } = ctx.request.body
  const user = ctx.request.user
  const ansLike = await knex('qa_ans_like').where({ 'a_id': ansId , user_id: user.u_id }).first()
  if (ansLike) {
    ctx.body = { success: false, message: "You've liked it!" }
  } else {
    await knex('qa_ans_like').insert({ user_id: user.u_id, a_id: ansId })
    await knex('qa_ans').where({ 'id': ansId }).increment('like_num', 1)
    ctx.body = { success: true }
  }
}

const getAnsCommentUserPhoto = async (ans) => {
  if(!ans)return
  const comments = await knex.select('user_id').from('qa_comment').whereIn('a_id', ans.id).limit(3)
  comments.map((item)=>{return item.user_id})
  const commenters = await knex.select('image_url').from('mUser').whereIn('u_id', comments.map((item) => { return item.user_id }))
  ans.commenters = commenters.map((item) => { return item.image_url })
}

const likelist = async (ctx, next) => {
  const user = ctx.request.user
  const ansLikeList = await knex('qa_ans_like').where({ 'user_id': user.u_id })
  let list = []
  const promises = ansLikeList.map((ansLike, index, array) => {
    return knex('qa_ans').where({ 'id': ansLike.a_id }).first().then((ans) => {
      list.push(ans)
    })
  })
  await Promise.all(promises)
  const promises1 = list.map((ans, index, array) => {
    return knex('qa_que').where({ 'id': ans.q_id }).first().then((que) => {
      ans.que = que.content
    })
  })
  await Promise.all(promises1)
  const promises2 = list.map((ans, index, array) => {
    return getAnsCommentUserPhoto(ans)
  })
  await Promise.all(promises2)
  ctx.body = { success: true, data: list }
}

module.exports = { preAddWithImage, addWithImage, addWithoutImage, item, like, likelist, getAnsCommentUserPhoto }