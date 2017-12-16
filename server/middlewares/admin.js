const debug = require('debug')('Cross-culture')
const conf = require('../config.js')
const jwt = require('jsonwebtoken')
const knex = require('../knex.js')

module.exports = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
    if (decoded.id) {
      const user = await knex('aUser').where({ u_id: decoded.id }).first()
      ctx.request.user = user
      await next()
    } else {
      ctx.body = { code: -2, message: 'token invalid' }
    }
  } else {
    ctx.body = { code: -2, message: 'User authentication failed' }
  }
}