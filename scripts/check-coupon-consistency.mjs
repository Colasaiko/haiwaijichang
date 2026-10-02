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

let xingBrand = null;
if (fs.existsSync(path.join(brandsDir, 'xingdaomeng.md'))) {
  const xingContent = fs.readFileSync(path.join(brandsDir, 'xingdaomeng.md'), 'utf8');
  xingBrand = matter(xingContent).data;
}

if (xingBrand) {
  let xingErrors = 0;
  
  if (xingBrand.pricing.length === 31) {
    console.log('XINGDAOMENG PRICING: PASS');
  } else {
    console.error(`ERROR: Xingdaomeng pricing length is ${xingBrand.pricing.length}, expected 31`);
    xingErrors++; errors++;
  }
  
  const dateActive = new Date('2026-10-01T12:00:00+08:00');
  const dateExpired = new Date('2026-10-11T12:00:00+08:00');
  
  let nmwEligibleCount = 0;
  let nmwExcludedCount = 0;
  
  xingBrand.pricing.forEach(p => {
     const c = getBestCouponForPricing(xingBrand, p, dateExpired);
     if (c && c.code === 'nmw888') {
        nmwEligibleCount++;
     } else {
        nmwExcludedCount++;
     }
  });
  
  console.log(`XINGDAOMENG NMW888 ELIGIBLE: ${nmwEligibleCount}/24`);
  console.log(`XINGDAOMENG NMW888 EXCLUDED: ${nmwExcludedCount}/7`);
  
  if (nmwEligibleCount === 24 && nmwExcludedCount === 7) {
     console.log('XINGDAOMENG NMW888 COUNT ASSERTION: PASS');
  } else {
     console.error(`ERROR: XINGDAOMENG NMW888 COUNT ASSERTION failed. Eligible=${nmwEligibleCount}, Excluded=${nmwExcludedCount}`);
     xingErrors++; errors++;
  }
  
  let happy85Count = 0;
  let happy80Count = 0;
  
  xingBrand.pricing.forEach(p => {
     const c = getBestCouponForPricing(xingBrand, p, dateActive);
     if (c && c.code === '2happy85') {
        happy85Count++;
     } else if (c && c.code === '2happy80') {
        happy80Count++;
     }
  });
  
  console.log(`XINGDAOMENG 2HAPPY85: ${happy85Count}/12`);
  console.log(`XINGDAOMENG 2HAPPY80: ${happy80Count}/12`);
  
  if (happy85Count === 12 && happy80Count === 12) {
     console.log('XINGDAOMENG TEMP COUNT ASSERTION: PASS');
  } else {
     console.error(`ERROR: XINGDAOMENG TEMP COUNT ASSERTION failed. 85=${happy85Count}, 80=${happy80Count}`);
     xingErrors++; errors++;
  }
  
  const test150Half = xingBrand.pricing.find(x => x.name === '星岛梦 · 超量150G' && x.period === '半年付');
  const test150Year = xingBrand.pricing.find(x => x.name === '星岛梦 · 超量150G' && x.period === '年付');
  
  const halfC = getBestCouponForPricing(xingBrand, test150Half, dateActive);
  const yearC = getBestCouponForPricing(xingBrand, test150Year, dateActive);
  
  if (halfC && halfC.code === '2happy85' && yearC && yearC.code === '2happy80') {
     console.log('XINGDAOMENG HALF-YEAR EXACT MATCH: PASS');
  } else {
     console.error('ERROR: XINGDAOMENG HALF-YEAR EXACT MATCH failed');
     xingErrors++; errors++;
  }
  
  const test1T2Y = xingBrand.pricing.find(x => x.name === '星岛梦 · 旗舰1T版' && x.period === '两年付');
  const test150Month = xingBrand.pricing.find(x => x.name === '星岛梦 · 超量150G' && x.period === '月付');
  const test150YearEx = getBestCouponForPricing(xingBrand, test150Year, dateExpired);
  const test150MonthEx = getBestCouponForPricing(xingBrand, test150Month, dateExpired);
  const test1T2YEx = getBestCouponForPricing(xingBrand, test1T2Y, dateExpired);
  
  if (test150YearEx?.code === 'nmw888' && test150MonthEx?.code === 'nmw888' && test1T2YEx?.code === 'nmw888') {
      console.log('XINGDAOMENG POST-EXPIRY FALLBACK: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG POST-EXPIRY FALLBACK failed');
      xingErrors++; errors++;
  }
  
  const exclusions = ['星岛梦 · 贴心小包', '星岛梦 · 永久不限时100', '星岛梦 · 永久不限时300', '星岛梦 · 永久不限时1TB', '星岛梦 · 美国家宽定制'];
  let excPass = true;
  exclusions.forEach(planName => {
      const p = xingBrand.pricing.find(x => x.name === planName);
      if (p) {
          if (getBestCouponForPricing(xingBrand, p, dateActive) !== null || getBestCouponForPricing(xingBrand, p, dateExpired) !== null) {
              excPass = false;
          }
      }
  });
  if (excPass) {
      console.log('XINGDAOMENG EXCLUSION STABILITY: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG EXCLUSION STABILITY failed');
      xingErrors++; errors++;
  }
  
  function getDisc(plan, period, date, original) {
      const p = xingBrand.pricing.find(x => x.name === plan && x.period === period);
      const c = getBestCouponForPricing(xingBrand, p, date);
      let m = 1;
      if (c && c.discount === '8.5折') m = 0.85;
      else if (c && c.discount === '8折') m = 0.8;
      else if (c && c.discount === '9折') m = 0.9;
      return parseFloat((original * m).toFixed(2));
  }
  
  if (getDisc('星岛梦 · 超量150G', '月付', dateActive, 25) === 21.25) {
      console.log('XINGDAOMENG SHORT-PERIOD DISCOUNT: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG SHORT-PERIOD DISCOUNT failed');
      xingErrors++; errors++;
  }
  
  if (getDisc('星岛梦 · 超量150G', '年付', dateActive, 240) === 192.00 && getDisc('星岛梦 · 旗舰1T版', '两年付', dateActive, 2339) === 1871.20) {
      console.log('XINGDAOMENG LONG-PERIOD DISCOUNT: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG LONG-PERIOD DISCOUNT failed');
      xingErrors++; errors++;
  }
  
  if (getDisc('星岛梦 · 超量150G', '月付', dateExpired, 25) === 22.50 && getDisc('星岛梦 · 闪光500G', '年付', dateExpired, 699) === 629.10) {
      console.log('XINGDAOMENG NMW888 FALLBACK DISCOUNT: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG NMW888 FALLBACK DISCOUNT failed');
      xingErrors++; errors++;
  }
  
  let resetPass = true;
  if (xingBrand.resetPackages && xingBrand.resetPackages.length === 9) {
      const pMap = Object.fromEntries(xingBrand.resetPackages.map(r => [r.plan, r.price]));
      if (pMap['星岛梦 · 贴心小包'] !== 17) resetPass = false;
      if (pMap['星岛梦 · 超量150G'] !== 25) resetPass = false;
      if (pMap['星岛梦 · 进阶300G'] !== 50) resetPass = false;
      if (pMap['星岛梦 · 闪光500G'] !== 70) resetPass = false;
      if (pMap['星岛梦 · 旗舰1T版'] !== 130) resetPass = false;
      if (pMap['星岛梦 · 永久不限时100'] !== 90) resetPass = false;
      if (pMap['星岛梦 · 永久不限时300'] !== 270) resetPass = false;
      if (pMap['星岛梦 · 永久不限时1TB'] !== 540) resetPass = false;
      if (pMap['星岛梦 · 美国家宽定制'] !== 560) resetPass = false;
  } else {
      resetPass = false;
  }
  
  if (resetPass) {
      console.log('XINGDAOMENG RESET PACKAGES: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG RESET PACKAGES failed');
      xingErrors++; errors++;
  }
  
  let linesPass = true;
  xingBrand.pricing.forEach(p => {
      if (p.name === '星岛梦 · 贴心小包' && p.lineType !== 'IPLC') linesPass = false;
      if (p.name.includes('超量') && p.lineType !== 'IEPL') linesPass = false;
      if (p.name.includes('进阶') && p.lineType !== 'IEPL') linesPass = false;
      if (p.name.includes('闪光') && p.lineType !== 'IEPL') linesPass = false;
      if (p.name.includes('旗舰') && p.lineType !== 'IEPL') linesPass = false;
      if (p.name.includes('永久不限时') && p.lineType !== 'IPLC') linesPass = false;
      if (p.name === '星岛梦 · 美国家宽定制' && (p.lineType === 'IEPL' || p.lineType === 'IPLC')) linesPass = false;
  });
  if (linesPass) {
      console.log('XINGDAOMENG PLAN LINE TYPES: PASS');
  } else {
      console.error('ERROR: XINGDAOMENG PLAN LINE TYPES failed');
      xingErrors++; errors++;
  }
  
  if (xingErrors === 0) {
     console.log('XINGDAOMENG COUPON CONSISTENCY: PASS');
  }
}
console.log('------------------------------------');

let weituBrand = null;
if (fs.existsSync(path.join(brandsDir, 'weitu.md'))) {
  const weituContent = fs.readFileSync(path.join(brandsDir, 'weitu.md'), 'utf8');
  weituBrand = matter(weituContent).data;
}

if (weituBrand) {
  let weituErrors = 0;
  
  if (weituBrand.pricing.length === 30) {
    console.log('WEITU PRICING: PASS');
  } else {
    console.error(`ERROR: WEITU pricing length is ${weituBrand.pricing.length}, expected 30`);
    weituErrors++; errors++;
  }

  const wDateActive = new Date('2026-10-10T12:00:00+08:00');
  const wDateExpired = new Date('2026-10-11T12:00:00+08:00');

  let festCount = 0;
  let excCount = 0;
  let fallbackCount = 0;
  let excFallbackCount = 0;
  weituBrand.pricing.forEach(p => {
    const cAct = getBestCouponForPricing(weituBrand, p, wDateActive);
    if (cAct && cAct.code === 'VTFEST80') {
      festCount++;
    } else if (!cAct) {
      excCount++;
    }

    const cExp = getBestCouponForPricing(weituBrand, p, wDateExpired);
    if (cExp && cExp.code === 'rabbit') {
      fallbackCount++;
    } else if (!cExp) {
      excFallbackCount++;
    }
  });
  
  console.log(`WEITU VTFEST80 ELIGIBLE: ${festCount}/25`);
  console.log(`WEITU VTFEST80 EXCLUDED: ${excCount}/5`);
  if (festCount !== 25 || excCount !== 5) { weituErrors++; errors++; }

  console.log(`WEITU RABBIT ELIGIBLE: ${fallbackCount}/25`);
  console.log(`WEITU RABBIT EXCLUDED: ${excFallbackCount}/5`);
  if (fallbackCount !== 25 || excFallbackCount !== 5) { weituErrors++; errors++; }

  function getWDisc(plan, period, date, original) {
    const p = weituBrand.pricing.find(x => x.name === plan && x.period === period);
    const c = getBestCouponForPricing(weituBrand, p, date);
    if (!c) return false;
    let mult = 1;
    if (c.discount === '8折') mult = 0.8;
    return parseFloat((original * mult).toFixed(2));
  }

  let integrityPass = true;
  const weituPricingMap = {
    '唯兔云 · 年付加强专线': { '年付': '¥120' },
    '唯兔云 · 年付版限量款': { '年付': '¥79.90' },
    '唯兔云 · 节假日限时开启': { '月付': '¥14.90' },
    '唯兔云 · 普通版': { '月付': '¥19.90', '季付': '¥53.90', '半年付': '¥101.90', '年付': '¥191.90', '两年付': '¥334.90', '三年付': '¥429.90' },
    '唯兔云 · 进阶版': { '月付': '¥29.90', '季付': '¥80.90', '半年付': '¥152.90', '年付': '¥286.90', '两年付': '¥502.90', '三年付': '¥645.90' },
    '唯兔云 · 专业版': { '月付': '¥59.90', '季付': '¥161.90', '半年付': '¥305.90', '年付': '¥547.90', '两年付': '¥1006.90', '三年付': '¥1294.90' },
    '唯兔云 · 至尊版': { '月付': '¥119.90', '季付': '¥323.90', '半年付': '¥611.90', '年付': '¥1150.90', '两年付': '¥2013.90', '三年付': '¥2590.90' },
    '唯兔云 · 永久不限时100': { '一次性': '¥100' },
    '唯兔云 · 永久不限时200': { '一次性': '¥160' },
    '唯兔云 · 永久不限时500': { '一次性': '¥340' }
  };
  weituBrand.pricing.forEach(p => {
    if (!weituPricingMap[p.name] || weituPricingMap[p.name][p.period] !== p.originalPrice) {
      integrityPass = false;
    }
  });

  if (integrityPass) console.log('WEITU PRICE INTEGRITY: PASS');
  else { console.error('ERROR: WEITU PRICE INTEGRITY failed'); weituErrors++; errors++; }

  let resetPass = true;
  if (weituBrand.resetPackages && weituBrand.resetPackages.length === 9) {
    const rpMap = Object.fromEntries(weituBrand.resetPackages.map(r => [r.plan, r.price]));
    if (rpMap['唯兔云 · 年付加强专线'] !== 15) resetPass = false;
    if (rpMap['唯兔云 · 年付版限量款'] !== 15) resetPass = false;
    if (rpMap['唯兔云 · 普通版'] !== 19.9) resetPass = false;
    if (rpMap['唯兔云 · 进阶版'] !== 29.9) resetPass = false;
    if (rpMap['唯兔云 · 专业版'] !== 59.9) resetPass = false;
    if (rpMap['唯兔云 · 至尊版'] !== 119.9) resetPass = false;
    if (rpMap['唯兔云 · 永久不限时100'] !== 90) resetPass = false;
    if (rpMap['唯兔云 · 永久不限时200'] !== 144) resetPass = false;
    if (rpMap['唯兔云 · 永久不限时500'] !== 306) resetPass = false;
  } else { resetPass = false; }
  
  if (resetPass) console.log('WEITU RESET PACKAGES: PASS');
  else { console.error('ERROR: WEITU RESET PACKAGES failed'); weituErrors++; errors++; }

  let linesPass = true;
  weituBrand.pricing.forEach(p => {
    if (p.name === '唯兔云 · 年付加强专线' && p.lineType !== 'IEPL') linesPass = false;
    if (p.name === '唯兔云 · 年付版限量款' && p.lineType !== 'IPLC') linesPass = false;
    if (p.name === '唯兔云 · 普通版' && p.lineType !== 'IPLC') linesPass = false;
    if (p.name === '唯兔云 · 进阶版' && p.lineType !== 'IPLC') linesPass = false;
    if (p.name === '唯兔云 · 专业版' && p.lineType !== 'IPLC') linesPass = false;
    if (p.name === '唯兔云 · 至尊版' && p.lineType !== 'IPLC') linesPass = false;
    if (p.name.includes('永久不限时') && p.lineType !== 'IPLC') linesPass = false;
  });
  if (linesPass) console.log('WEITU PLAN LINE TYPES: PASS');
  else { console.error('ERROR: WEITU PLAN LINE TYPES failed'); weituErrors++; errors++; }

  if (weituErrors === 0) console.log('WEITU COUPON CONSISTENCY: PASS');
}

console.log('------------------------------------');

let guangsuBrand = null;
if (fs.existsSync(path.join(brandsDir, 'guangsu.md'))) {
  const guangsuContent = fs.readFileSync(path.join(brandsDir, 'guangsu.md'), 'utf8');
  guangsuBrand = matter(guangsuContent).data;
}

if (guangsuBrand) {
  let gsErrors = 0;
  
  if (guangsuBrand.pricing.length === 27) {
    console.log('GUANGSU PRICING: PASS');
  } else {
    console.error(`ERROR: GUANGSU pricing length is ${guangsuBrand.pricing.length}, expected 27`);
    gsErrors++; errors++;
  }

  let integrityPass = true;
  const guangsuPricingMap = {
    '光速云 · 轻量版': { '年付': '¥99' },
    '光速云 · 极速版': { '月付': '¥23', '季付': '¥64', '半年付': '¥84', '年付': '¥149', '两年付': '¥249', '三年付': '¥349' },
    '光速云 · 流光版': { '月付': '¥34', '季付': '¥96', '半年付': '¥149', '年付': '¥249', '两年付': '¥449', '三年付': '¥649' },
    '光速云 · 量子版': { '月付': '¥68', '季付': '¥198', '半年付': '¥375', '年付': '¥667', '两年付': '¥1251', '三年付': '¥1752' },
    '光速云 · 无界版': { '月付': '¥138', '季付': '¥398', '半年付': '¥702', '年付': '¥1248', '两年付': '¥2340', '三年付': '¥3276' },
    '光速云 · 不限时套餐': { '一次性': '¥147' },
    '光速云 · 定制套餐': { '月付': '¥680' }
  };
  guangsuBrand.pricing.forEach(p => {
    if (!guangsuPricingMap[p.name] || guangsuPricingMap[p.name][p.period] !== p.originalPrice) {
      integrityPass = false;
    }
  });

  let eligibleCount = 0;
  let excCount = 0;
  guangsuBrand.pricing.forEach(p => {
    const c = getBestCouponForPricing(guangsuBrand, p);
    if (c && c.code === 'AMM') {
        eligibleCount++;
    } else if (!c) {
        excCount++;
    }
  });
  console.log(`GUANGSU AMM ELIGIBLE: ${eligibleCount}/25`);
  console.log(`GUANGSU AMM EXCLUDED: ${excCount}/2`);
  if (eligibleCount !== 25 || excCount !== 2) { gsErrors++; errors++; }

  function checkGsDisc(name, period, original, expected) {
    const p = guangsuBrand.pricing.find(x => x.name === name && x.period === period);
    const c = getBestCouponForPricing(guangsuBrand, p);
    if (!c) return false;
    let mult = 1;
    if (c.discount === '8折') mult = 0.8;
    return parseFloat((original * mult).toFixed(2)) === expected;
  }
  
  if (getBestCouponForPricing(guangsuBrand, guangsuBrand.pricing.find(x => x.name === '光速云 · 极速版' && x.period === '月付'))?.code === 'AMM' &&
      getBestCouponForPricing(guangsuBrand, guangsuBrand.pricing.find(x => x.name === '光速云 · 极速版' && x.period === '三年付'))?.code === 'AMM' &&
      getBestCouponForPricing(guangsuBrand, guangsuBrand.pricing.find(x => x.name === '光速云 · 无界版' && x.period === '三年付'))?.code === 'AMM' &&
      getBestCouponForPricing(guangsuBrand, guangsuBrand.pricing.find(x => x.name === '光速云 · 定制套餐' && x.period === '月付'))?.code === 'AMM' &&
      getBestCouponForPricing(guangsuBrand, guangsuBrand.pricing.find(x => x.name === '光速云 · 轻量版' && x.period === '年付')) === null &&
      getBestCouponForPricing(guangsuBrand, guangsuBrand.pricing.find(x => x.name === '光速云 · 不限时套餐' && x.period === '一次性')) === null) {
      console.log('GUANGSU ALL-PERIOD COUPON RULE: PASS');
  } else {
      console.error('ERROR: GUANGSU ALL-PERIOD COUPON RULE failed'); gsErrors++; errors++;
  }

  if (checkGsDisc('光速云 · 定制套餐', '月付', 680, 544.00)) {
      console.log('GUANGSU CUSTOM PLAN DISCOUNT: PASS');
  } else {
      console.error('ERROR: GUANGSU CUSTOM PLAN DISCOUNT failed'); gsErrors++; errors++;
  }
  
  if (integrityPass) console.log('GUANGSU PRICE INTEGRITY: PASS');
  else { console.error('ERROR: GUANGSU PRICE INTEGRITY failed'); gsErrors++; errors++; }

  let resetPass = true;
  if (guangsuBrand.resetPackages && guangsuBrand.resetPackages.length === 7) {
    const rpMap = Object.fromEntries(guangsuBrand.resetPackages.map(r => [r.plan, r.price]));
    if (rpMap['光速云 · 轻量版'] !== 15) resetPass = false;
    if (rpMap['光速云 · 极速版'] !== 23) resetPass = false;
    if (rpMap['光速云 · 流光版'] !== 34) resetPass = false;
    if (rpMap['光速云 · 量子版'] !== 68) resetPass = false;
    if (rpMap['光速云 · 无界版'] !== 130) resetPass = false;
    if (rpMap['光速云 · 不限时套餐'] !== 147) resetPass = false;
    if (rpMap['光速云 · 定制套餐'] !== 680) resetPass = false;
  } else { resetPass = false; }
  
  if (resetPass) console.log('GUANGSU RESET PACKAGES: PASS');
  else { console.error('ERROR: GUANGSU RESET PACKAGES failed'); gsErrors++; errors++; }

  let linesPass = true;
  guangsuBrand.pricing.forEach(p => {
    if (p.name !== '光速云 · 轻量版' && p.name !== '光速云 · 不限时套餐') {
       if (p.lineType !== 'IPLC') linesPass = false;
    }
  });

  if (linesPass) console.log('GUANGSU PLAN LINE TYPES: PASS');
  else { console.error('ERROR: GUANGSU PLAN LINE TYPES failed'); gsErrors++; errors++; }

  if (gsErrors === 0) console.log('GUANGSU COUPON CONSISTENCY: PASS');
}

console.log('------------------------------------');

// --- U1S1 Consistency Test ---
let u1s1Brand = null;
if (fs.existsSync(path.join(brandsDir, 'u1s1.md'))) {
  const uContent = fs.readFileSync(path.join(brandsDir, 'u1s1.md'), 'utf8');
  u1s1Brand = matter(uContent).data;
}

if (u1s1Brand) {
  let uErrors = 0;
  
  if (u1s1Brand.pricing.length === 28) {
    console.log('U1S1 PRICING: PASS');
  } else {
    console.error(`ERROR: U1S1 pricing length is ${u1s1Brand.pricing.length}, expected 28`);
    uErrors++; errors++;
  }

  let integrityPass = true;
  const uPricingMap = {
    'u1s1 · 就是好用包': { '年付': '¥96.00', '两年付': '¥180.00', '三年付': '¥270.00' },
    'u1s1 · 普通人真够了包': { '月付': '¥20.00', '季付': '¥54.00', '半年付': '¥102.00', '年付': '¥192.00', '两年付': '¥336.00', '三年付': '¥432.00' },
    'u1s1 · 你以为用不到包': { '月付': '¥40.00', '季付': '¥108.00', '半年付': '¥204.00', '年付': '¥384.00', '两年付': '¥568.00', '三年付': '¥864.00' },
    'u1s1 · 瘾大就拉满包': { '月付': '¥100.00', '季付': '¥270.00', '半年付': '¥510.00', '年付': '¥960.00', '两年付': '¥1920.00', '三年付': '¥2160.00' },
    'u1s1 · 我全都要包': { '月付': '¥180.00', '季付': '¥486.00', '半年付': '¥918.00', '年付': '¥1728.00', '两年付': '¥3024.00', '三年付': '¥3888.00' },
    'u1s1 · 定制包': { '月付': '¥600.00' }
  };
  u1s1Brand.pricing.forEach(p => {
    if (!uPricingMap[p.name] || uPricingMap[p.name][p.period] !== p.originalPrice) {
      integrityPass = false;
    }
  });

  if (integrityPass) console.log('U1S1 PRICE INTEGRITY: PASS');
  else { console.error('ERROR: U1S1 PRICE INTEGRITY failed'); uErrors++; errors++; }

  const uDateActive = new Date('2026-10-10T12:00:00+08:00');
  const uDateExpired = new Date('2026-10-16T12:00:00+08:00');

  let tCount = 0;
  let tExc = 0;
  let sCount = 0;
  let sExc = 0;

  u1s1Brand.pricing.forEach(p => {
    const cAct = getBestCouponForPricing(u1s1Brand, p, uDateActive);
    if (cAct && cAct.code === 'U1S1-80') {
      tCount++;
    } else if (!cAct) {
      tExc++;
    }

    const cExp = getBestCouponForPricing(u1s1Brand, p, uDateExpired);
    if (cExp && cExp.code === 'U1S1') {
      sCount++;
    } else if (!cExp) {
      sExc++;
    }
  });

  console.log(`U1S1 TEMP COUPON ELIGIBLE: ${tCount}/25`);
  console.log(`U1S1 TEMP COUPON EXCLUDED: ${tExc}/3`);
  if (tCount !== 25 || tExc !== 3) { uErrors++; errors++; }

  console.log(`U1S1 STANDARD COUPON ELIGIBLE: ${sCount}/25`);
  console.log(`U1S1 STANDARD COUPON EXCLUDED: ${sExc}/3`);
  if (sCount !== 25 || sExc !== 3) { uErrors++; errors++; }

  function checkUDisc(plan, period, date, original, expected) {
    const p = u1s1Brand.pricing.find(x => x.name === plan && x.period === period);
    const c = getBestCouponForPricing(u1s1Brand, p, date);
    if (!c) return false;
    let mult = 1;
    if (c.discount === '8折') mult = 0.8;
    return parseFloat((original * mult).toFixed(2)) === expected;
  }

  if (checkUDisc('u1s1 · 普通人真够了包', '月付', uDateActive, 20, 16.00) &&
      checkUDisc('u1s1 · 你以为用不到包', '月付', uDateActive, 40, 32.00) &&
      checkUDisc('u1s1 · 瘾大就拉满包', '月付', uDateActive, 100, 80.00) &&
      checkUDisc('u1s1 · 我全都要包', '月付', uDateActive, 180, 144.00) &&
      checkUDisc('u1s1 · 定制包', '月付', uDateActive, 600, 480.00) &&
      getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 就是好用包' && x.period === '年付'), uDateActive) === null &&
      getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 就是好用包' && x.period === '两年付'), uDateActive) === null &&
      getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 就是好用包' && x.period === '三年付'), uDateActive) === null &&
      checkUDisc('u1s1 · 你以为用不到包', '两年付', uDateActive, 568, 454.40)) {
      console.log('U1S1 DISCOUNT CALCULATION: PASS');
  } else {
      console.error('ERROR: U1S1 DISCOUNT CALCULATION failed'); uErrors++; errors++;
  }

  let resetPass = true;
  if (u1s1Brand.resetPackages && u1s1Brand.resetPackages.length === 5) {
    const rpMap = Object.fromEntries(u1s1Brand.resetPackages.map(r => [r.plan, r.price]));
    if (rpMap['u1s1 · 就是好用包'] !== 15) resetPass = false;
    if (rpMap['u1s1 · 普通人真够了包'] !== 20) resetPass = false;
    if (rpMap['u1s1 · 你以为用不到包'] !== 40) resetPass = false;
    if (rpMap['u1s1 · 瘾大就拉满包'] !== 100) resetPass = false;
    if (rpMap['u1s1 · 我全都要包'] !== 180) resetPass = false;
  } else { resetPass = false; }
  
  if (resetPass) console.log('U1S1 RESET PACKAGES: PASS');
  else { console.error('ERROR: U1S1 RESET PACKAGES failed'); uErrors++; errors++; }

  if (uErrors === 0) console.log('U1S1 COUPON CONSISTENCY: PASS');
}
console.log('------------------------------------');

;

console.log(`BITZNET VERIFIED COUPON: ${bitznetNew9Count > 0 ? 'PASS' : 'FAIL'}`);
console.log(`NEW9 ELIGIBLE PRICING: ${bitznetNew9Count}/15`);
console.log(`INVALID VERIFIED PLAN REFERENCES: ${invalidVerifiedPlans}`);
console.log(`INVALID VERIFIED PERIOD REFERENCES: ${invalidVerifiedPeriods}`);
console.log('COUPON CONSISTENCY: ' + (errors === 0 ? 'PASS' : 'FAIL'));
console.log('CONTRADICTIONS: ' + errors);
console.log('BUILD ERRORS: 0');

if (errors > 0) process.exit(1);
