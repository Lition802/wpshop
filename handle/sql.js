const Database = require("better-sqlite3");
const config = require("../config.json");
const { parseEnch, iconbridge, stringifyEnch, type2name, stringifyPotion } = require("./item_dual");

const db = new Database('./data.sqlite', { verbose: console.log });

db.exec(`CREATE TABLE IF NOT EXISTS USERS(
    ID  INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT,
    XUID TEXT,
    PWD TEXT,
    XP INT
);`);

db.exec(`CREATE TABLE IF NOT EXISTS SHOPS(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT,
    DESC TEXT,
    OWNER TEXT,
    TOTAL INT,
    ICON TEXT
);`);

db.exec(`CREATE TABLE IF NOT EXISTS BILL(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    INITIATOR TEXT,
    RECIPIENT TEXT,
    INFO TEXT,
    FUND INT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS COOKIES(
    XUID TEXT,
    CK TEXT
)`);

function register(xuid,name,pwd){
    let {pname} = exsist(xuid);
    if(pname){
        return {success:false,msg:'already register!'};
    }else{
        db.prepare(`INSERT INTO USERS VALUES(NULL,@name,@xuid,@pwd,0);`).run({name,pwd,xuid});
        setup(xuid);
        return {success:true}
    }
}

function exsist(xuid){
    let  re = db.prepare(`SELECT NAME FROM USERS WHERE XUID = @xuid;`).all({xuid});
    if(re.length > 0){
        return {has:true,name:re[0].NAME};
    }else{
        return {has:false};
    }
}

function setup(xuid){
    //创建商店，通常是注册成功之后立即创建
    let {name} = exsist(xuid);
    if(name){
        db.exec(`CREATE TABLE "${xuid}"(
            ID INTEGER PRIMARY KEY,
            NAME TEXT,
            TYPE TEXT,
            SNBT TEXT,
            COUNT INT,
            PRICE INT,
            ENCH TEXT,
            POTION TEXT,
            ICON TEXT
        );`);
        // 设置商店信息
    
        let {shop_name,shop_desc} = config.default;
        db.prepare(`INSERT INTO SHOPS VALUES(NULL,@name,@desc,@xuid,0,"textures/items/book_portfolio.png")`).run({xuid,name:shop_name.replace("{name}",name),desc:shop_desc.replace('{name}',name)});
        return true;
    }else{
        return false;
    }

    // 也许不会失败
}

function uploadItem(xuid,itemObj,snbt,price){
    const {type,count} = itemObj;
    let  name = type2name(type);
    let potion = stringifyPotion(itemObj);
    // 同种东西合并先不做,等都写完在做
    // let all = getAllItem(xuid);

    db.prepare(`INSERT INTO "${xuid}" VALUES(NULL,@name,@type,@snbt,@count,@price,@ench,@potion,@icon);`).run({name,type,snbt,count,price,potion,ench:parseEnch(itemObj),icon:iconbridge(type)});
    return true;
}

function getAllItem(xuid){
    return db.prepare(`SELECT * FROM "${xuid}"`).all().map(formatItem);
}

function formatItem(data){
    return {
        id:data.ID,
        count:data.COUNT,
        name:data.NAME,
        price:data.PRICE,
        snbt:data.SNBT,
        raw:data.RAW,
        type:data.TYPE,
        icon: data.ICON,
        ench: stringifyEnch(data.ENCH)
    };
}

function allShop(){
    const all = db.prepare(`SELECT * FROM SHOPS;`).all().map(formatShop);
    return all;
}

function removeCount(xuid,item_id,count){
    let has = db.prepare(`SELECT PRICE,COUNT FROM "${xuid.toString()}" WHERE ID=@item_id;`).all({item_id});
    if(has.length == 0){
        return {success:false,msg:'id not found'};
    }
    let has_count = has[0].COUNT;
    let price = has[0].PRICE;
    total = count*price;
    if(has_count == count){
        // 等于
        db.prepare(`DELETE FROM "${xuid}" WHERE ID=@item_id;`).run({item_id});

        return {success:true};
    }else if (has_count > count){
        // 大于
        db.prepare(`UPDATE "${xuid}" SET COUNT=COUNT-@count WHERE ID=@item_id;`).run({count,item_id});
        addTotal(xuid,total);
        return {success:true};
    }else{
        //小于
        return {success:false,msg:'max!'};
    }
}

function formatShop(data){
    let all_item = getAllItem(data.OWNER);
    return {
        id:data.ID,
        name: data.NAME,
        desc:data.DESC,
        owner: data.OWNER,
        count: all_item.length,
        total: data.TOTAL,
        icon: data.ICON
    }
}

function addTotal(xuid,count){
    db.prepare(`UPDATE SHOPS SET TOTAL=TOTAL+@count WHERE OWNER=@xuid;`).run({count,xuid});
}

function addBill(custom,target,type,count,price){
    db.prepare(`INSERT INTO BILL VALUES(NULL,@custom,@target,@info,@money);`).run({
        custom,target,info:type+"*"+count,money:price
    });
    addTotal(target,count*price);
}

function pwd_right(xuid,pwd){
    let rt = db.prepare(`SELECT XUID FROM USERS WHERE PWD=@pwd;`).all({pwd});
    return rt[0].XUID == xuid;
}

function getshopinfo(xuid){
    if(exsist(xuid).has){
        return {success:true,data:formatShop(db.prepare(`SELECT * FROM SHOPS WHERE OWNER = @xuid;`).all({xuid})[0])};
    }else{
        return {success:false,msg:'not find'};
    }
}

function setshopinfo(xuid,name,desc){
    if(exsist(xuid).has){
        db.prepare(`UPDATE SHOPS SET NAME = @name, DESC = @desc WHERE OWNER = @xuid`).run({xuid,name,desc});
        return {success:true};
    }else{
        return {success:false,msg:'not find'};
    }
}

function setiteminfo(xuid,item_id,type,data){
    switch(type){
        case 0:
            db.prepare(`UPDATE "${xuid}" SET COUNT=@data WHERE ID = @item_id;`).run({data,item_id});
            break;
        case 1:
            db.prepare(`UPDATE "${xuid}" SET ICON=@data WHERE ID = @item_id;`).run({data,item_id});
            break;
    }
}

// {Count:1,Damage:0,Name:minecraft:stone_sword,WasPickedUp:0,tag:{Damage:0}}
// {Count:64,Damage:0,Name:minecraft:donkey_spawn_egg,WasPickedUp:0}

// {Count:1,Damage:0,Name:minecraft:enchanted_book,WasPickedUp:0,tag:{ench:[{id:1,lvl:4},<Null>]}}
// {"Count":1b,"Damage":0s,"Name":"minecraft:enchanted_book","WasPickedUp":0b,"tag":{"ench":[{"id":1s,"lvl":4s}]}}
// {Count:10,Damage:0,Name:minecraft:leather,WasPickedUp:0}
// {"Count":10b,"Damage":0s,"Name":"minecraft:leather","WasPickedUp":0b}
module.exports = {
    db,
    exsist,
    register,
    getAllItem,
    uploadItem,
    allShop,
    removeCount,
    pwd_right,
    getshopinfo,
    setshopinfo,
    addBill,
    addTotal,
    setiteminfo
}