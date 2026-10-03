const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
const s = c.indexOf('JILIAN PREMIUM MONTHLY: PASS');
console.log(c.substring(s, s + 3000));
