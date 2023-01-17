const stringRandom = require('string-random');
const {db} = require('./sql');

function update(xuid){
    let ck = stringRandom(8);
    if(get(xuid).success){
        
        db.prepare(`UPDATE COOKIES SET CK = @ck WHERE XUID = @xuid;`).run({xuid,ck});
    }else{
        db.prepare(`INSERT INTO COOKIES VALUES(@xuid,@ck);`).run({xuid,ck});
    }
    return ck;
}

function get(xuid){
    let rt = db.prepare(`SELECT CK FROM COOKIES WHERE XUID = @xuid;`).all({xuid});
    if(rt.length == 0){
        return {success:false}
    }else{
        return {success:true,token:rt[0].CK};
    }
}

module.exports = {update,get};