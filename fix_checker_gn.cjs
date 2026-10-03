const fs = require('fs');

let code = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const testStr = `
// --- GUANGNIAN Consistency Test ---
let guangnianBrand = null;
if (fs.existsSync(path.join(brandsDir, 'guangnian.md'))) {
  const guangnianContent = fs.readFileSync(path.join(brandsDir, 'guangnian.md'), 'utf8');
  guangnianBrand = matter(guangnianContent).data;
}

if (guangnianBrand) {
  let gnErrors = 0;

  if (guangnianBrand.pricing.length === 26) {
    console.log('GUANGNIAN PRICING: PASS');
  } else {
    console.error(\`ERROR: GUANGNIAN pricing length is \${guangnianBrand.pricing.length}, expected 26\`);
    gnErrors++; errors++;
  }

  let gnIntegrityPass = true;
  const gnPricingMap = {
    '年付限时套餐': { '年付': '¥89.00' },
    '光年梯 入门版': { '月付': '¥18.00', '季付': '¥50.00', '半年付': '¥90.00', '年付': '¥160.00', '两年付': '¥300.00', '三年付': '¥420.00' },
    '光年梯 晋级版': { '月付': '¥34.00', '季付': '¥100.00', '半年付': '¥180.00', '年付': '¥320.00', '两年付': '¥610.00', '三年付': '¥850.00' },
    '光年梯 专业版': { '月付': '¥68.00', '季付': '¥200.00', '半年付': '¥375.00', '年付': '¥667.00', '两年付': '¥1251.00', '三年付': '¥1752.00' },
    '光年梯 至尊版': { '月付': '¥130.00', '季付': '¥390.00', '半年付': '¥702.00', '年付': '¥1248.00', '两年付': '¥2340.00', '三年付': '¥3276.00' },
    '独享私人专线节点': { '月付': '¥680.00' }
  };

  guangnianBrand.pricing.forEach(p => {
    if (!gnPricingMap[p.name] || gnPricingMap[p.name][p.period] !== p.originalPrice) {
      gnIntegrityPass = false;
    }
  });

  if (gnIntegrityPass) console.log('GUANGNIAN PRICE INTEGRITY: PASS');
  else { console.error('ERROR: GUANGNIAN PRICE INTEGRITY failed'); gnErrors++; errors++; }

  let activeBestEligible = 0;
  let activeBestExcluded = 0;
  
  // mock client date during event
  const eventDate = new Date('2026-10-01T12:00:00Z');
  let gn80Matches = 0;
  let gn85Matches = 0;

  guangnianBrand.pricing.forEach(p => {
    const cAct = getBestCouponForPricing(guangnianBrand, p, eventDate);
    if (cAct) activeBestEligible++; else activeBestExcluded++;

    // check specific matches directly
    const gn80 = guangnianBrand.temporaryCoupons.find(c => c.code === 'GNTHP80');
    const gn85 = guangnianBrand.temporaryCoupons.find(c => c.code === 'GNTHP85');
    if (isCouponApplicableToPricing(guangnianBrand, gn80, p)) gn80Matches++;
    if (isCouponApplicableToPricing(guangnianBrand, gn85, p)) gn85Matches++;
  });

  console.log(\`GUANGNIAN ACTIVE BEST COUPON ELIGIBLE: \${activeBestEligible}/25\`);
  console.log(\`GUANGNIAN ACTIVE BEST COUPON EXCLUDED: \${activeBestExcluded}/1\`);
  console.log(\`GUANGNIAN GNTHP80 MATCHES: \${gn80Matches}/13\`);
  console.log(\`GUANGNIAN GNTHP85 MATCHES: \${gn85Matches}/13\`);

  if (activeBestEligible !== 25 || activeBestExcluded !== 1 || gn80Matches !== 13 || gn85Matches !== 13) {
    gnErrors++; errors++;
  }

  // test specific cases
  function testGnCalc(plan, period, orig, expected, expectedCode) {
    const p = guangnianBrand.pricing.find(x => x.name === plan && x.period === period);
    const c = getBestCouponForPricing(guangnianBrand, p, eventDate);
    if (expected === null) {
      return c === null;
    }
    if (!c) return false;
    if (c.code !== expectedCode) return false;
    const mult = getDiscountMultiplier(c);
    const calc = parseFloat((orig * mult).toFixed(2));
    return calc === expected;
  }

  if (testGnCalc('年付限时套餐', '年付', 89, null, null)) {
    console.log('GUANGNIAN SPECIAL ANNUAL EXCLUDED: PASS');
  } else {
    console.error('ERROR: GUANGNIAN SPECIAL ANNUAL EXCLUDED failed'); gnErrors++; errors++;
  }

  let privatePass = true;
  if (!testGnCalc('独享私人专线节点', '月付', 680, 544, 'GNTHP80')) privatePass = false;
  if (privatePass) console.log('GUANGNIAN PRIVATE LINE BOTH COUPONS: PASS');
  else { console.error('ERROR: GUANGNIAN PRIVATE LINE test failed'); gnErrors++; errors++; }
  
  if (!testGnCalc('光年梯 入门版', '月付', 18, 15.30, 'GNTHP85')) { gnErrors++; errors++; console.error('GN fail: 18 -> 15.30'); }
  if (!testGnCalc('光年梯 入门版', '年付', 160, 128.00, 'GNTHP80')) { gnErrors++; errors++; console.error('GN fail: 160 -> 128.00'); }
  if (!testGnCalc('光年梯 入门版', '两年付', 300, 240.00, 'GNTHP80')) { gnErrors++; errors++; console.error('GN fail: 300 -> 240.00'); }
  if (!testGnCalc('光年梯 入门版', '三年付', 420, 336.00, 'GNTHP80')) { gnErrors++; errors++; console.error('GN fail: 420 -> 336.00'); }
  if (!testGnCalc('光年梯 专业版', '两年付', 1251, 1000.80, 'GNTHP80')) { gnErrors++; errors++; console.error('GN fail: 1251 -> 1000.80'); }
  if (!testGnCalc('光年梯 至尊版', '三年付', 3276, 2620.80, 'GNTHP80')) { gnErrors++; errors++; console.error('GN fail: 3276 -> 2620.80'); }

  let resetPass = true;
  if (guangnianBrand.resetPackages && guangnianBrand.resetPackages.length === 6) {
    const rpMap = Object.fromEntries(guangnianBrand.resetPackages.map(r => [r.plan, r.price]));
    if (rpMap['年付限时套餐'] !== 18) resetPass = false;
    if (rpMap['光年梯 入门版'] !== 18) resetPass = false;
    if (rpMap['光年梯 晋级版'] !== 34) resetPass = false;
    if (rpMap['光年梯 专业版'] !== 68) resetPass = false;
    if (rpMap['光年梯 至尊版'] !== 130) resetPass = false;
    if (rpMap['独享私人专线节点'] !== 680) resetPass = false;
  } else { resetPass = false; }
  
  if (resetPass) console.log('GUANGNIAN RESET PACKAGES: PASS');
  else { console.error('ERROR: GUANGNIAN RESET PACKAGES failed'); gnErrors++; errors++; }

  if (gnErrors === 0) console.log('GUANGNIAN COUPON CONSISTENCY: PASS');
}
console.log('------------------------------------');
`;

// Insert the new test before BITZNET VERIFIED COUPON
const bzIndex = code.indexOf('console.log(`BITZNET VERIFIED COUPON:');
if (bzIndex !== -1) {
  code = code.substring(0, bzIndex) + testStr + code.substring(bzIndex);
  fs.writeFileSync('scripts/check-coupon-consistency.mjs', code);
}

