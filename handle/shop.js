const { exsist, uploadItem } = require("./sql");

class SHOP{
    shop_id;
    constructor(xuid){
        if(exsist(xuid).has){
            this.shop_id = xuid;
        }else{
            throw new Error("没有这个店铺");
        }
    }
    uploadItem(itemObj,snbt,name,price){
        return uploadItem(xuid,itemObj,snbt,name,price);
    }
    getInfo(){

    }
    sell(){
        
    }
}