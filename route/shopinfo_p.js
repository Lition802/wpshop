const express = require('express');
const { get } = require('../handle/cookie');
const { setshopinfo } = require('../handle/sql');

const router = express.Router();

router.post('/shopinfo/:shopid',(req,res)=>{
    let {token,name,desc,xuid} = req.body;
    let id = req.params.shopid;
    if(token != get(xuid).token){
        res.json({code:401,msg:'client ket not right'});
        return;
    }
    if(name,desc,xuid){
        setshopinfo(xuid,name,desc);
        res.json({code:0,success:true});
    }else{
        res.json({code:444,msg:'数据缺失'});
    }
})

module.exports = router;