const fs = require('fs');

const file = 'src/utils/coupon.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("coupon.discountPercent.match(/(\\\\d+)/)", "coupon.discountPercent.match(/(\\d+)/)");

fs.writeFileSync(file, content);
console.log('Fixed regex in coupon.js');
