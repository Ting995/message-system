let express = require('express');
let loginController = require('../../controller/user-controller/login.js')
let router = new express.Router();

// 登录
router.get('/login', loginController.Login);
// 登录提交数据
router.post('/dologin', loginController.DoLogin);
// 注册
router.get('/register', loginController.Register);
// 注册提交数据
router.post('/doregister', loginController.DoRegister);
// 用户列表
router.get('/userlist', loginController.UserList);
// 删除用户
router.get('/deleuser', loginController.UserDelete);

// 修改用户
router.get('/useredit', loginController.UserEdit);
// 修改用户提交数据
router.post('/douseredit', loginController.DoUserEdit);

// 渲染搜索页面
router.get('/usersearch', loginController.UserSearch);

// 渲染添加用户页面
router.get('/useradd', loginController.UserAdd)

// 点击添加按钮
router.post('/douseradd', loginController.DoUserAdd)


module.exports = router;