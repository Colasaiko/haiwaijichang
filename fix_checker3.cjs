const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const s = c.indexOf('if (jErrors === 0) \n  // Jilian Best Coupon Logic test');
if (s !== -1) {
  c = c.substring(0, s) + "if (jErrors === 0) {\n  // Jilian Best Coupon Logic test" + c.substring(s + 53);
  const end = c.indexOf("console.log('JILIAN COUPON CONSISTENCY: PASS');\n  console.log('JILIAN COUPON CONSISTENCY: PASS');");
  if (end !== -1) {
    c = c.substring(0, end) + "console.log('JILIAN COUPON CONSISTENCY: PASS');\n}\n" + c.substring(end + 96);
  }
}
fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
