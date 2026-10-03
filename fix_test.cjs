const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
c = c.replace(
  "  function testGnCalc(plan, period, orig, expected, expectedCode) {",
  `  function testGnCalc(plan, period, orig, expected, expectedCode) {
    const getDiscountMultiplier = (c) => {
      if (!c || !c.discountPercent) return 1;
      const match = c.discountPercent.match(/(\\d+)/);
      if (match) return 1 - (parseInt(match[1]) / 100);
      return 1;
    };`
);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
