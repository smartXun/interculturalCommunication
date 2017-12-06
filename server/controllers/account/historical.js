const knex = require('../../knex.js')

const all = async (ctx, next) => {
  let { offset, pageSize } = ctx.params
  const user = ctx.request.user
  offset = offset ? parseInt(offset) : 0
  pageSize = pageSize ? parseInt(pageSize) : 20
  const list = await knex.select('*').from('user_action').where({'user_id': user.u_id}).limit(pageSize).offset(offset)
  const recordList = []
  const promises = list.map((item, index, array) => {
    recordList.push({})
    if (item.q_id){
      return knex('qa_que').where({ 'id': item.q_id  }).first().then((que) => {
        que.type = 'que'
        recordList[index] = que
      })
    } else if (item.a_id) {
      return knex('qa_ans').where({ 'id': item.a_id }).first().then((ans) => {
        ans.type = 'ans'
        recordList[index] = ans
      })
    } else if (item.c_id) {
      return knex('qa_comment').where({ 'id': item.c_id }).first().then((comment) => {
        comment.type = 'comment'
        recordList[index] = comment
      })
    } else if (item.topic_id) {
      return knex('forum_topic').where({ 'id': item.topic_id }).first().then((topic) => {
        topic.type = 'topic'
        recordList[index] = topic
      })
    } else if (item.back_id) {
      return knex('forum_topic_back').where({ 'id': item.back_id }).first().then((back) => {
        back.type = 'back'
        recordList[index] = back
      })
    }
    return false
  })
  await Promise.all(promises)
  ctx.body = { success: true, data: recordList }
}

module.exports = { all }