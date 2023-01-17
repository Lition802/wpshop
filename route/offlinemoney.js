const e = require('express');
const express = require('express');
const { get } = require('../handle/cookie');
const router = express.Router();
const sql = require('../handle/sql');

router.post('/offlinemoney',(req,res)=>{
    let {xuid,token} = req.body;
    if(token == get(xuid).token){
        try{
            sql.db.prepare(`UPDATE SHOPS SET TOTAL=0 WHERE OWNER=@xuid`).run({xuid});
            res.json({code:0})
        }catch{
            res.json({code:404});
        }
    }else{
        res.json({code:401,msg:'client ket not right'});
    }

});

module.exports = router;