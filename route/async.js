const express = require('express');
const { get, getxuid } = require('../handle/cookie');
const { db, exsist } = require('../handle/sql');
const router = express.Router();
router.get('/async/:token',(req,res)=>{
    let token = req.params.token;
    let user = getxuid(token);
    if(user.success){
        let name = exsist(user.xuid).name;
        res.json({
            code:0,
            success:true,
            xuid:user.xuid,
            name
        })
    }else{
        res.json({
            code:404
        });
    }
})
module.exports = router;