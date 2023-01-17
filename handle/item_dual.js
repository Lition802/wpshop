
const csv = require('csvtojson');
let itemtable = {};

csv().fromFile('./McItemIcon.csv').then((json) => {
    console.log('读取了', json.length, '条物品数据');
    buildTable(json);
});

function buildTable(json) {
    json.forEach(element => {
        itemtable[element.type] = {
            aux: Number(element.aux),
            cnName: element.cnName
        }
    });
}

function type2name(type) {
    try {
        return itemtable[type].cnName ?? type;
    } catch {
        return type;
    }

}

function iconbridge(type) {
    return 'textures/ui/check';
}

function parseEnch(tag) {
    return JSON.stringify(tag.ench);
}

function stringifyEnch(ench) {
    let msg = '';
    console.log(ench);
    for (const e of JSON.parse(ench)) {
        msg += `\n${[
            "保护",
            "火焰保护",
            "摔落保护",
            "爆炸保护",
            "弹射物保护",
            "荆棘",
            "水下呼吸",
            "深海探索者",
            "水下速掘",
            "锋利",
            "亡灵杀手",
            "节肢杀手",
            "击退",
            "火焰附加",
            "抢夺",
            "效率",
            "精准采集",
            "耐久",
            "时运",
            "力量",
            "冲击",
            "火矢",
            "无限",
            "海之眷顾",
            "饵钓",
            "冰霜行者",
            "经验修补",
            "绑定诅咒",
            "消失诅咒",
            "穿刺",
            "激流",
            "忠诚",
            "引雷",
            "多重射击",
            "穿透",
            "快速装填",
            "灵魂疾行",
            "迅捷潜行",
        ][e.id]
            } ${e.lvl}`;
    }
    return msg;
}

function stringifyPotion(potion) {
    return '[]';
}

module.exports = {
    iconbridge,
    parseEnch,
    stringifyEnch,
    type2name,
    stringifyPotion
}