const knex = require('../../../knex.js')
const conf = require('../../../config.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  const questions = await knex.select('*').from('qa_que').limit(parseInt(pageSize)).offset(parseInt(offset))
  const totalRet = await knex('qa_que').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: questions, total }
}

module.exports = { list }