const express = require('express');
const { allShop } = require('../handle/sql');
const router = express.Router();

router.get("/shop_list",(req,res)=>{
    res.json({code:0,data:allShop()});
})

module.exports = router;