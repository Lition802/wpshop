class SHOP {
    url;
    constructor(url) {
        this.url = url;
    }
    get_shop_list(callback) {
        axios(this.url + '/shop_list').then(res => {
            const { data } = res;
            callback(null, data);
        }).catch(err => {
            callback(err, null);
        })
    }
    get_shop_item(shopid, callback) {
        axios(this.url + '/shop_item/' + shopid).then(res => {
            const { status, statusText, data } = res;
            callback(null, data);
        }).catch(err => {
            callback(err, null);
        })
    }
    get_shop_info(xuid, callback) {
        axios.get(this.url + '/shopinfo/' + xuid).then(res => {
            const { status, statusText, data } = res;
            callback(null, data);
        }).catch(err => {
            callback(err, null);
        })
    }
}

class User{
    xuid;
    url;
    constructor(url){
        this.url = url;
    }
    async(token,callback){
        axios.get(this.url+'/async/'+token).then(res=>{
            const { status, statusText, data } = res;
            if(data.code == 0){this.xuid = data.xuid};
            callback(null, data);
        }).catch(err=>{
            callback(err,null);
        })
    }
    login(xuid,pwd,callback){
        this.xuid = xuid;
        let send_pwd = pwd;// 请自行实现加密方法
        axios.post(this.url+'/login',{xuid:this.xuid,pwd:send_pwd}).then(res=>{
            const { status, statusText, data } = res;
            callback(null, data);
        }).catch(err=>{
            callback(err,null);
        })
    }
    get_all_item(callback){
        axios(url+'/shop_item/'+this.xuid).then(res=>{
            const { status, statusText, data } = res;
            callback(null,data);
        }).catch(err=>{
            callback(err,null);
        })
    }
    set_item_info(item_id,type,data,token,callback){
        let postdata = {item_id,xuid:this.xuid,token};
        switch(type){
            case 'count':
                postdata.count = data;
                break;
            case 'icon':
                postdata.icon = data;
                break;
        }
        axios(this.url+'/setiteminfo',postdata).then(res=>{
            const { status, statusText, data } = res;
            callback(null,data);
        }).catch(err=>{
            callback(err,null);
        })
    }
}
