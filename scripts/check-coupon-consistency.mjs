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
    if (c.manualActive === true && !c.expiresAt) {
      if (c.startsAt && now < new Date(c.startsAt).getTime()) return false;
      return true;
    }
    if (c.manualActive === false) return false;
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

console.log('COUPON CONSISTENCY: ' + (errors === 0 ? 'PASS' : 'FAIL'));
console.log('CONTRADICTIONS: ' + errors);

if (errors > 0) process.exit(1);
