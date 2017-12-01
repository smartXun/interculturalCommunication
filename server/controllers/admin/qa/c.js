const knex = require('../../../knex.js')
const conf = require('../../../config.js')
const stringUtil = require('../../../util/string.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  const comments = await knex.select('*').from('qa_comment').limit(parseInt(pageSize)).offset(parseInt(offset))
  comments.forEach((comment) => {
    comment.content = stringUtil.setString(comment.content.replace(/^(\&nbsp\;)/, ''), 100)
  })
  const totalRet = await knex('qa_comment').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: questions, total }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  await knex('qa_comment').where({ 'id': id }).del()
  ctx.body = { success: true }
}

module.exports = { list, delete_item }