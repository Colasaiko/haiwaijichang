import fs from 'fs';
import matter from 'gray-matter';
import { getBestCouponForPricing, getDiscountMultiplier, isCouponApplicableToPricing } from './src/utils/coupon.js';

const content = fs.readFileSync('src/content/brands/edge.md', 'utf8');
const edgeBrand = matter(content).data;

function testEdgeCalcDEBUG(plan, period, orig, expected, checkDate, expectedCode) {
  const p = edgeBrand.pricing.find(x => x.name === plan && x.period === period);
  if (!p) { console.log('PLAN NOT FOUND', plan, period); return false; }
  const cObj = getBestCouponForPricing(edgeBrand, p, checkDate);
  if (expected === null) {
    if (cObj !== null) console.log('FAILED: ', plan, period, 'expected null but got', cObj.code);
    return cObj === null;
  }
  if (!cObj) { console.log('FAILED: ', plan, period, 'expected', expected, 'but got null'); return false; }
  if (expectedCode && cObj.code !== expectedCode) {
      console.log('FAILED: ', plan, period, 'expected code', expectedCode, 'but got', cObj.code); return false; 
  }
  const mult = getDiscountMultiplier(cObj);
  const calc = parseFloat((orig * mult).toFixed(2));
  if (calc !== expected) console.log('FAILED: ', plan, period, 'expected', expected, 'but got', calc, 'with coupon', cObj.code);
  return calc === expected;
}

console.log('--- AFTER EVENT ---');
const afterEvent = '2026-11-01T00:00:00Z';
testEdgeCalcDEBUG('极界·标准套餐', '月付', 22, 17.60, afterEvent);
testEdgeCalcDEBUG('极界·专享套餐', '月付', 35, 28.00, afterEvent);
testEdgeCalcDEBUG('极界·进阶套餐', '月付', 50, 40.00, afterEvent);
testEdgeCalcDEBUG('极界·高级套餐', '月付', 100, 80.00, afterEvent);
testEdgeCalcDEBUG('极界·极限套餐', '月付', 200, 160.00, afterEvent);
testEdgeCalcDEBUG('限时年付', '年付', 98, 78.40, afterEvent);
testEdgeCalcDEBUG('永久不限时450G', '一次性', 399, 319.20, afterEvent);
testEdgeCalcDEBUG('限时体验月付小包', '月付', 15, null, afterEvent);

console.log('--- DURING EVENT ---');
const duringEvent = '2026-10-01T00:00:00Z';
const eg101 = edgeBrand.temporaryCoupons.find(x => x.code === 'EG101');
const pStandardMonth = edgeBrand.pricing.find(x => x.name === '极界·标准套餐' && x.period === '月付');
if (!isCouponApplicableToPricing(edgeBrand, eg101, pStandardMonth)) {
  console.log('FAILED: EG101 NOT APPLICABLE TO STD MONTH');
} else {
  console.log('EG101 APPLICABLE TO STD MONTH: YES');
}

testEdgeCalcDEBUG('极界·标准套餐', '月付', 22, 17.60, duringEvent, 'xk808');
testEdgeCalcDEBUG('极界·标准套餐', '半年付', 118, 94.40, duringEvent, 'EG815');
testEdgeCalcDEBUG('限时年付', '年付', 98, 78.40, duringEvent, 'EG815');
testEdgeCalcDEBUG('永久不限时100G', '一次性', 100, 80.00, duringEvent, 'EG815');
testEdgeCalcDEBUG('永久不限时450G', '一次性', 399, 319.20, duringEvent, 'EG815');
testEdgeCalcDEBUG('限时体验月付小包', '月付', 15, null, duringEvent);
