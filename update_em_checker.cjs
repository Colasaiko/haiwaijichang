const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const ermaoTestStr = `// --- ERMAO Consistency Test ---
let ermaoBrand = null;
if (fs.existsSync(path.join(brandsDir, 'ermao.md'))) {
  const emContent = fs.readFileSync(path.join(brandsDir, 'ermao.md'), 'utf8');
  ermaoBrand = matter(emContent).data;
}

if (ermaoBrand) {
  let emErrors = 0;
  
  if (ermaoBrand.pricing.length === 30) {
    console.log('ERMAO PRICING 30');
  } else {
    console.error(\`ERROR: ERMAO pricing length is \${ermaoBrand.pricing.length}, expected 30\`);
    emErrors++; errors++;
  }

  let emEligible = 0;
  let emExcluded = 0;
  ermaoBrand.pricing.forEach(p => {
    // evaluate at a time when temp coupon is NOT active to check standard eligibility
    const c = getBestCouponForPricing(ermaoBrand, p, '2026-11-01T00:00:00Z');
    if (c) emEligible++;
    else emExcluded++;
  });

  if (emEligible === 27) console.log('ERMAO ermao888 ELIGIBLE 27/27');
  else { console.error(\`ERROR: ERMAO eligible is \${emEligible}\`); emErrors++; errors++; }

  if (emExcluded === 3) console.log('ERMAO EXCLUDED 3/3');
  else { console.error(\`ERROR: ERMAO excluded is \${emExcluded}\`); emErrors++; errors++; }

  function testEmCalc(plan, period, orig, expected, checkDate = '2026-11-01T00:00:00Z') {
    const p = ermaoBrand.pricing.find(x => x.name === plan && x.period === period);
    const c = getBestCouponForPricing(ermaoBrand, p, checkDate);
    if (expected === null) {
      return c === null;
    }
    if (!c) return false;
    const mult = getDiscountMultiplier(c);
    const calc = parseFloat((orig * mult).toFixed(2));
    return calc === expected;
  }

  let pricePass = true;
  // outside event, ermao888 85%
  if (!testEmCalc('白猫', '月付', 20, 17)) pricePass = false;
  if (!testEmCalc('橘猫', '月付', 40, 34)) pricePass = false;
  if (!testEmCalc('牛奶猫', '月付', 80, 68)) pricePass = false;
  if (!testEmCalc('黑猫', '月付', 160, 136)) pricePass = false;
  if (!testEmCalc('二猫年付小包', '年付', 96, 81.60)) pricePass = false;
  // inside event, zqj80 80%
  if (!testEmCalc('白猫', '年付', 204, 163.20, '2026-10-01T00:00:00Z')) pricePass = false;
  
  if (!testEmCalc('100G不限时', '一次性', 100, null)) pricePass = false;
  if (!testEmCalc('200G不限时加大版', '一次性', 199, null)) pricePass = false;
  if (!testEmCalc('美国家庭定制', '一次性', 700, null)) pricePass = false;
  
  if (!pricePass) {
    console.error('ERROR: ERMAO PRICE CHECK failed');
    emErrors++; errors++;
  }
  
  if (emErrors === 0) console.log('ERMAO COUPON CONSISTENCY: PASS');
}
`;

const insertPos = c.indexOf("console.log('COUPON CONSISTENCY: PASS');");
const finalC = c.substring(0, insertPos) + ermaoTestStr + c.substring(insertPos);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', finalC);
