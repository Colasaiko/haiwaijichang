const fs = require('fs');

let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const newTest = `
// --- JILIAN Consistency Test ---
let jilianBrand = null;
if (fs.existsSync(path.join(brandsDir, 'jilian.md'))) {
  const jilianContent = fs.readFileSync(path.join(brandsDir, 'jilian.md'), 'utf8');
  jilianBrand = matter(jilianContent).data;
}

if (jilianBrand) {
  let jErrors = 0;
  
  if (jilianBrand.pricing.length === 26) {
    console.log('JILIAN PRICING: PASS');
  } else {
    console.error(\`ERROR: JILIAN pricing length is \${jilianBrand.pricing.length}, expected 26\`);
    jErrors++; errors++;
  }

  let integrityPass = true;
  const jPricingMap = {
    '限时年付套餐体验': { '年付': '¥96.00' },
    '极连云 · 基础套餐': { '月付': '¥18.00', '季付': '¥51.30', '半年付': '¥97.20', '年付': '¥183.60', '两年付': '¥345.60', '三年付': '¥486.00' },
    '极连云 · 进阶套餐': { '月付': '¥32.00', '季付': '¥102.00', '半年付': '¥194.00', '年付': '¥367.00', '两年付': '¥691.00', '三年付': '¥972.00' },
    '极连云 · 旗舰套餐': { '月付': '¥61.00', '季付': '¥183.00', '半年付': '¥366.00', '年付': '¥732.00', '两年付': '¥1464.00', '三年付': '¥2196.00' },
    '极连云 · 尊享套餐': { '月付': '¥122.00', '季付': '¥410.40', '半年付': '¥777.60', '年付': '¥1468.80', '两年付': '¥2764.80', '三年付': '¥3888.00' },
    '极连云 · 不限时套餐': { '一次性': '¥399.00' }
  };
  jilianBrand.pricing.forEach(p => {
    if (!jPricingMap[p.name] || jPricingMap[p.name][p.period] !== p.originalPrice) {
      integrityPass = false;
    }
  });

  if (integrityPass) console.log('JILIAN PRICE INTEGRITY: PASS');
  else { console.error('ERROR: JILIAN PRICE INTEGRITY failed'); jErrors++; errors++; }

  let jly888Eligible = 0;
  let jly888Exc = 0;
  jilianBrand.pricing.forEach(p => {
    // Only test standard behavior for JLY888 logic explicitly since getBestCouponForPricing handles dual
    const cAct = getBestCouponForPricing(jilianBrand, p);
    if (cAct && cAct.discount === '8折') {
      jly888Eligible++;
    } else {
      jly888Exc++;
    }
  });

  console.log(\`JILIAN JLY888 ELIGIBLE: \${jly888Eligible}/26\`);
  console.log(\`JILIAN JLY888 EXCLUDED: \${jly888Exc}/0\`);
  if (jly888Eligible !== 26 || jly888Exc !== 0) { jErrors++; errors++; }

  function checkJlDisc(plan, period, original, expected) {
    const p = jilianBrand.pricing.find(x => x.name === plan && x.period === period);
    const c = getBestCouponForPricing(jilianBrand, p);
    if (!c) return false;
    return parseFloat((original * 0.8).toFixed(2)) === expected;
  }

  if (checkJlDisc('限时年付套餐体验', '年付', 96, 76.80)) {
      console.log('JILIAN SPECIAL ANNUAL DISCOUNT: PASS');
  } else {
      console.error('ERROR: JILIAN SPECIAL ANNUAL DISCOUNT failed'); jErrors++; errors++;
  }

  if (checkJlDisc('极连云 · 基础套餐', '月付', 18, 14.40)) {
      console.log('JILIAN BASE MONTHLY: PASS');
  } else { console.error('ERROR: JILIAN BASE MONTHLY failed'); jErrors++; errors++; }

  if (checkJlDisc('极连云 · 进阶套餐', '月付', 32, 25.60)) {
      console.log('JILIAN ADVANCED MONTHLY: PASS');
  } else { console.error('ERROR: JILIAN ADVANCED MONTHLY failed'); jErrors++; errors++; }

  if (checkJlDisc('极连云 · 旗舰套餐', '月付', 61, 48.80)) {
      console.log('JILIAN FLAGSHIP MONTHLY: PASS');
  } else { console.error('ERROR: JILIAN FLAGSHIP MONTHLY failed'); jErrors++; errors++; }

  if (checkJlDisc('极连云 · 尊享套餐', '月付', 122, 97.60)) {
      console.log('JILIAN PREMIUM MONTHLY: PASS');
  } else { console.error('ERROR: JILIAN PREMIUM MONTHLY failed'); jErrors++; errors++; }

  if (checkJlDisc('极连云 · 不限时套餐', '一次性', 399, 319.20)) {
      console.log('JILIAN UNLIMITED: PASS');
  } else { console.error('ERROR: JILIAN UNLIMITED failed'); jErrors++; errors++; }

  let resetPass = true;
  if (jilianBrand.resetPackages && jilianBrand.resetPackages.length === 6) {
    const rpMap = Object.fromEntries(jilianBrand.resetPackages.map(r => [r.plan, r.price]));
    if (rpMap['限时年付套餐体验'] !== 18) resetPass = false;
    if (rpMap['极连云 · 基础套餐'] !== 18) resetPass = false;
    if (rpMap['极连云 · 进阶套餐'] !== 32) resetPass = false;
    if (rpMap['极连云 · 旗舰套餐'] !== 61) resetPass = false;
    if (rpMap['极连云 · 尊享套餐'] !== 122) resetPass = false;
    if (rpMap['极连云 · 不限时套餐'] !== 369) resetPass = false;
  } else { resetPass = false; }
  
  if (resetPass) console.log('JILIAN RESET PACKAGES: PASS');
  else { console.error('ERROR: JILIAN RESET PACKAGES failed'); jErrors++; errors++; }

  if (jErrors === 0) console.log('JILIAN COUPON CONSISTENCY: PASS');
}
console.log('------------------------------------');\n`;

// Insert the new test before BITZNET VERIFIED COUPON
checker = checker.replace("console.log(`BITZNET VERIFIED COUPON:", newTest + "console.log(`BITZNET VERIFIED COUPON:");

fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
