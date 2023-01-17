const express = require('express');
const { getAllItem, exsist } = require('../handle/sql');
const router = express.Router();

router.get("/shop_item/:xuid",(req,res)=>{
    let xuid = req.params.xuid;
    if(exsist(xuid).has){
        res.json({code:0,data:getAllItem(xuid)});
    }else{
        res.json({code:404,msg:"用户未找到"});
    }
})

module.exports = router;