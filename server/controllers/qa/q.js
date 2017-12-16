const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const jwt = require('jsonwebtoken')
const { getAnsCommentUserPhoto } = require('./a.js')

const add = async (ctx, next) => {
  const { content } = ctx.request.body
  const user = ctx.request.user
  const queId = await knex('qa_que').insert({ user_id: user.u_id, content: content })
  if (queId) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, message: "Create Question Fail!" }
  }
}

const addWithImage = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
    if (decoded.id) {
      const user = await knex('mUser').where({ u_id: decoded.id }).first()
      const { content } = ctx.req.body
      const { filename, path, mimetype } = ctx.req.file
      const data = await cos.up(filename, path)
      const imageUrl = "http://" + data.Location
      const queId = await knex('qa_que').insert({ user_id: user.u_id, content, image:imageUrl })
      ctx.body = { success: true }
    } else {
      ctx.body = { code: -2, message: 'token invalid' }
    }
  } else {
    ctx.body = { code: -2, msg: 'User authentication failed' }
  }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  const que = await knex('qa_que').where({ id: id }).first()
  let ansList = await knex('qa_ans').where({ q_id: id })
  const promises = ansList.map((ans, index, array) => {
    return knex('mUser').where({ 'u_id': ans.user_id }).first().then((user) => {
      ans.userAvatar = user.image_url
    })
  })
  await Promise.all(promises)
  console.log(ansList)
  ctx.body = { data: { que, ansList: ansList } }
}

const like = async (ctx, next) => {
  const { queId } = ctx.request.body
  const user = ctx.request.user
  const queLike = await knex('qa_que_like').where({ 'q_id': queId }).first()
  if (queLike) {
    ctx.body = { success: false, message: "You've liked it!" }
  } else {
    await knex('qa_que_like').insert({ user_id: user.u_id, q_id: queId })
    await knex('qa_que').where({ 'id': queId }).increment('like_num', 1)
    ctx.body = { success: true }
  }
}

const likelist = async (ctx, next) => {
  const user = ctx.request.user
  const queLikeList = await knex('qa_que_like').where({ 'user_id': user.u_id })
  let list = []
  const promises = queLikeList.map((queLike, index, array) => {
    return knex('qa_que').where({ 'id': queLike.q_id }).first().then((que) => {
      let { content, create_time, ans_num, like_num } = que
      list.push({ content, create_time, ans_num, like_num })
    })
  })
  await Promise.all(promises)
  ctx.body = { success: true, data: list }
}

const list = async (ctx, next) => {
  const questions = await knex('qa_que').orderBy('create_time', 'desc').limit(20)
  const promises1 = questions.map((que, index, array) => {
    return knex('qa_ans').where({ 'q_id': que.id }).orderBy('create_time', 'desc').first().then((ans) => {
      que.ans = ans
    })
  })
  await Promise.all(promises1)
  const promises2 = questions.map((que, index, array) => {
    return getAnsCommentUserPhoto(que.ans)
  })
  await Promise.all(promises2)
  const list = questions.map((que, index, array) => {
    const { ans_num, content, create_time, id, ans } = que
    return { ans_num, content, create_time, id, ans }
  })
  ctx.body = { data: list }
}

module.exports = { add, addWithImage, item, like, likelist , list }