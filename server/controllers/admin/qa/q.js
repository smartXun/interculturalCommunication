const knex = require('../../../knex.js')
const conf = require('../../../config.js')
const stringUtil = require('../../../util/string.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  const questions = await knex.select('*').from('qa_que').limit(parseInt(pageSize)).offset(parseInt(offset))
  questions.forEach((que) => {
    que.content = stringUtil.setString(que.content.replace(/^(\&nbsp\;)/, ''), 100)
  })
  const totalRet = await knex('qa_que').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: questions, total }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  await knex('qa_comment').where({ 'q_id': id }).del()
  await knex('qa_ans').where({ 'q_id': id }).del()
  await knex('qa_que').where({ 'id': id }).del()
  ctx.body = { success: true }
}

module.exports = { list, delete_item }