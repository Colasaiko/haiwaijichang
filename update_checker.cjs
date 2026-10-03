const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const oldFunc = `  function testEdgeCalc(plan, period, orig, expected, checkDate) {
    const p = edgeBrand.pricing.find(x => x.name === plan && x.period === period);
    const cObj = getBestCouponForPricing(edgeBrand, p, checkDate);
    if (expected === null) {
      return cObj === null;
    }
    if (!cObj) return false;
    const mult = getDiscountMultiplier(cObj);
    const calc = parseFloat((orig * mult).toFixed(2));
    return calc === expected;
  }`;

const newFunc = `  function testEdgeCalc(plan, period, orig, expected, checkDate, expectedCode = null) {
    const p = edgeBrand.pricing.find(x => x.name === plan && x.period === period);
    const cObj = getBestCouponForPricing(edgeBrand, p, checkDate);
    if (expected === null) {
      return cObj === null;
    }
    if (!cObj) return false;
    if (expectedCode && cObj.code !== expectedCode) {
      console.error(\`ERROR: EDGE Expected coupon \${expectedCode} for \${plan} \${period}, got \${cObj.code}\`);
      return false;
    }
    const mult = getDiscountMultiplier(cObj);
    const calc = parseFloat((orig * mult).toFixed(2));
    return calc === expected;
  }`;

c = c.replace(oldFunc, newFunc);

const oldTestBlock = `  // inside event, EG101 85% / EG815 80%
  const duringEvent = '2026-10-01T00:00:00Z';
  if (!testEdgeCalc('极界·标准套餐', '月付', 22, 18.70, duringEvent)) pricePass = false;
  if (!testEdgeCalc('极界·标准套餐', '半年付', 118, 94.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('限时年付', '年付', 98, 78.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('永久不限时100G', '一次性', 100, 80.00, duringEvent)) pricePass = false;
  if (!testEdgeCalc('限时体验月付小包', '月付', 15, null, duringEvent)) pricePass = false;`;

const newTestBlock = `  // inside event, EG101 85% / EG815 80%
  const duringEvent = '2026-10-01T00:00:00Z';
  if (!testEdgeCalc('极界·标准套餐', '月付', 22, 18.70, duringEvent)) pricePass = false;
  if (!testEdgeCalc('极界·标准套餐', '半年付', 118, 94.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('限时年付', '年付', 98, 78.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('永久不限时100G', '一次性', 100, 80.00, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('永久不限时450G', '一次性', 399, 319.20, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('限时体验月付小包', '月付', 15, null, duringEvent)) pricePass = false;`;

c = c.replace(oldTestBlock, newTestBlock);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
