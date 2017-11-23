const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const fs = require('fs')

const add = async (ctx, next) => {
  const { content } = ctx.request.body
  const user = ctx.request.user
  const que = await knex('qa_que').insert({ user_id: user.u_id, content: content, like_num: 0, ans_num: 0 })
  if (que) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, msg: "Create Question Fail!" }
  }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  const que = await knex('qa_que').where({ q_id: id }).first()
  ctx.body = { data: que }
}

module.exports = { add, item }