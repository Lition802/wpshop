class SHOP {
    url;
    constructor(url) {
        this.url = url;
    }
    get_shop_list(callback) {
        axios(url + '/shop_list').then(res => {
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
    #cookie;
    has_login = false;
    constructor(url,xuid){
        this.xuid = xuid;
        this.url = url;
    }
    login(pwd,callback){
        let send_pwd = pwd;// 请自行实现加密方法
        axios.post(url+'/login',{xuid,pwd:send_pwd}).then(res=>{
            const { status, statusText, data } = res;
            if(data.code == 0){this.#cookie = data.data.cookie;this.has_login = true;}
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
}