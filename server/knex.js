const { mysql: config } = require('./config.js')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.pass,
    database: "crossculture",
    charset: config.char,
    multipleStatements: true
  }
});

module.exports = knex