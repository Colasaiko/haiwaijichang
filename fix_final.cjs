const fs = require('fs');

// 1. Fix yifan.md
let yf = fs.readFileSync('src/content/brands/yifan.md', 'utf8');
yf = yf.replace(/trafficReset: "常规套餐每30天重置；不限时包长期有效不重置"/, 'trafficReset: "不限时包长期有效，不自动重置；常规套餐刷新规则以当前官方后台为准"');
fs.writeFileSync('src/content/brands/yifan.md', yf);

// 2. Fix checker script
let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
checker = checker.replace("console.log('COUPON CONSISTENCY: ' + (errors === 0 ? 'PASS' : 'FAIL'));", "");
fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
