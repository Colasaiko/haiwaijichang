const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const sIsApp = c.indexOf('function isCouponApplicableToPricing');
const eIsApp = c.indexOf('function getBestCouponForPricing');

const newIsApp = `function isCouponApplicableToPricing(brand, coupon, pricingEntry) {
  if (!pricingEntry || !coupon) return false;
  if (pricingEntry.couponEligible === false) return false;
  
  const planName = pricingEntry.name || pricingEntry.plan || pricingEntry.label || "";
  const period = pricingEntry.period || "";
  
  const normalizePeriod = value => String(value || '').trim().replace(/\\s+/g, '');
  const normPeriod = normalizePeriod(period);

  if (coupon.applicablePairs && Array.isArray(coupon.applicablePairs) && coupon.applicablePairs.length > 0) {
    let pairMatched = false;
    for (const pair of coupon.applicablePairs) {
      const pPlans = pair.plans || [];
      const pPeriods = pair.periods || [];
      const planMatch = pPlans.includes(planName);
      const periodMatch = pPeriods.some(p => normalizePeriod(p) === normPeriod);
      if (planMatch && periodMatch) {
        pairMatched = true;
        break;
      }
    }
    if (!pairMatched) return false;
  } else {
    if (coupon.eligiblePlans && Array.isArray(coupon.eligiblePlans) && coupon.eligiblePlans.length > 0) {
      const isEligible = coupon.eligiblePlans.some(p => planName.includes(p));
      if (!isEligible) return false;
    }
    if (coupon.eligiblePeriods && Array.isArray(coupon.eligiblePeriods) && coupon.eligiblePeriods.length > 0) {
      const isEligible = coupon.eligiblePeriods.some(p => normPeriod === normalizePeriod(p));
      if (!isEligible) return false;
    }
  }

  if (coupon.excludedPlans && Array.isArray(coupon.excludedPlans) && coupon.excludedPlans.length > 0) {
    const isExcluded = coupon.excludedPlans.some(p => planName.includes(p));
    if (isExcluded) return false;
  }
  if (coupon.excludedPeriods && Array.isArray(coupon.excludedPeriods) && coupon.excludedPeriods.length > 0) {
    const isExcluded = coupon.excludedPeriods.some(p => normPeriod === normalizePeriod(p));
    if (isExcluded) return false;
  }
  return true;
}
`;
c = c.substring(0, sIsApp) + newIsApp + "\n" + c.substring(eIsApp);

const sGetBest = c.indexOf('function getBestCouponForPricing');
const eGetBest = c.indexOf('function getStandardCouponForPricing');

const newGetBest = `function getBestCouponForPricing(brand, pricingEntry, now = Date.now()) {
  if (pricingEntry.couponEligible === false) return null;

  let activeTemps = (brand.temporaryCoupons || []).filter(c => {
    if (c.manualActive === false) return false;
    if (c.manualActive === true) {
      if (c.startsAt && now < new Date(c.startsAt).getTime()) return false;
      if (c.expiresAt && now > new Date(c.expiresAt).getTime()) return false;
      return true;
    }
    if (!c.startsAt || !c.expiresAt) return false;
    return now >= new Date(c.startsAt).getTime() && now <= new Date(c.expiresAt).getTime();
  });

  let applicableCoupons = [];
  if (activeTemps.length > 0) {
    for (const temp of activeTemps) {
      if (isCouponApplicableToPricing(brand, temp, pricingEntry)) {
        applicableCoupons.push({ type: "temporary", ...temp });
      }
    }
  }

  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      applicableCoupons.push({ type: "standard", ...brand.coupon });
    }
  }

  if (applicableCoupons.length === 0) return null;

  applicableCoupons.sort((a, b) => {
    const getMult = (c) => {
      if (!c.discountPercent) return 1;
      const m = c.discountPercent.match(/(\\d+)/);
      return m ? (1 - parseInt(m[1]) / 100) : 1;
    };
    const multA = getMult(a);
    const multB = getMult(b);
    
    if (multA !== multB) {
      return multA - multB; 
    }
    
    if (a.type === 'temporary' && b.type !== 'temporary') return -1;
    if (b.type === 'temporary' && a.type !== 'temporary') return 1;
    
    if (a.type === 'temporary' && b.type === 'temporary') {
      return (b.priority || 0) - (a.priority || 0);
    }
    
    return 0;
  });

  return applicableCoupons[0];
}
`;
c = c.substring(0, sGetBest) + newGetBest + "\n" + c.substring(eGetBest);

// 3. Fix getStandardCouponForPricing inside checker
const stdEnd = c.indexOf('function getDiscountMultiplier');
const oldStdBlock = c.substring(c.indexOf('function getStandardCouponForPricing'), stdEnd);
const newStdBlock = `function getStandardCouponForPricing(brand, pricingEntry) {
  if (!brand || !pricingEntry) return null;
  if (pricingEntry.couponEligible === false) return null;
  if (brand.coupon && isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
    return { type: "standard", ...brand.coupon };
  }
  return null;
}
`;
c = c.replace(oldStdBlock, newStdBlock);

const jlTarget = "  if (jErrors === 0) console.log('JILIAN COUPON CONSISTENCY: PASS');";
const jilianTest = `
  const jlEventDate = new Date('2026-10-05T12:00:00Z');
  let jlShortPass = true;
  let jlLongPass = true;
  let jlExcl1Pass = false;
  let jlExcl2Pass = false;

  const jlBaseM = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '月付');
  const jlBaseQ = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '季付');
  const jlBaseH = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '半年付');
  
  const cM = getBestCouponForPricing(jilianBrand, jlBaseM, jlEventDate);
  const cQ = getBestCouponForPricing(jilianBrand, jlBaseQ, jlEventDate);
  const cH = getBestCouponForPricing(jilianBrand, jlBaseH, jlEventDate);

  if (!cM || cM.code !== 'JLY888') jlShortPass = false;
  if (!cQ || cQ.code !== 'JLY888') jlShortPass = false;
  if (!cH || cH.code !== 'JLY888') jlShortPass = false;

  if (jlShortPass) console.log('JILIAN SHORT PERIOD BEST COUPON: PASS');
  else { console.error('ERROR: JILIAN SHORT PERIOD BEST COUPON failed'); jErrors++; errors++; }

  const jlBaseY = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '年付');
  const jlBase2Y = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '两年付');
  const jlBase3Y = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '三年付');

  const cY = getBestCouponForPricing(jilianBrand, jlBaseY, jlEventDate);
  const c2Y = getBestCouponForPricing(jilianBrand, jlBase2Y, jlEventDate);
  const c3Y = getBestCouponForPricing(jilianBrand, jlBase3Y, jlEventDate);

  if (!cY || cY.code !== '2happy80') jlLongPass = false;
  if (!c2Y || c2Y.code !== '2happy80') jlLongPass = false;
  if (!c3Y || c3Y.code !== '2happy80') jlLongPass = false;

  if (jlLongPass) console.log('JILIAN LONG PERIOD TEMP COUPON: PASS');
  else { console.error('ERROR: JILIAN LONG PERIOD TEMP COUPON failed'); jErrors++; errors++; }

  const jlSpec = jilianBrand.pricing.find(p => p.name === '限时年付套餐体验' && p.period === '年付');
  const cSpec = getBestCouponForPricing(jilianBrand, jlSpec, jlEventDate);
  if (cSpec && cSpec.code === 'JLY888') jlExcl1Pass = true;
  
  if (jlExcl1Pass) console.log('JILIAN SPECIAL ANNUAL TEMP EXCLUDED: PASS');
  else { console.error('ERROR: JILIAN SPECIAL ANNUAL TEMP EXCLUDED failed'); jErrors++; errors++; }

  const jlUnlim = jilianBrand.pricing.find(p => p.name === '极连云 · 不限时套餐' && p.period === '一次性');
  const cUnlim = getBestCouponForPricing(jilianBrand, jlUnlim, jlEventDate);
  if (cUnlim && cUnlim.code === 'JLY888') jlExcl2Pass = true;

  if (jlExcl2Pass) console.log('JILIAN UNLIMITED TEMP EXCLUDED: PASS');
  else { console.error('ERROR: JILIAN UNLIMITED TEMP EXCLUDED failed'); jErrors++; errors++; }
`;
c = c.replace(jlTarget, jilianTest + "\n" + jlTarget);

const gnTestStr = `
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
  
  const eventDate = new Date('2026-10-01T12:00:00Z');
  let gn80Matches = 0;
  let gn85Matches = 0;

  guangnianBrand.pricing.forEach(p => {
    const cAct = getBestCouponForPricing(guangnianBrand, p, eventDate);
    if (cAct) activeBestEligible++; else activeBestExcluded++;

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

  let shortPass = true;
  if (!testGnCalc('光年梯 入门版', '月付', 18, 15.30, 'GNTHP85')) shortPass = false;
  if (!testGnCalc('光年梯 入门版', '季付', 50, 42.50, 'GNTHP85')) shortPass = false;
  if (!testGnCalc('光年梯 入门版', '半年付', 90, 76.50, 'GNTHP85')) shortPass = false;
  if (shortPass) console.log('GUANGNIAN SHORT PERIOD COUPON: PASS');
  else { console.error('ERROR: GUANGNIAN SHORT PERIOD COUPON test failed'); gnErrors++; errors++; }

  let longPass = true;
  if (!testGnCalc('光年梯 入门版', '年付', 160, 128.00, 'GNTHP80')) longPass = false;
  if (!testGnCalc('光年梯 入门版', '两年付', 300, 240.00, 'GNTHP80')) longPass = false;
  if (!testGnCalc('光年梯 入门版', '三年付', 420, 336.00, 'GNTHP80')) longPass = false;
  if (longPass) console.log('GUANGNIAN LONG PERIOD COUPON: PASS');
  else { console.error('ERROR: GUANGNIAN LONG PERIOD COUPON test failed'); gnErrors++; errors++; }

  const pPrivate = guangnianBrand.pricing.find(x => x.name === '独享私人专线节点' && x.period === '月付');
  const gn85 = guangnianBrand.temporaryCoupons.find(c => c.code === 'GNTHP85');
  let private85Pass = false;
  if (isCouponApplicableToPricing(guangnianBrand, gn85, pPrivate)) {
    private85Pass = true;
  }
  if (private85Pass) console.log('GUANGNIAN PRIVATE GNTHP85: PASS');
  else { console.error('ERROR: GUANGNIAN PRIVATE GNTHP85 test failed'); gnErrors++; errors++; }

  let privatePass = true;
  if (!testGnCalc('独享私人专线节点', '月付', 680, 544, 'GNTHP80')) privatePass = false;
  if (privatePass) console.log('GUANGNIAN PRIVATE BEST: PASS');
  else { console.error('ERROR: GUANGNIAN PRIVATE BEST test failed'); gnErrors++; errors++; }

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

  const postDate = new Date('2026-10-11T12:00:00Z');
  let postPass = true;
  guangnianBrand.pricing.forEach(p => {
    if (getBestCouponForPricing(guangnianBrand, p, postDate) !== null) {
      postPass = false;
    }
  });
  if (postPass) console.log('GUANGNIAN POST EXPIRY: PASS');
  else { console.error('ERROR: GUANGNIAN POST EXPIRY test failed'); gnErrors++; errors++; }

  if (gnErrors === 0) console.log('GUANGNIAN COUPON CONSISTENCY: PASS');
}
`;
const bzIndex = c.indexOf('console.log(`BITZNET VERIFIED COUPON:');
c = c.substring(0, bzIndex) + gnTestStr + "\n" + c.substring(bzIndex);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
