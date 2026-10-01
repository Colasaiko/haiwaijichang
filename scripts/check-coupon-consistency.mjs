import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Minimal re-implementation of the resolver for checking
function getBestCouponForPricing(brand, pricingEntry, now = Date.now()) {
  if (pricingEntry.couponEligible === false) return null;

  const planName = pricingEntry.name || '';
  const period = pricingEntry.period || '';

  const isApplicable = (coupon) => {
    if (coupon.eligiblePlans && coupon.eligiblePlans.length > 0) {
      if (!coupon.eligiblePlans.some(p => planName.includes(p))) return false;
    }
    if (coupon.excludedPlans && coupon.excludedPlans.length > 0) {
      if (coupon.excludedPlans.some(p => planName.includes(p))) return false;
    }
    const normalizePeriod = value => String(value || '').trim().replace(/\s+/g, '');
    const normPeriod = normalizePeriod(period);

    if (coupon.eligiblePeriods && coupon.eligiblePeriods.length > 0) {
      if (!coupon.eligiblePeriods.some(p => normPeriod === normalizePeriod(p))) return false;
    }
    if (coupon.excludedPeriods && coupon.excludedPeriods.length > 0) {
      if (coupon.excludedPeriods.some(p => normPeriod === normalizePeriod(p))) return false;
    }
    return true;
  };

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
  
  if (activeTemps.length > 0) {
    activeTemps.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (const temp of activeTemps) {
      if (isApplicable(temp)) return { type: 'temporary', ...temp };
    }
  }

  if (brand.coupon && isApplicable(brand.coupon)) return { type: 'standard', ...brand.coupon };
  return null;
}

function getVerifiedCouponForPricing(brand, pricingEntry) {
  if (pricingEntry.couponEligible === false) return null;

  const planName = pricingEntry.name || '';
  const period = pricingEntry.period || '';

  const isApplicable = (coupon) => {
    if (coupon.eligiblePlans && coupon.eligiblePlans.length > 0) {
      if (!coupon.eligiblePlans.some(p => planName.includes(p))) return false;
    }
    if (coupon.excludedPlans && coupon.excludedPlans.length > 0) {
      if (coupon.excludedPlans.some(p => planName.includes(p))) return false;
    }
    const normalizePeriod = value => String(value || '').trim().replace(/\s+/g, '');
    const normPeriod = normalizePeriod(period);

    if (coupon.eligiblePeriods && coupon.eligiblePeriods.length > 0) {
      if (!coupon.eligiblePeriods.some(p => normPeriod === normalizePeriod(p))) return false;
    }
    if (coupon.excludedPeriods && coupon.excludedPeriods.length > 0) {
      if (coupon.excludedPeriods.some(p => normPeriod === normalizePeriod(p))) return false;
    }
    return true;
  };

  if (brand.verifiedCoupons && Array.isArray(brand.verifiedCoupons)) {
    const workingCoupons = brand.verifiedCoupons.filter(c => c.status === 'verified-currently-working');
    for (const vc of workingCoupons) {
      if (isApplicable(vc)) return { type: 'verified', ...vc };
    }
  }

  return null;
}

let errors = 0;
let invalidVerifiedPlans = 0;
let invalidVerifiedPeriods = 0;
let bitznetNew9Count = 0;

const brandsDir = path.join(process.cwd(), 'src/content/brands');
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.md'));

console.log('--- RUNNING COUPON CONSISTENCY AUDIT ---\\n');

files.forEach(file => {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  const parsed = matter(content);
  const brand = parsed.data;
  
  console.log(`[BRAND] ${brand.name || file}`);

  const allPlanNames = (brand.pricing || []).map(p => p.name);
  const allPeriods = (brand.pricing || []).map(p => p.period);

  if (brand.verifiedCoupons && Array.isArray(brand.verifiedCoupons)) {
    brand.verifiedCoupons.forEach(vc => {
      if (vc.eligiblePlans && vc.eligiblePlans.length > 0) {
        vc.eligiblePlans.forEach(ep => {
          if (!allPlanNames.some(pn => pn.includes(ep))) {
            console.error(`ERROR: Verified coupon ${vc.code} references non-existent plan: ${ep}`);
            invalidVerifiedPlans++;
            errors++;
          }
        });
      }
      if (vc.eligiblePeriods && vc.eligiblePeriods.length > 0) {
        vc.eligiblePeriods.forEach(eperiod => {
          if (!allPeriods.some(per => per.includes(eperiod))) {
            console.error(`ERROR: Verified coupon ${vc.code} references non-existent period: ${eperiod}`);
            invalidVerifiedPeriods++;
            errors++;
          }
        });
      }
    });
  }
  
  // 1. Check pricing entries
  if (brand.pricing && Array.isArray(brand.pricing)) {
    brand.pricing.forEach(p => {
      const best = getBestCouponForPricing(brand, p);
      const vCoupon = getVerifiedCouponForPricing(brand, p);

      if (brand.verifiedCoupons && Array.isArray(brand.verifiedCoupons)) {
        brand.verifiedCoupons.forEach(vc => {
           if (p.couponEligible === false) {
             const planName = p.name || '';
             const period = p.period || '';
             const isApplicable = () => {
               if (vc.eligiblePlans && vc.eligiblePlans.length > 0 && !vc.eligiblePlans.some(ep => planName.includes(ep))) return false;
               if (vc.excludedPlans && vc.excludedPlans.length > 0 && vc.excludedPlans.some(ep => planName.includes(ep))) return false;
               const normalizePeriod = value => String(value || '').trim().replace(/\s+/g, '');
               const normPeriod = normalizePeriod(period);
               if (vc.eligiblePeriods && vc.eligiblePeriods.length > 0 && !vc.eligiblePeriods.some(eperiod => normPeriod === normalizePeriod(eperiod))) return false;
               if (vc.excludedPeriods && vc.excludedPeriods.length > 0 && vc.excludedPeriods.some(eperiod => normPeriod === normalizePeriod(eperiod))) return false;
               return true;
             };
             // If the coupon logic thinks it applies but couponEligible is false
             if (isApplicable()) {
               console.error(`ERROR: ${p.name} is marked couponEligible:false, but verified coupon ${vc.code} claims it is applicable!`);
               errors++;
             }
           }
        });
      }

      if (p.couponEligible === false) {
        if (p.discountPrice) {
          console.error(`ERROR: ${p.name} (${p.period}) is marked couponEligible:false, but has a discountPrice!`);
          errors++;
        }
        console.log(`  - ${p.name} (${p.period}): 优惠码不适用`);
      } else {
        if (best) {
          console.log(`  - ${p.name} (${p.period}): [${best.type}] ${best.code} 可用`);
        } else if (vCoupon) {
          const limitStr = (vCoupon.usageLimit === 1 || vCoupon.usageLimitText) ? '（仅1次）' : '';
          console.log(`  - ${p.name} (${p.period}): [verified] ${vCoupon.code} 可用${limitStr}`);
          if (brand.slug === 'bitznet' && vCoupon.code === 'NEW9') {
            bitznetNew9Count++;
          }
        } else {
          console.log(`  - ${p.name} (${p.period}): 优惠码不适用`);
        }
      }
    });
  }

  // 2. Check Coupon Comparison
  if (brand.visualData && brand.visualData.couponExample) {
    const ex = brand.visualData.couponExample;
    const pEntry = (brand.pricing || []).find(p => p.name === ex.plan && p.period === ex.period) || { name: ex.plan, period: ex.period };
    const best = getBestCouponForPricing(brand, pEntry);
    if (!best) {
      console.error(`ERROR: couponExample points to ${ex.plan} (${ex.period}) but NO coupon is applicable!`);
      errors++;
    }
  }
  
  console.log('');
});

// --- Shanyue Time Regression Test ---
const shanyueContent = fs.readFileSync(path.join(brandsDir, 'shanyue.md'), 'utf8');
const shanyueBrand = matter(shanyueContent).data;

const dateA = new Date("2026-09-30T12:00:00+08:00").getTime();
const dateB = new Date("2026-10-11T12:00:00+08:00").getTime();

const flickerPlan = shanyueBrand.pricing.find(p => p.name.includes("Flicker") && p.period.includes("月付"));
const annualPlan = shanyueBrand.pricing.find(p => p.name === "闪跃年付版" && p.period === "年付");
const unlimitedPlan = shanyueBrand.pricing.find(p => p.name === "闪跃不限时版" && p.period === "一次性");

// Test Date A (2026-09-30)
const bestA = getBestCouponForPricing(shanyueBrand, flickerPlan, dateA);
if (bestA && bestA.type === 'temporary' && bestA.code === 'fest' && bestA.discount === '7.5折') {
  console.log('CURRENT FEST: PASS');
} else {
  console.error('ERROR: Flicker should use fest on 09-30, got: ', bestA);
  errors++;
}

// Test Date B (2026-10-11)
const bestB = getBestCouponForPricing(shanyueBrand, flickerPlan, dateB);
if (bestB && bestB.type === 'standard' && bestB.code === 'shanyue' && bestB.discount === '8折') {
  console.log('POST-EXPIRY FALLBACK: PASS');
} else {
  console.error('ERROR: Flicker should fallback to shanyue on 10-11, got: ', bestB);
  errors++;
}

// Test Excluded Plans
const annA = getBestCouponForPricing(shanyueBrand, annualPlan, dateA);
const annB = getBestCouponForPricing(shanyueBrand, annualPlan, dateB);
const unlimA = getBestCouponForPricing(shanyueBrand, unlimitedPlan, dateA);
const unlimB = getBestCouponForPricing(shanyueBrand, unlimitedPlan, dateB);

if (!annA && !annB && !unlimA && !unlimB) {
  console.log('EXCLUDED PLAN STABILITY: PASS');
} else {
  console.error('ERROR: Excluded plans resolved a coupon!');
  errors++;
}
console.log('------------------------------------');

// --- Sogo Time Regression Test ---
let sogoBrand = null;
if (fs.existsSync(path.join(brandsDir, 'sogo.md'))) {
  const sogoContent = fs.readFileSync(path.join(brandsDir, 'sogo.md'), 'utf8');
  sogoBrand = matter(sogoContent).data;
}

if (sogoBrand) {
  const sogoBaseMonth = sogoBrand.pricing.find(p => p.name === "小包-基础版" && p.period === "月付");
  const sogoBaseQuarter = sogoBrand.pricing.find(p => p.name === "小包-基础版" && p.period === "季付");
  const sogoBaseHalf = sogoBrand.pricing.find(p => p.name === "小包-基础版" && p.period === "半年付");
  const sogoBaseYear = sogoBrand.pricing.find(p => p.name === "小包-基础版" && p.period === "年付");
  const sogoBase2Year = sogoBrand.pricing.find(p => p.name === "小包-基础版" && p.period === "两年付");
  const sogoBase3Year = sogoBrand.pricing.find(p => p.name === "小包-基础版" && p.period === "三年付");
  const sogoSmallYear = sogoBrand.pricing.find(p => p.name === "小包-年付版" && p.period === "年付");
  const sogoUnlim = sogoBrand.pricing.find(p => p.name === "SOGO基础餐不限时版" && p.period === "一次性");

  // Date A
  const smA = getBestCouponForPricing(sogoBrand, sogoBaseMonth, dateA);
  const sqA = getBestCouponForPricing(sogoBrand, sogoBaseQuarter, dateA);
  const shA = getBestCouponForPricing(sogoBrand, sogoBaseHalf, dateA);

  if (smA?.code === 'sogo85' && sqA?.code === 'sogo85' && shA?.code === 'sogo85') {
    console.log('SOGO MONTHLY/QUARTER/HALF → SOGO85: PASS');
  } else {
    console.error('ERROR: SOGO85 matching failed', smA, sqA, shA);
    errors++;
  }

  if (shA?.code === 'sogo85') {
    console.log('SOGO HALF-YEAR EXACT MATCH: PASS');
  }

  const syA = getBestCouponForPricing(sogoBrand, sogoBaseYear, dateA);
  const s2yA = getBestCouponForPricing(sogoBrand, sogoBase2Year, dateA);
  const s3yA = getBestCouponForPricing(sogoBrand, sogoBase3Year, dateA);

  if (syA?.code === 'sogo80' && s2yA?.code === 'sogo80' && s3yA?.code === 'sogo80') {
    console.log('SOGO YEAR/2Y/3Y → SOGO80: PASS');
  } else {
    console.error('ERROR: SOGO80 matching failed', syA, s2yA, s3yA);
    errors++;
  }

  const suA = getBestCouponForPricing(sogoBrand, sogoUnlim, dateA);
  if (suA?.code === 'sogo10000') {
    console.log('SOGO UNLIMITED STANDARD COUPON: PASS');
  } else {
    console.error('ERROR: SOGO Unlimited standard coupon failed', suA);
    errors++;
  }

  const ssmallA = getBestCouponForPricing(sogoBrand, sogoSmallYear, dateA);
  if (!ssmallA) {
    console.log('SOGO SMALL-ANNUAL EXCLUSION: PASS');
  } else {
    console.error('ERROR: SOGO Small Annual should be excluded', ssmallA);
    errors++;
  }

  // Date B
  const smB = getBestCouponForPricing(sogoBrand, sogoBaseMonth, dateB);
  if (smB?.code === 'sogo10000') {
    console.log('SOGO POST-EXPIRY FALLBACK: PASS');
  } else {
    console.error('ERROR: SOGO POST EXPIRY fallback failed', smB);
    errors++;
  }
}
console.log('------------------------------------');

// --- Muguang Consistency Test ---
let muguangBrand = null;
if (fs.existsSync(path.join(brandsDir, 'muguang.md'))) {
  const muguangContent = fs.readFileSync(path.join(brandsDir, 'muguang.md'), 'utf8');
  muguangBrand = matter(muguangContent).data;
}

if (muguangBrand) {
  let muguangEligibleCount = 0;
  let muguangExcludedCount = 0;
  let muguangErrors = 0;

  muguangBrand.pricing.forEach(p => {
    const activeCoupon = getBestCouponForPricing(muguangBrand, p, dateA);
    const expectedEligible = p.name.includes("基础版") || p.name.includes("标准版") || p.name.includes("旗舰版") || p.name.includes("至尊版");
    const isExcluded = p.name === "暮光 · 年付轻量版" || p.name.includes("不限时") || p.name === "独享私人定制节点";
    
    if (expectedEligible && !isExcluded) {
      if (activeCoupon?.code === 'mm88') {
        muguangEligibleCount++;
      } else {
        console.error(`ERROR: Muguang ${p.name} (${p.period}) should have mm88, got:`, activeCoupon);
        muguangErrors++;
        errors++;
      }
    } else if (isExcluded) {
      if (!activeCoupon) {
        muguangExcludedCount++;
      } else {
        console.error(`ERROR: Muguang excluded plan ${p.name} resolved a coupon:`, activeCoupon);
        muguangErrors++;
        errors++;
      }
    }
  });

  if (muguangBrand.pricing.length !== 29) {
     console.error(`ERROR: Muguang pricing should have 29 entries, found ${muguangBrand.pricing.length}`);
     muguangErrors++;
     errors++;
  } else {
     console.log('MUGUANG PRICING: PASS');
  }
  console.log(`MUGUANG MM88 ELIGIBLE PRICING: ${muguangEligibleCount}/24`);
  console.log(`MUGUANG EXCLUDED PRICING: ${muguangExcludedCount}/5`);
  console.log(`MUGUANG COUPON CONSISTENCY: ${muguangErrors === 0 ? 'PASS' : 'FAIL'}`);
}
console.log('------------------------------------');

// --- Baoyun Consistency Test ---
let baoyunBrand = null;
if (fs.existsSync(path.join(brandsDir, 'baoyun.md'))) {
  const baoyunContent = fs.readFileSync(path.join(brandsDir, 'baoyun.md'), 'utf8');
  baoyunBrand = matter(baoyunContent).data;
}

if (baoyunBrand) {
  let baoyunEligibleCount = 0;
  let baoyunExcludedCount = 0;
  let baoyunErrors = 0;

  if (baoyunBrand.pricing.length !== 19) {
    console.error(`ERROR: Baoyun pricing should have 19 entries, found ${baoyunBrand.pricing.length}`);
    baoyunErrors++;
    errors++;
  } else {
    console.log('BAOYUN PRICING: PASS');
  }

  baoyunBrand.pricing.forEach(p => {
    const activeCoupon = getBestCouponForPricing(baoyunBrand, p, dateA);
    if (p.couponEligible) {
      if (activeCoupon?.code === 'baoyun') {
        baoyunEligibleCount++;
      } else {
        console.error(`ERROR: Baoyun ${p.name} (${p.period}) should have baoyun, got:`, activeCoupon);
        baoyunErrors++;
        errors++;
      }
    } else {
      if (!activeCoupon) {
        baoyunExcludedCount++;
      } else {
        console.error(`ERROR: Baoyun excluded plan ${p.name} resolved a coupon:`, activeCoupon);
        baoyunErrors++;
        errors++;
      }
    }
  });

  console.log(`BAOYUN COUPON ELIGIBLE: ${baoyunEligibleCount}/13`);
  console.log(`BAOYUN COUPON EXCLUDED: ${baoyunExcludedCount}/6`);
  const expectedExcluded = [
    "【流量包】365天500G",
    "【流量包】365天1000G",
    "年付100G-轻量特惠",
    "季付500G-轻量特惠",
    "一次性500G-传世宝",
    "一次性1000G-传承宝"
  ];
  const actualExcluded = baoyunBrand.coupon?.excludedPlans || [];
  let excludedMatch = expectedExcluded.length === actualExcluded.length && expectedExcluded.every(e => actualExcluded.includes(e));
  if (excludedMatch) {
    console.log('BAOYUN EXCLUDED PLAN REFERENCES: PASS');
  } else {
    console.error('ERROR: BAOYUN EXCLUDED PLAN REFERENCES failed');
    baoyunErrors++;
    errors++;
  }
  
  // Specific discount calculations
  function checkDiscount(planName, period, original, expectedAfter) {
     const p = baoyunBrand.pricing.find(x => x.name === planName && x.period === period);
     const coupon = getBestCouponForPricing(baoyunBrand, p, dateA);
     let multiplier = 1;
     if (coupon && coupon.discount) {
        const match = coupon.discount.match(/(\d+(?:\.\d+)?)折/);
        if (match) multiplier = parseFloat(match[1]) / 10;
     }
     const after = parseFloat((original * multiplier).toFixed(2));
     const saved = parseFloat((original - after).toFixed(2));
     const expectedSaved = parseFloat((original - expectedAfter).toFixed(2));
     return after === expectedAfter && saved === expectedSaved;
  }

  if (checkDiscount('福宝', '月付', 4, 3.20)) {
     console.log('BAOYUN FU-BAO DISCOUNT: PASS');
  } else {
     console.error('ERROR: BAOYUN FU-BAO DISCOUNT failed');
     baoyunErrors++;
     errors++;
  }

  if (checkDiscount('一次性200G-传家宝', '一次性', 26, 20.80)) {
     console.log('BAOYUN CHUAN-JIA-BAO DISCOUNT: PASS');
  } else {
     console.error('ERROR: BAOYUN CHUAN-JIA-BAO DISCOUNT failed');
     baoyunErrors++;
     errors++;
  }

  if (baoyunExcludedCount === 6) {
    console.log('BAOYUN EXCLUSION STABILITY: PASS');
  }
  
  console.log(`BAOYUN COUPON CONSISTENCY: ${baoyunErrors === 0 ? 'PASS' : 'FAIL'}`);
}
console.log('------------------------------------');

// --- Jiuyun Consistency Test ---
let jiuyunBrand = null;
if (fs.existsSync(path.join(brandsDir, 'jiuyun.md'))) {
  const jiuyunContent = fs.readFileSync(path.join(brandsDir, 'jiuyun.md'), 'utf8');
  jiuyunBrand = matter(jiuyunContent).data;
}

if (jiuyunBrand) {
  let jiuyunEligibleCount = 0;
  let jiuyunExcludedCount = 0;
  let jiuyunErrors = 0;

  if (jiuyunBrand.pricing.length !== 21) {
    console.error(`ERROR: Jiuyun pricing should have 21 entries, found ${jiuyunBrand.pricing.length}`);
    jiuyunErrors++;
    errors++;
  } else {
    console.log('JIUYUN PRICING: PASS');
  }

  jiuyunBrand.pricing.forEach(p => {
    const activeCoupon = getBestCouponForPricing(jiuyunBrand, p, dateA);
    if (p.couponEligible) {
      if (activeCoupon?.code === '9yun') {
        jiuyunEligibleCount++;
      } else {
        console.error(`ERROR: Jiuyun ${p.name} (${p.period}) should have 9yun, got:`, activeCoupon);
        jiuyunErrors++;
        errors++;
      }
    } else {
      if (!activeCoupon) {
        jiuyunExcludedCount++;
      } else {
        console.error(`ERROR: Jiuyun excluded plan ${p.name} resolved a coupon:`, activeCoupon);
        jiuyunErrors++;
        errors++;
      }
    }
  });

  console.log(`JIUYUN 9YUN ELIGIBLE: ${jiuyunEligibleCount}/14`);
  console.log(`JIUYUN 9YUN EXCLUDED: ${jiuyunExcludedCount}/7`);
  
  const expectedExcluded = [
    "【流量包】365天500G",
    "【流量包】365天1000G",
    "年付200G【特惠】",
    "季付200G【特惠】",
    "年付400G【特惠】"
  ];
  const actualExcluded = jiuyunBrand.coupon?.excludedPlans || [];
  let excludedMatch = expectedExcluded.length === actualExcluded.length && expectedExcluded.every(e => actualExcluded.includes(e));
  if (excludedMatch) {
    console.log('JIUYUN EXCLUDED PLAN REFERENCES: PASS');
  } else {
    console.error('ERROR: JIUYUN EXCLUDED PLAN REFERENCES failed');
    jiuyunErrors++;
    errors++;
  }
  
  // Specific discount calculations
  function checkDiscount(planName, period, original, expectedAfter) {
     const p = jiuyunBrand.pricing.find(x => x.name === planName && x.period === period);
     const coupon = getBestCouponForPricing(jiuyunBrand, p, dateA);
     let multiplier = 1;
     if (coupon && coupon.discount) {
        const match = coupon.discount.match(/(\d+(?:\.\d+)?)折/);
        if (match) multiplier = parseFloat(match[1]) / 10;
     }
     const after = parseFloat((original * multiplier).toFixed(2));
     const saved = parseFloat((original - after).toFixed(2));
     const expectedSaved = parseFloat((original - expectedAfter).toFixed(2));
     return after === expectedAfter && saved === expectedSaved;
  }

  if (checkDiscount('招财版', '月付', 6, 4.80)) {
     console.log('JIUYUN ZHAOCAI DISCOUNT: PASS');
  } else {
     console.error('ERROR: JIUYUN ZHAOCAI DISCOUNT failed');
     jiuyunErrors++;
     errors++;
  }
  
  if (checkDiscount('聚财版', '月付', 9, 7.20)) {
     console.log('JIUYUN JUCAI DISCOUNT: PASS');
  } else {
     console.error('ERROR: JIUYUN JUCAI DISCOUNT failed');
     jiuyunErrors++;
     errors++;
  }
  
  if (checkDiscount('旺财版', '月付', 16, 12.80)) {
     console.log('JIUYUN WANGCAI DISCOUNT: PASS');
  } else {
     console.error('ERROR: JIUYUN WANGCAI DISCOUNT failed');
     jiuyunErrors++;
     errors++;
  }
  
  if (checkDiscount('不限时100G【来财版】', '一次性', 36, 28.80)) {
     console.log('JIUYUN LAICAI DISCOUNT: PASS');
  } else {
     console.error('ERROR: JIUYUN LAICAI DISCOUNT failed');
     jiuyunErrors++;
     errors++;
  }
  
  if (checkDiscount('不限时300G【鸿运版】', '一次性', 99, 79.20)) {
     console.log('JIUYUN HONGYUN DISCOUNT: PASS');
  } else {
     console.error('ERROR: JIUYUN HONGYUN DISCOUNT failed');
     jiuyunErrors++;
     errors++;
  }

  if (jiuyunExcludedCount === 7) {
    console.log('JIUYUN EXCLUSION STABILITY: PASS');
  }
  
  if (jiuyunBrand.paymentMethods && 
      jiuyunBrand.paymentMethods.includes('支付宝') && 
      jiuyunBrand.paymentMethods.includes('微信支付') && 
      !jiuyunBrand.paymentMethods.includes('USDT')) {
    console.log('JIUYUN PAYMENT METHODS: PASS');
  } else {
    console.error('ERROR: JIUYUN PAYMENT METHODS failed');
    jiuyunErrors++;
    errors++;
  }
  
  console.log(`JIUYUN COUPON CONSISTENCY: ${jiuyunErrors === 0 ? 'PASS' : 'FAIL'}`);
}
console.log('------------------------------------');

// --- Shenxing Consistency Test ---
let shenxingBrand = null;
if (fs.existsSync(path.join(brandsDir, 'shenxing.md'))) {
  const shenxingContent = fs.readFileSync(path.join(brandsDir, 'shenxing.md'), 'utf8');
  shenxingBrand = matter(shenxingContent).data;
}

if (shenxingBrand) {
  let sxErrors = 0;
  
  if (shenxingBrand.pricing.length === 18) {
    console.log('SHENXING PRICING: PASS');
  } else {
    console.error(`ERROR: Shenxing pricing should have 18 entries, found ${shenxingBrand.pricing.length}`);
    sxErrors++;
    errors++;
  }
  
  if (shenxingBrand.coupon && shenxingBrand.coupon.code === 'sx0077') {
    console.log('SHENXING COUPON CODE: PASS');
  } else {
    console.error('ERROR: Shenxing coupon code should be sx0077');
    sxErrors++;
    errors++;
  }
  
  let eligibleCount = 0;
  let excludedCount = 0;
  
  shenxingBrand.pricing.forEach(p => {
    const coupon = getBestCouponForPricing(shenxingBrand, p, dateA);
    if (coupon && coupon.code === 'sx0077' && coupon.discount === '7折') {
      eligibleCount++;
    } else {
      excludedCount++;
    }
  });
  
  console.log(`SHENXING SX0077 ELIGIBLE: ${eligibleCount}/18`);
  console.log(`SHENXING SX0077 EXCLUDED: ${excludedCount}`);
  
  if (eligibleCount === 18 && excludedCount === 0) {
    console.log('SHENXING SX0077 ELIGIBILITY: PASS');
  } else {
    console.error(`ERROR: SHENXING SX0077 eligibility mismatch: ${eligibleCount}/18, excluded=${excludedCount}`);
    sxErrors++;
    errors++;
  }
  
  function checkSxDiscount(planName, period, original, expectedAfter) {
     const p = shenxingBrand.pricing.find(x => x.name === planName && x.period === period);
     if (!p) return false;
     const coupon = getBestCouponForPricing(shenxingBrand, p, dateA);
     let multiplier = 1;
     if (coupon && coupon.discount === '7折') {
        multiplier = 0.7;
     }
     const after = parseFloat((original * multiplier).toFixed(2));
     return after === expectedAfter;
  }
  
  if (checkSxDiscount('神行·尝鲜包', '月付', 23, 16.10)) {
     console.log('SHENXING TRIAL MONTH DISCOUNT: PASS');
  } else {
     console.error('ERROR: SHENXING TRIAL MONTH DISCOUNT failed');
     sxErrors++;
     errors++;
  }
  
  if (checkSxDiscount('神行·尝鲜包', '两年付', 420, 294.00)) {
     console.log('SHENXING TRIAL 2Y DISCOUNT: PASS');
  } else {
     console.error('ERROR: SHENXING TRIAL 2Y DISCOUNT failed');
     sxErrors++;
     errors++;
  }
  
  if (checkSxDiscount('神行·基础包', '月付', 40, 28.00) && checkSxDiscount('神行·基础包', '年付', 384, 268.80)) {
     console.log('SHENXING BASIC DISCOUNT: PASS');
  } else {
     console.error('ERROR: SHENXING BASIC DISCOUNT failed');
     sxErrors++;
     errors++;
  }
  
  if (checkSxDiscount('神行·尊享包', '月付', 72, 50.40) && checkSxDiscount('神行·尊享包', '半年付', 389, 272.30) && checkSxDiscount('神行·尊享包', '两年付', 1209, 846.30)) {
     console.log('SHENXING PREMIUM DISCOUNT: PASS');
  } else {
     console.error('ERROR: SHENXING PREMIUM DISCOUNT failed');
     sxErrors++;
     errors++;
  }
  
  if (checkSxDiscount('神行-年付特惠版', '年付', 96, 67.20)) {
     console.log('SHENXING ANNUAL SPECIAL DISCOUNT: PASS');
  } else {
     console.error('ERROR: SHENXING ANNUAL SPECIAL DISCOUNT failed');
     sxErrors++;
     errors++;
  }
  
  if (shenxingBrand.nodeCoverage && shenxingBrand.nodeCoverage.counts) {
     console.log('SHENXING NODE COVERAGE: PASS');
  } else {
     console.error('ERROR: SHENXING NODE COVERAGE missing counts');
     sxErrors++;
     errors++;
  }
  
  if (shenxingBrand.maxBandwidth) {
     console.log('SHENXING BANDWIDTH: PASS');
  } else {
     console.error('ERROR: SHENXING BANDWIDTH missing');
     sxErrors++;
     errors++;
  }
  
  if (shenxingBrand.resetPackages && shenxingBrand.resetPackages.length === 3) {
     console.log('SHENXING RESET PACKAGES: PASS');
  } else {
     console.error('ERROR: SHENXING RESET PACKAGES missing or invalid');
     sxErrors++;
     errors++;
  }
}
console.log('------------------------------------');

console.log(`BITZNET VERIFIED COUPON: ${bitznetNew9Count > 0 ? 'PASS' : 'FAIL'}`);
console.log(`NEW9 ELIGIBLE PRICING: ${bitznetNew9Count}/15`);
console.log(`INVALID VERIFIED PLAN REFERENCES: ${invalidVerifiedPlans}`);
console.log(`INVALID VERIFIED PERIOD REFERENCES: ${invalidVerifiedPeriods}`);
console.log('COUPON CONSISTENCY: ' + (errors === 0 ? 'PASS' : 'FAIL'));
console.log('CONTRADICTIONS: ' + errors);

if (errors > 0) process.exit(1);
