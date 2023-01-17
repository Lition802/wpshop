const express = require('express');
const router = express.Router();
const sql = require('../handle/sql');

router.post('/register',(req,res)=>{
    const {xuid,name,pwd} = req.body;
    if(xuid && name && pwd){
        let rt =  sql.register(xuid,name,pwd);
        res.json({code:0,success:rt.success,msg:rt.msg});
    }else{
        res.json({code:444,msg:'数据缺失'});
    }
});

module.exports = router;