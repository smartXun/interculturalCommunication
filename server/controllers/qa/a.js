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

let hotAnswers = [];
const updateHotAns = async (ctx, next) => {
  let answers = await knex('qa_ans').orderBy('like_num', 'desc').limit(20)
  const que_promises = answers.map((ans, index, array) => {
    return knex('qa_que').where({ id: ans.q_id }).first().then((que) => {
      ans.que = que.content
    })
  })
  // const userAvatar_promises = answers.map((ans, index, array) => {
  //   return knex('qa_que').where({ id: ans.q_id }).first().then((que) => {
  //     ans.que = que.content
  //   })
  // })
  const promises = que_promises.concat([])
  await Promise.all(promises)
  if (!answers || answers.length < 20) {
    const questions = await knex('qa_que').orderBy('create_time', 'desc').limit(20)
    let list = questions.filter((item) => {
      return !answers.some((ans) => {
        return ans.q_id == item.id
      })
    }).map((que) => {
      return { q_id: que.id, que: que.content, create_time: que.create_time }
    })
    hotAnswers = answers.concat(list)
  } else {
    hotAnswers = answers
  }
}

const hotAnsList = async (ctx, next) => {
  if (!hotAnswers || hotAnswers.length <= 0) {
    await updateHotAns()
  }
  ctx.body = { data: hotAnswers }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  let ans = await knex('qa_ans').where({ id: id }).first()
  const ansUser = await knex('mUser').where({ 'u_id': ans.user_id }).first()
  ans.user = { name: ansUser.name, userAvatar: ansUser.image_url }
  const que = await knex('qa_que').where({ id: ans.q_id }).first()
  // let commentList = await knex('qa_ans_comment').where({ q_id: id })
  // const promises = commentList.map((comment, index, array) => {
  //   return knex('mUser').where({ 'u_id': comment.user_id }).first().then((user) => {
  //     comment.userAvatar = user.image_url
  //   })
  // })
  // await Promise.all(promises)
  ctx.body = { data: { que, ans } }
}

module.exports = { addWithImage, addWithoutImage, hotAnsList, updateHotAns, item }