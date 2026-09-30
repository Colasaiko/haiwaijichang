const fs = require('fs');

let c = fs.readFileSync('src/content/brands/weifeng.md', 'utf8');

c = c.replace(/---\r?\n/, `---\nheroDescription: "微风网络 Breeze Network 提供全 IPLC 专线、多档流量套餐与不限时流量包，不限速且不限制设备同时接入。当前官网全场套餐可使用优惠码 weifeng90 享受 7 折优惠。"\nkeywords:\n  - 微风网络\n  - 微风网络怎么样\n  - 微风网络价格\n  - 微风网络套餐\n  - 微风网络优惠码\n  - 微风网络 IPLC\n  - 微风网络 VLESS\n  - 2026机场推荐\n  - 专线机场\n`);

fs.writeFileSync('src/content/brands/weifeng.md', c);
console.log('Fixed weifeng.md safely');
