const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const fs = require('fs')

const add = async (ctx, next) => {
  const { content } = ctx.request.body
  const user = ctx.request.user
  const que = await knex('qa_que').insert({ user_id: user.u_id, content: content })
  if (que) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, message: "Create Question Fail!" }
  }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  const que = await knex('qa_que').where({ id: id }).first()
  const ansList = await knex('qa_ans').where({ q_id: id })
  ctx.body = { data: { que, ansList } }
}

const like = async (ctx, next) => {
  const { queId } = ctx.request.body
  const user = ctx.request.user
  const queLike = await knex('qa_que_like').where({ 'q_id': queId }).first()
  if (queLike){
    ctx.body = { success: false, message: "You've liked it!" }
  }else{
    await knex('qa_que_like').insert({ user_id: user.u_id, q_id: queId })
    await knex('qa_que').where({ 'id': queId }).increment('like_num', 1 )
    ctx.body = { success: true }
  }
}

module.exports = { add, item, like }