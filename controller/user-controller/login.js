// 渲染登录页面的
let md5 = require('md5');//加密模块
// cnpm install formidable --save  //接收post提交的文件数据
let formidable = require('formidable');
let path = require('path')
let { Users } = require('../../database/user');
exports.Login = (req, res) => {
    res.render('admin/login')
}

// 点击登录按钮提交数据
exports.DoLogin = async (req, res) => {
    // console.log(req.body);
    let username = req.body.username;
    let password = md5(req.body.password);
    // 登录前先判断用户是否存在，如果存在,判断密码是否正确
    let isUserName = await Users.findOne({
        username: username
    });
    let isUserPassword = await Users.findOne({
        username: username,
        password: password
    });
    if (!isUserName) {
        res.send('<script>alert("该用户不存在");location.href="/api/register"</script>')
    } else if (!isUserPassword) {
        res.send('<script>alert("用户名或密码错误");location.href="/api/register"</script>')
    } else {
        req.app.locals.username = username//全局存储了一个用户名，在其他ejs模板中都可以使用
        req.session.username = username;//创建一条session
        res.redirect('/api/userlist')
    }
}

// 渲染注册页面
exports.Register = (req, res) => {
    res.render('admin/register')
}

// 点击注册按钮提交数据
exports.DoRegister = async (req, res) => {
    const form = new formidable.IncomingForm()
    // 将上传的文件存放在public目录下的upload文件中
    form.uploadDir = path.join(__dirname, '../', '../', 'public', 'upload')
    // 保存后缀名
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        console.log(files);
        let isUser = await Users.findOne({
            username: fields.username
        })
        if (!isUser) {
            let result = await Users.create({
                username: fields.username,
                password: md5(fields.password),
                phone: fields.phone,
                age: fields.age,
                sex: fields.sex,
                phone: fields.phone,
                pic: files.pic.path.split('public')[1]
            })
            if (result) {
                res.redirect('/api/login')
            }
        } else {
            res.send('<script>alert("该用户已存在");location.href="/api/login"</script>')
        }

    })
    // console.log(req.body);//获取post方式提交的的文本数据  { username: 'hehehhe', password: '123456' }
    // let username = req.body.username;
    // // let password = md5(req.body.password);//对密码进行加密
    // let age = req.body.age
    // let sex = req.body.sex
    // // console.log(req.body);

    // // 注册先判断数据库中是否存在用户，如果有提示该用户已存在，直接登录，否则直接注册
    // let isUser = await Users.findOne({
    //     username: username
    // })
    // if (!isUser) {
    //     let userInfo = {
    //         username: username,
    //         password: password,
    //         age: req.body.age,
    //         phone: req.body.phone,
    //     };
    //     let result = await Users.create(userInfo);
    //     if (result) {
    //         res.redirect('/api/login')//redirect：重定向
    //     };
    // } else {
    // res.send('<script>alert("该用户已存在");location.href="/api/login"</script>')

    // }
    // Users.create(userInfo).then((result) => {
    //     if (result) {
    //         res.redirect('/api/login')
    //     }
    // })
}

// 用户列表
exports.UserList = async (req, res) => {
    // http://localhost:3000/admin/userlist?page=1&size=10
    // page  当前请求的页数
    // size  每一页显示的数据条数
    // console.log(req.query);//{page=1&size=10}
    let page = Number(req.query.page) || 1;
    let size = Number(req.query.size) || 5;

    // 查询总的数据条数
    let totalUsers = await Users.countDocuments({});
    // 计算总的页数
    let totalPages = Math.ceil(totalUsers / size);
    // 分页查询数据
    let result = await Users.find({}).skip((page - 1) * size).limit(size);
    // console.log(result);
    // res.json({
    //     data: result
    // })

    res.render('admin/user/userlist', {
        userListDatas: result,
        total: totalUsers,
        page: page,
        size: size,
        totalPages: totalPages
    });
}

// 删除用户
exports.UserDelete = async (req, res) => {
    let { id } = req.query;//{id:616a249c6e369332cc7ddec0}
    if (id != '616a28a00d427054d159956c') {
        let result = await Users.findOneAndDelete({
            "_id": id
        });
        if (result) {
            res.redirect('/api/userlist')
        }
    } else {
        res.send('<script>alert("你没有权限删除");location.href="/api/login"</script>')
    }

}
// 修改用户
exports.UserEdit = async (req, res) => {
    console.log(req.query)
    let { id } = req.query;
    let result = await Users.findOne({
        _id: id
    })
    res.render('admin/user/useredit', {
        editData: result
    })
}

// 点击修改按钮
exports.DoUserEdit = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.uoloadDir = path.join(__dirname, '../', '../', 'public', 'upload')
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        console.log(fields);
        console.log(files);
        // let { username, password } = req.body
        // let result = await Users.updateOne({
        //     _id: req.query.id
        // }, {
        //     username: username,
        //     password: md5(password)
        // })
        let result = await Users.updateOne({
            _id: req.query.id
        }, {
            username: fields.username,
            password: md5(fields.password),
            phone: fields.phone,
            age: fields.age,
            sex: fields.sex,
            phone: fields.phone,
            pic: files.pic.path.split('public')[1]
        })
        if (result) {
            res.redirect('/api/userlist')
        }
    })

}

// 搜索
exports.UserSearch = async (req, res) => {
    let keywords = req.query.keywords;
    let page = Number(req.query.page) || 1;
    let size = Number(req.query.size) || 5;
    // 查询总的数据条数 
    let totalUsers = await Users.countDocuments({
        username: new RegExp(keywords, 'gi')
    });
    // 计算总的页数
    let totalPages = Math.ceil(totalUsers / size);
    // 分页查询数据
    let result = await Users.find({
        username: new RegExp(keywords, 'gi')
    }).skip((page - 1) * size).limit(size);

    res.render('admin/user/userlist', {
        userListDatas: result,
        total: totalUsers,
        page: page,
        size: size,
        totalPages: totalPages
    });
};

// 渲染添加用户页面
exports.UserAdd = async (req, res) => {
    res.render('admin/user/useradd')
}

exports.DoUserAdd = async (req, res) => {
    // 创建一个表单解析对象
    // const form = formidable({ multiples: true })//上传多个文件使用
    const form = new formidable.IncomingForm()

    // 将上传的文件存放在public目录下的upload文件中
    form.uploadDir = path.join(__dirname, '../', '../', 'public', 'upload')
    // 保存后缀名
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        // console.log(fields);//文本 数据
        // console.log(files);//文件数据
        // console.log(files.pic.path.split('public')[1]);
        let result = await Users.create({
            username: fields.username,
            password: md5(fields.password),
            phone: fields.phone,
            sex: fields.sex,
            age: fields.age,
            pic: files.pic.path.split('public')[1]
        })
        if (result) {
            res.redirect('/api/userlist')
        }
    })
}