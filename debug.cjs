const fs = require('fs');
const matter = require('gray-matter');

const md = fs.readFileSync('src/content/brands/jilian.md', 'utf8');
const brand = matter(md).data;

const p = brand.pricing.find(x => x.name === '极连云 · 基础套餐' && x.period === '月付');

function isCouponApplicableToPricing(brand, coupon, pricingEntry) {
  if (!pricingEntry || !coupon) return false;
  if (pricingEntry.couponEligible === false) return false;
  
  const planName = pricingEntry.name || pricingEntry.plan || pricingEntry.label || "";
  const period = pricingEntry.period || "";
  
  const normalizePeriod = value => String(value || '').trim().replace(/\s+/g, '');
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

let activeTemps = (brand.temporaryCoupons || []).filter(c => {
  if (c.manualActive === false) return false;
  if (c.manualActive === true) {
    return true;
  }
  return false;
});

let applicableCoupons = [];
for (const temp of activeTemps) {
  if (isCouponApplicableToPricing(brand, temp, p)) {
    applicableCoupons.push({ type: 'temporary', ...temp });
  }
}
if (brand.coupon && isCouponApplicableToPricing(brand, brand.coupon, p)) {
  applicableCoupons.push({ type: 'standard', ...brand.coupon });
}

console.log('Applicable coupons:', applicableCoupons);

applicableCoupons.sort((a, b) => {
  const getMult = (c) => {
    if (!c.discountPercent) return 1;
    const m = c.discountPercent.match(/(\d+)/);
    return m ? (1 - parseInt(m[1]) / 100) : 1;
  };
  const multA = getMult(a);
  const multB = getMult(b);
  
  if (multA !== multB) return multA - multB;
  if (a.type === 'temporary' && b.type !== 'temporary') return -1;
  if (b.type === 'temporary' && a.type !== 'temporary') return 1;
  if (a.type === 'temporary' && b.type === 'temporary') return (b.priority || 0) - (a.priority || 0);
  return 0;
});

console.log('Best coupon:', applicableCoupons[0] && applicableCoupons[0].code);

