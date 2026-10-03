const fs = require('fs');

// 1. Update guangnian.md
let g = fs.readFileSync('src/content/brands/guangnian.md', 'utf8');

g = g.replace('title: "独享私人专线节点"', 'name: "独享私人专线节点"\n    lineType: "IEPL"\n    ipType: "独立公网IP"');
g = g.replace('当前支持无常驻优惠', '当前暂无已确认常驻优惠码，双节期间提供GNTHP80与GNTHP85活动优惠。');

fs.writeFileSync('src/content/brands/guangnian.md', g);
