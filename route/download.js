const express = require('express');
const router = express.Router();
const sql = require('../handle/sql');

router.post('/download',(req,res)=>{
    const {xuid,token,item_id,count} = req.body;
    if(sql.exsist(xuid).has==false){
        res.json({code:401,msg:'login first!'});
        return;
    }
    if(token != get(xuid).token){
        res.json({code:401,msg:'client ket not right'});
        return;
    }
    if(xuid &&  item_id && count){
        sql.removeCount(xuid,item_id,count);
        res.json({code:0,success:true});
    }else{
        res.json({code:402,success:false,msg:'参数缺失'});
    }
});

module.exports = router;