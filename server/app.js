const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('Cross-culture')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const cors = require('koa2-cors')
const router = require('./routes')
const serve = require('koa-static');

app.use(cors());
app.use(response)
app.use(bodyParser({
  "formLimit": "5mb",
  "jsonLimit": "5mb",
  "textLimit": "5mb"
}))
app.use(router.routes())

app.use(serve(__dirname + '/public/'));

app.listen(config.port, () => debug(`listening on port ${config.port}`))
