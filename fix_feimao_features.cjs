const fs = require('fs');

let c = fs.readFileSync('src/content/brands/feimao.md', 'utf8');

c = c.replace(/order: 2/, `order: 2\nfeatures:\n  - "全 IPLC 专线"\n  - "官方标称最高 2.5Gbps"\n  - "不限制设备数量"\n  - "原生 IP 与 VLESS"\n`);

fs.writeFileSync('src/content/brands/feimao.md', c);
console.log('Fixed features in feimao.md');
