let mongoose = require('mongoose');
require('./db');//相当于是复制db.js中的代码到这个位置

// 创建集合规则
let UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    sex: {
        type: String
    },
    age: {
        type: String
    },
    phone: {
        type: String
    },
    pic: {
        type: String
    }
})

// 使用集合规则创建集合
let Users = mongoose.model('Users', UserSchema);

// 暴露内容
module.exports = {
    Users
}