const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
const debugScript = `
  function testEdgeCalcDEBUG(plan, period, orig, expected, checkDate) {
    const p = edgeBrand.pricing.find(x => x.name === plan && x.period === period);
    const cObj = getBestCouponForPricing(edgeBrand, p, checkDate);
    if (expected === null) {
      if (cObj !== null) console.log('FAILED: ', plan, period, 'expected null but got', cObj.code);
      return cObj === null;
    }
    if (!cObj) { console.log('FAILED: ', plan, period, 'expected', expected, 'but got null'); return false; }
    const mult = getDiscountMultiplier(cObj);
    const calc = parseFloat((orig * mult).toFixed(2));
    if (calc !== expected) console.log('FAILED: ', plan, period, 'expected', expected, 'but got', calc, 'with coupon', cObj.code);
    return calc === expected;
  }

  let pricePass = true;
  const afterEvent = '2026-11-01T00:00:00Z';
  if (!testEdgeCalcDEBUG('极界·标准套餐', '月付', 22, 17.60, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('极界·专享套餐', '月付', 35, 28.00, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('极界·进阶套餐', '月付', 50, 40.00, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('极界·高级套餐', '月付', 100, 80.00, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('极界·极限套餐', '月付', 200, 160.00, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('限时年付', '年付', 98, 78.40, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('永久不限时450G', '一次性', 399, 319.20, afterEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('限时体验月付小包', '月付', 15, null, afterEvent)) pricePass = false;

  const duringEvent = '2026-10-01T00:00:00Z';
  if (!testEdgeCalcDEBUG('极界·标准套餐', '月付', 22, 18.70, duringEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('极界·标准套餐', '半年付', 118, 94.40, duringEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('限时年付', '年付', 98, 78.40, duringEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('永久不限时100G', '一次性', 100, 80.00, duringEvent)) pricePass = false;
  if (!testEdgeCalcDEBUG('限时体验月付小包', '月付', 15, null, duringEvent)) pricePass = false;
`;

const testIndex = c.indexOf('function testEdgeCalc(');
const afterTest = c.indexOf('if (!pricePass) {');
c = c.substring(0, testIndex) + debugScript + c.substring(afterTest);
fs.writeFileSync('scripts/check-coupon-consistency-debug.mjs', c);
