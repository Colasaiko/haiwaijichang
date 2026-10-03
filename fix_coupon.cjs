const fs = require('fs');

let code = fs.readFileSync('src/utils/coupon.js', 'utf8');

const newCheck = `  const normalizePeriod = value => String(value || '').trim().replace(/\\s+/g, '');
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
`;

const startIndex = code.indexOf('// Check eligiblePlans');
const endIndex = code.indexOf('return true;');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newCheck + code.substring(endIndex);
  fs.writeFileSync('src/utils/coupon.js', code);
  
  let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
  const cStartIndex = checker.indexOf('// Check eligiblePlans');
  const cEndIndex = checker.indexOf('return true;', cStartIndex);
  if (cStartIndex !== -1 && cEndIndex !== -1) {
    checker = checker.substring(0, cStartIndex) + newCheck + checker.substring(cEndIndex);
    fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
  }
}
