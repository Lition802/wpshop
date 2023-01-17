const express = require('express');
const sql = require('./handle/sql')
const config = require('./config.json');

const app = express();
// 解析此应用程序的 JSON 数据。确保在路由处理程序之前放置 app.use(express.json())
app.use(express.json());

const register = require('./route/register');
const upload = require('./route/upload');
const shop_list = require('./route/shoplist');
const shop_item = require('./route/shopitem');
const login = require('./route/login');
const getshopinfo = require('./route/shopinfo_g');
const setshopinfo = require('./route/shopinfo_p');
const buy = require('./route/buy');
const offlinemoney = require('./route/offlinemoney')

app.post('/register',register);
app.post('/upload',upload);
app.get('/shop_list',shop_list);
app.get("/shop_item/:xuid",shop_item);
app.post('/login',login);
app.post('/shopinfo/:shopid',setshopinfo);
app.get('/shopinfo/:shopid',getshopinfo);
app.post('/buy',buy);
app.post('/offlinemoney',offlinemoney)

if (config.allow_cros) {
    //设置允许跨域访问该服务.
    app.all('*', (req, res, next)=> {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Content-Type', 'application/json;charset=utf-8');
        next();
    });
}

app.get('*', (req, res)=> {
    res.json({code:404,msg:"api not found"});
});


app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`));