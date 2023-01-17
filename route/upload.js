const express = require('express');
const { uploadItem } = require('../handle/sql');
const router = express.Router();


router.post('/upload',(req,res)=>{
    const {name,price,snbt,itemobj,xuid} = req.body;
    if(price&& snbt&& itemobj){
        uploadItem(xuid,itemobj,snbt,price);
        console.log(itemobj);
        res.json({code:0,success:true});
    }else{
        res.json({code:444,success:false,msg:'数据缺失'})
    }
});

module.exports = router;