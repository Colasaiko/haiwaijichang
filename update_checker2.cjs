const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const oldTestBlock = `  // inside event, EG101 85% / EG815 80%
  const duringEvent = '2026-10-01T00:00:00Z';
  if (!testEdgeCalc('极界·标准套餐', '月付', 22, 18.70, duringEvent)) pricePass = false;
  if (!testEdgeCalc('极界·标准套餐', '半年付', 118, 94.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('限时年付', '年付', 98, 78.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('永久不限时100G', '一次性', 100, 80.00, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('永久不限时450G', '一次性', 399, 319.20, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('限时体验月付小包', '月付', 15, null, duringEvent)) pricePass = false;`;

const newTestBlock = `  // inside event, EG101 85% / EG815 80%
  const duringEvent = '2026-10-01T00:00:00Z';
  
  // Test if EG101 is applicable to standard monthly plan directly
  const eg101 = edgeBrand.temporaryCoupons.find(c => c.code === 'EG101');
  const pStandardMonth = edgeBrand.pricing.find(x => x.name === '极界·标准套餐' && x.period === '月付');
  if (!isCouponApplicableToPricing(edgeBrand, eg101, pStandardMonth)) {
    console.error('ERROR: EG101 should be applicable to 极界·标准套餐 月付');
    pricePass = false;
  }

  // But the best coupon should be xk808 (17.60) because 20% > 15%
  if (!testEdgeCalc('极界·标准套餐', '月付', 22, 17.60, duringEvent, 'xk808')) pricePass = false;
  if (!testEdgeCalc('极界·标准套餐', '半年付', 118, 94.40, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('限时年付', '年付', 98, 78.40, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('永久不限时100G', '一次性', 100, 80.00, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('永久不限时450G', '一次性', 399, 319.20, duringEvent, 'EG815')) pricePass = false;
  if (!testEdgeCalc('限时体验月付小包', '月付', 15, null, duringEvent)) pricePass = false;`;

c = c.replace(oldTestBlock, newTestBlock);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
