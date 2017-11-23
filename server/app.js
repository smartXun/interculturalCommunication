const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const cors = require('koa-cors')
const router = require('./routes')

app.use(cors());
app.use(response)
app.use(bodyParser())
app.use(router.routes())

app.listen(config.port, () => debug(`listening on port ${config.port}`))
