const fs = require('fs');
let content = fs.readFileSync('src/pages/index.astro', 'utf8');

const oldArrayStr = '["微风网络", "飞猫云", "萤火虫 (FireFly)", "无忧链接", "跨界云", "灵猫", "闪跃"]';
const newArrayStr = '["微风网络", "飞猫云", "萤火虫 (FireFly)", "无忧链接", "跨界云", "灵猫", "闪跃", "九云", "宝云", "神行加速"]';

content = content.replace(new RegExp(oldArrayStr.replace(/[\[\]\(\)\"]/g, '\\$&'), 'g'), newArrayStr);

fs.writeFileSync('src/pages/index.astro', content);
console.log('Updated featured brands list.');
