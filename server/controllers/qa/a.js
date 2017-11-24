const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const fs = require('fs')

const addWithImage = async (ctx, next) => {
  const { pageData, imageIndex, imageCount, qID } = ctx.request.body
  const { filename, path, mimetype } = ctx.req.file
  if (imageIndex == 0) {
    if (!pageData) {
      fs.unlinkSync(path)
      ctx.body = { success: true, token, userInfo }
    } else {
      fs.unlinkSync(path)
      console.log(pageData)
    }
  } else {

  }
}

const addWithoutImage = async (ctx, next) => {
  const { queId, pageData } = ctx.request.body
  const user = ctx.request.user
  const answer = await knex('qa_ans').insert({ q_id: queId,user_id: user.u_id, content: pageData })
  await knex('qa_que').where({ 'id': queId }).increment('ans_num', 1)
  if (answer) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, message: "Create Answer Fail!" }
  }
}

const hotAnsList = async (ctx, next) => {
  let answers = await knex('qa_ans').orderBy('like_num', 'desc').limit(20)
  const promises = answers.map((ans, index, array) => {
    return knex('qa_que').where({ id: ans.q_id }).first().then((que) => {
      ans.que = que.content
    })
  })
  await Promise.all(promises)
  if (!answers || answers.length<20 ){
    const questions = await knex('qa_que').orderBy('create_time', 'desc').limit(20)
    let list = questions.filter((item) => {
      return !answers.some((ans)=>{
        return ans.q_id == item.id
      })
    }).map((que)=>{
      return { q_id: que.id, que: que.content, create_time: que.create_time }
    })
    ctx.body = { data: answers.concat(list) }
  }else{
    ctx.body = { data: answers }
  }
}

module.exports = { addWithImage, addWithoutImage, hotAnsList }