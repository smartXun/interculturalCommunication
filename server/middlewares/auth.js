const debug = require('debug')('Cross-culture')
const conf = require('../config.js')
const jwt = require('jsonwebtoken')
const knex = require('../knex.js')

module.exports = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    try {
      const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
      const user = await knex('mUser').where({ u_id: decoded.id }).first()
      ctx.request.user = user
      await next()
    } catch (err) {
      if (err.name == "TokenExpiredError"){
        ctx.body = { code: -1, message: 'TokenExpired' }
      }
    }
  } else {
    ctx.body = { code: -1, message: 'User authentication failed' }
  }
}