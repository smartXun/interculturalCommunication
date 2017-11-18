const path = require('path')
const router = require('koa-router')({ prefix: '/weapp' })
const controllers = require('../controllers')
// const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')
const auth = require('../middlewares/auth.js')

const multer = require('koa-multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname, '../uploads/')) },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});  
const upload = multer({ storage: storage })

// --- 登录与授权 Demo --- //
// 登录接口
// router.get('/login', authorizationMiddleware, controllers.auth.wechat)
// 用户信息接口（可以用来验证登录态）
// router.get('/user', validationMiddleware, controllers.user)
//账号密码小程序登录
router.post('/login_local', controllers.auth.local.login)
router.post('/register_local', upload.single('file'), controllers.auth.local.register)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

module.exports = router
