const express = require('express');
const router = express.Router();
const sql = require('../handle/sql');

router.post('/buy',(req,res)=>{
    console.log(req.body)
    const {xuid,target,item_id,count} = req.body;
    if(sql.exsist(xuid).has==false){
        res.json({code:401,msg:'login first!'});
        return;
    }
    if(sql.exsist(target).has == false){
        res.json({code:404,msg:'target not found'});
        return;
    }
    if(xuid && target && item_id && count){
        let all_item = sql.getAllItem(target);
        for(let i in all_item){
            if(all_item[i].id == item_id){
                if(all_item[i].count >= count){
                    sql.removeCount(target,item_id,count);
                    sql.addBill(xuid,target,all_item[i].type,count,all_item[i].price);
                    sql.addTotal(xuid,count*all_item[i].price);
                    res.json({code:0,success:true});
                    return;
                }else{
                    // 云端数量不足
                    res.json({code:0,success:false});
                    return;
                }
            }
        }
        res.json({code:404,msg:"目标物品未找到"});
    }else{
        res.json({code:402,success:false,msg:'cloud count not enough'});
    }
});

module.exports = router;