const path = require('path')
const router = require('koa-router')({ prefix: '/weapp' })
const controllers = require('../controllers')
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

//账号密码小程序登录
router.post('/login_wechat', controllers.auth.wechat)
router.post('/login_local', controllers.auth.local.login)
router.post('/register_local', upload.single('file'), controllers.auth.local.register)
router.get('/user_info', auth, controllers.auth.userInfo)

router.get('/qalist', controllers.qa.list)
router.put('/qa/q/addWithImage', upload.single('file'), controllers.qa.q.addWithImage)
router.put('/qa/q/addWithoutImage', controllers.qa.q.addWithoutImage)

router.get('/forumlist', controllers.forum.list)

module.exports = router
