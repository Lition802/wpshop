const express = require('express');
const router = express.Router();
const sql = require('../handle/sql');

router.post('/setiteminfo',(req,res)=>{
    const {xuid,token,item_id,count,icon} = req.body;
    if(token != get(xuid).token){
        res.json({code:401,msg:'client ket not right'});
        return;
    }
    if(item_id){
        if(count){
            sql.setiteminfo(xuid,item_id,0,count);
            res.json({code:0,success:true});
        }
        if(icon){
            sql.setiteminfo(xuid,item_id,1,count);
            res.json({code:0,success:true});
        }else{
            res.json({code:444,msg:'数据缺失'});
        }
    }else{
        res.json({code:444,msg:'数据缺失'});
    }
})

module.exports = router;