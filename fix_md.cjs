const fs = require('fs');
let c = fs.readFileSync('src/content/brands/guangnian.md', 'utf8');

c = c.replace(/heroDescription:[\s\S]*?(?=\n\w+:|\n---)/g, 'heroDescription: "光年梯提供全程IPLC专线、原生IP，官方标示最高2.5Gbps。当前暂无已确认常驻优惠码，双节期间提供GNTHP80与GNTHP85活动优惠，适用于对应常规周期及已实测的私人专线。"');

fs.writeFileSync('src/content/brands/guangnian.md', c);
