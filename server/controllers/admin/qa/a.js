const knex = require('../../../knex.js')
const conf = require('../../../config.js')
const stringUtil = require('../../../util/string.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  let answers = await knex.select('*').from('qa_ans').limit(parseInt(pageSize)).offset(parseInt(offset))
  answers.forEach((ans)=>{
    const content = JSON.parse(ans.content)
    let firstText = content.filter((item) => {
      return item.type == 'text'
    })[0]
    if (firstText) {
      ans.content = stringUtil.setString(firstText.content.replace(/^(\&nbsp\;)/, ''), 100)
    } else {
      ans.content = ''
    }
  })
  const totalRet = await knex('qa_ans').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: answers, total }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  await knex('qa_comment').where({ 'a_id': id }).del()
  await knex('qa_ans').where({ 'id': id }).del()
  ctx.body = { success: true }
}

module.exports = { list, delete_item }