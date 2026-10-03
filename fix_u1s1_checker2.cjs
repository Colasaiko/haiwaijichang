const fs = require('fs');
let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

checker = checker.replace(
  "getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 定制包' && x.period === '月付'), uDateActive) === null &&\n      getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 定制包' && x.period === '月付'), uDateExpired) === null &&",
  ""
);

checker = checker.replace(
  "console.log('U1S1 DISCOUNT CALCULATION: PASS');",
  "console.log('U1S1 DISCOUNT CALCULATION: PASS');\n  } else {\n      console.error('ERROR: U1S1 DISCOUNT CALCULATION failed'); uErrors++; errors++;\n  }\n\n  if (getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 定制包' && x.period === '月付'), uDateActive) === null && getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 定制包' && x.period === '月付'), uDateExpired) === null) {\n      console.log('U1S1 CUSTOM PLAN COUPON EXCLUDED: PASS');\n"
);
fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
