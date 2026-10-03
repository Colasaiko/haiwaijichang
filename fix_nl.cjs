const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
c = c.replace("let jErrors = 0;\\n  const jlEventDate", "let jErrors = 0;\n  const jlEventDate");
fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
