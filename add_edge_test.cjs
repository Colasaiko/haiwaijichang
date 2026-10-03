const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const edgeTest = `
// --- EDGE Consistency Test ---
let edgeBrand = null;
if (fs.existsSync(path.join(brandsDir, 'edge.md'))) {
  const edgeContent = fs.readFileSync(path.join(brandsDir, 'edge.md'), 'utf8');
  edgeBrand = matter(edgeContent).data;
}

if (edgeBrand) {
  let edgeErrors = 0;
  
  if (edgeBrand.pricing.length === 35) {
    console.log('EDGE PRICING 35');
  } else {
    console.error(\`ERROR: EDGE pricing length is \${edgeBrand.pricing.length}, expected 35\`);
    edgeErrors++; errors++;
  }

  let edgeEligible = 0;
  let edgeExcluded = 0;
  edgeBrand.pricing.forEach(p => {
    // evaluate at a time when temp coupon is NOT active to check standard eligibility
    const cObj = getBestCouponForPricing(edgeBrand, p, '2026-11-01T00:00:00Z');
    if (cObj) edgeEligible++;
    else edgeExcluded++;
  });

  if (edgeEligible === 34) console.log('EDGE xk808 ELIGIBLE 34/34');
  else { console.error(\`ERROR: EDGE eligible is \${edgeEligible}\`); edgeErrors++; errors++; }

  if (edgeExcluded === 1) console.log('EDGE EXCLUDED 1/1');
  else { console.error(\`ERROR: EDGE excluded is \${edgeExcluded}\`); edgeErrors++; errors++; }

  function testEdgeCalc(plan, period, orig, expected, checkDate) {
    const p = edgeBrand.pricing.find(x => x.name === plan && x.period === period);
    const cObj = getBestCouponForPricing(edgeBrand, p, checkDate);
    if (expected === null) {
      return cObj === null;
    }
    if (!cObj) return false;
    const mult = getDiscountMultiplier(cObj);
    const calc = parseFloat((orig * mult).toFixed(2));
    return calc === expected;
  }

  let pricePass = true;
  // outside event, xk808 80%
  const afterEvent = '2026-11-01T00:00:00Z';
  if (!testEdgeCalc('极界·标准套餐', '月付', 22, 17.60, afterEvent)) pricePass = false;
  if (!testEdgeCalc('极界·专享套餐', '月付', 35, 28.00, afterEvent)) pricePass = false;
  if (!testEdgeCalc('极界·进阶套餐', '月付', 50, 40.00, afterEvent)) pricePass = false;
  if (!testEdgeCalc('极界·高级套餐', '月付', 100, 80.00, afterEvent)) pricePass = false;
  if (!testEdgeCalc('极界·极限套餐', '月付', 200, 160.00, afterEvent)) pricePass = false;
  if (!testEdgeCalc('限时年付', '年付', 98, 78.40, afterEvent)) pricePass = false;
  if (!testEdgeCalc('永久不限时450G', '一次性', 399, 319.20, afterEvent)) pricePass = false;
  if (!testEdgeCalc('限时体验月付小包', '月付', 15, null, afterEvent)) pricePass = false;

  // inside event, EG101 85% / EG815 80%
  const duringEvent = '2026-10-01T00:00:00Z';
  if (!testEdgeCalc('极界·标准套餐', '月付', 22, 18.70, duringEvent)) pricePass = false;
  if (!testEdgeCalc('极界·标准套餐', '半年付', 118, 94.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('限时年付', '年付', 98, 78.40, duringEvent)) pricePass = false;
  if (!testEdgeCalc('永久不限时100G', '一次性', 100, 80.00, duringEvent)) pricePass = false;
  if (!testEdgeCalc('限时体验月付小包', '月付', 15, null, duringEvent)) pricePass = false;
  
  if (!pricePass) {
    console.error('ERROR: EDGE PRICE CHECK failed');
    edgeErrors++; errors++;
  }
  
  if (edgeErrors === 0) console.log('EDGE COUPON CONSISTENCY: PASS');
}

if (errors === 0) console.log('COUPON CONSISTENCY: PASS');
console.log('CONTRADICTIONS: ' + errors);
if (errors > 0) process.exit(1);
`;

c = c.replace(/if \(errors === 0\) console\.log\('COUPON CONSISTENCY: PASS'\);\nconsole\.log\('CONTRADICTIONS: ' \+ errors\);\nif \(errors > 0\) process\.exit\(1\);/, edgeTest);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
