let express = require('express');
let ejs = require('ejs');
let bodyParser = require('body-parser')//解析通过post方法提交过来的文本数据
let session = require('express-session')
let userRouter = require('./routes/users')
let app = new express('');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 配置session
app.use(session({
    secret: 'this is a mimi',//用来加密的
    resave: false,//强制保存session，即使session没有变化也要强制保存
    saveUninitialized: true,//强制将为初始化的session存储
    cookie: {   //cookie过期了，session就自动消失
        maxAge: 30 * 60 * 1000
    },
    rolling: true  //重新记录session的过期时间
}))

// 配置模板引擎
app.set('view engine', 'ejs');
// 配置模板路径
app.set('views', __dirname + '/views')
// 配置静态资源目录
app.use(express.static('public'));
// 配置虚拟目录
app.use('/api', express.static('public'))

// 应用级中间件--拦截路由
// 不让用户注册（后台管理系统一般不开放注册）
// 也可以开放注册
app.use((req, res, next) => {
    // http://localhost:3000/api/login
    if (req.url != "/api/login" && req.url != "/api/dologin" && req.url != "/api/register" && req.url != "/api/doregister" && !req.session.username) {
        console.log(req.session.username)
        res.redirect('/api/login')
    } else {
        next()
    }
})

app.use('/api', userRouter);

app.listen(3000, () => {
    console.log('3000running');
})