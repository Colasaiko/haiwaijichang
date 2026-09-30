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
    if (coupon.eligiblePeriods && coupon.eligiblePeriods.length > 0) {
      if (!coupon.eligiblePeriods.some(p => period.includes(p))) return false;
    }
    if (coupon.excludedPeriods && coupon.excludedPeriods.length > 0) {
      if (coupon.excludedPeriods.some(p => period.includes(p))) return false;
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

let errors = 0;
const brandsDir = path.join(process.cwd(), 'src/content/brands');
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.md'));

console.log('--- RUNNING COUPON CONSISTENCY AUDIT ---\\n');

files.forEach(file => {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  const parsed = matter(content);
  const brand = parsed.data;
  
  console.log(`[BRAND] ${brand.name || file}`);
  
  // 1. Check pricing entries
  if (brand.pricing && Array.isArray(brand.pricing)) {
    brand.pricing.forEach(p => {
      const best = getBestCouponForPricing(brand, p);
      if (p.couponEligible === false) {
        if (p.discountPrice) {
          console.error(`ERROR: ${p.name} (${p.period}) is marked couponEligible:false, but has a discountPrice!`);
          errors++;
        }
        console.log(`  - ${p.name} (${p.period}): 优惠码不适用`);
      } else {
        if (best) {
          console.log(`  - ${p.name} (${p.period}): [${best.type}] ${best.code} 可用`);
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

console.log('COUPON CONSISTENCY: ' + (errors === 0 ? 'PASS' : 'FAIL'));
console.log('CONTRADICTIONS: ' + errors);

if (errors > 0) process.exit(1);
