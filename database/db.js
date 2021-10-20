let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/haogu').then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log('连接失败');
});