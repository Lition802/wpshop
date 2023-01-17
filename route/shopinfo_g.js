const express = require('express');
const { getshopinfo, getAllItem } = require('../handle/sql');

const router = express.Router();

router.get('/shopinfo/:shopid',(req,res)=>{
    let id = req.params.shopid;
    let info = getshopinfo(id);
    if(info.success){
        let {desc,name,owner,total} = info.data;
        res.json({code:0,data:{items:getAllItem(id),desc,owner,name,total}});
    }else{
        res.json({code:404,msg:info.msg})
    }
})

module.exports = router;