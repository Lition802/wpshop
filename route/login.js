const express = require('express');
const { update } = require('../handle/cookie');
const { decrypt } = require('../handle/pwd_protect');
const router = express.Router();
const { pwd_right } = require('../handle/sql');

router.post('/login',(req,res)=>{
    const {xuid,pwd} = req.body;
    let raw = decrypt(pwd);
    if(pwd_right(xuid,pwd)){
        res.json({
            code:0,
            success:true,
            token: update(xuid)
        })
    }else{
        res.json({code:444,msg:"pwd not right"});
    }
});

module.exports = router;