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
  if (answer) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, msg: "Create Answer Fail!" }
  }
}

const hotAnsList = async (ctx, next) => {
  let answers = await knex('qa_ans').orderBy('like_num', 'desc').limit(20)
  if (!answers || answers.length<=0 ){
    const questions = await knex('qa_que').orderBy('like_num', 'desc').limit(20)
    let list = []
    questions.forEach((que, index, array)=>{
      list.push({ id: que.id, que:que.content })
    })
    ctx.body = { data: list }
  }else{
    const promises = answers.map((ans, index, array) => {
      return knex('qa_que').where({ id: ans.q_id }).first().then((que)=>{
        ans.que = que.content
      })
    })
    console.log(promises)
    await Promise.all(promises)
    console.log(answers)
    ctx.body = { data: answers }
  }
}

const list = async (ctx, next) => {
  const { id } = ctx.request.query
  const que = await knex('qa_que').where({ id: id }).first()
  const ansList = await knex('qa_ans').where({ q_id: id })
  let list = []
  ansList.forEach((ans, index, array) => {
    list.push({ id: ans.id, content: ans.content })
  })
  ctx.body = { data: { que, list} }
}

module.exports = { addWithImage, addWithoutImage, list, hotAnsList }