const fs = require('fs');
let code = fs.readFileSync('src/utils/coupon.js', 'utf8');

const regex = /export function isCouponApplicableToPricing[\s\S]*?return true;\n\}/;

const newFunc = `export function isCouponApplicableToPricing(brand, coupon, pricingEntry) {
  if (!pricingEntry || !coupon) return false;

  // Highest priority rule: if pricing entry explicitly forbids coupons
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
    // Check eligiblePlans
    if (coupon.eligiblePlans && Array.isArray(coupon.eligiblePlans) && coupon.eligiblePlans.length > 0) {
      const isEligible = coupon.eligiblePlans.some(p => planName.includes(p));
      if (!isEligible) return false;
    }

    // Check eligiblePeriods
    if (coupon.eligiblePeriods && Array.isArray(coupon.eligiblePeriods) && coupon.eligiblePeriods.length > 0) {
      const isEligible = coupon.eligiblePeriods.some(p => normPeriod === normalizePeriod(p));
      if (!isEligible) return false;
    }
  }

  // Check excludedPlans
  if (coupon.excludedPlans && Array.isArray(coupon.excludedPlans) && coupon.excludedPlans.length > 0) {
    const isExcluded = coupon.excludedPlans.some(p => planName.includes(p));
    if (isExcluded) return false;
  }

  // Check excludedPeriods
  if (coupon.excludedPeriods && Array.isArray(coupon.excludedPeriods) && coupon.excludedPeriods.length > 0) {
    const isExcluded = coupon.excludedPeriods.some(p => normPeriod === normalizePeriod(p));
    if (isExcluded) return false;
  }

  return true;
}`;

code = code.replace(regex, newFunc);
fs.writeFileSync('src/utils/coupon.js', code);
