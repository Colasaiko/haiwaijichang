const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const targetStr = `if (errors > 0) process.exit(1);`;
const yifanTestStr = `// --- YIFAN Consistency Test ---
let yifanBrand = null;
if (fs.existsSync(path.join(brandsDir, 'yifan.md'))) {
  const yfContent = fs.readFileSync(path.join(brandsDir, 'yifan.md'), 'utf8');
  yifanBrand = matter(yfContent).data;
}

if (yifanBrand) {
  let yfErrors = 0;
  
  if (yifanBrand.pricing.length === 31) {
    console.log('YIFAN PRICING 31');
  } else {
    console.error(\`ERROR: YIFAN pricing length is \${yifanBrand.pricing.length}, expected 31\`);
    yfErrors++; errors++;
  }

  let yfEligible = 0;
  let yfExcluded = 0;
  yifanBrand.pricing.forEach(p => {
    if (getBestCouponForPricing(yifanBrand, p)) {
      yfEligible++;
    } else {
      yfExcluded++;
    }
  });

  if (yfEligible === 27) console.log('YIFAN 1FLYYUN ELIGIBLE 27/27');
  else { console.error(\`ERROR: YIFAN eligible is \${yfEligible}\`); yfErrors++; errors++; }

  if (yfExcluded === 4) console.log('YIFAN EXCLUDED 4/4');
  else { console.error(\`ERROR: YIFAN excluded is \${yfExcluded}\`); yfErrors++; errors++; }

  function testYfCalc(plan, period, orig, expected) {
    const p = yifanBrand.pricing.find(x => x.name === plan && x.period === period);
    const c = getBestCouponForPricing(yifanBrand, p);
    if (expected === null) {
      return c === null;
    }
    if (!c) return false;
    const mult = getDiscountMultiplier(c);
    const calc = parseFloat((orig * mult).toFixed(2));
    return calc === expected;
  }

  let pricePass = true;
  if (!testYfCalc('轻享版', '月付', 20, 18)) pricePass = false;
  if (!testYfCalc('舒享版', '月付', 35, 31.50)) pricePass = false;
  if (!testYfCalc('尊享版', '月付', 55, 49.50)) pricePass = false;
  if (!testYfCalc('极致版', '月付', 95, 85.50)) pricePass = false;
  if (!testYfCalc('轻享版·不限时包', '一次性', 100, 90)) pricePass = false;
  if (!testYfCalc('舒享版·不限时包', '一次性', 200, 180)) pricePass = false;
  if (!testYfCalc('尊享版·不限时包', '一次性', 400, 360)) pricePass = false;
  if (!testYfCalc('98¥·年付小包', '年付', 98, null)) pricePass = false;
  if (!testYfCalc('98¥·年付小包', '两年付', 188, null)) pricePass = false;
  if (!testYfCalc('98¥·年付小包', '三年付', 268, null)) pricePass = false;
  if (!testYfCalc('中秋限定·不限时包', '一次性', 50, null)) pricePass = false;
  
  if (!pricePass) {
    console.error('ERROR: YIFAN PRICE CHECK failed');
    yfErrors++; errors++;
  }
}
`;

c = c.replace(targetStr, yifanTestStr + "\nif (errors > 0) process.exit(1);");
fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
