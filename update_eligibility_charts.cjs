const fs = require('fs');

function applyEligibilityCheck(filePath, isCouponComparison = false) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('function checkPlanEligibility')) {
    const fn = `
function checkPlanEligibility(planLabel, activeCoupon, visualEligibility) {
  if (activeCoupon?.type !== 'temporary') return true;
  
  // 1. Check activeCoupon explicit lists
  if (activeCoupon.eligiblePlans && activeCoupon.eligiblePlans.length > 0) {
    // Exact match or includes (e.g. "月付" or plan name)
    return activeCoupon.eligiblePlans.some(p => planLabel.includes(p));
  }
  if (activeCoupon.excludedPlans && activeCoupon.excludedPlans.length > 0) {
    if (activeCoupon.excludedPlans.some(p => planLabel.includes(p))) return false;
  }
  
  // 2. Fallback to brand visualData couponEligibility if exists
  if (visualEligibility) {
    const matched = visualEligibility.find(e => e.label === planLabel);
    if (matched && matched.eligible === false) return false;
  }
  
  return true;
}
`;
    content = content.replace(/function getDiscountMultiplier/g, fn + '\nfunction getDiscountMultiplier');
  }
  
  if (!isCouponComparison) {
    content = content.replace(/activeCoupon\?\.type === 'temporary' && d\.original && brand\.visualData\?\.couponEligibility\?\.find\(e => e\.label === d\.label\)\?\.eligible !== false/g, `activeCoupon?.type === 'temporary' && d.original && checkPlanEligibility(d.label, activeCoupon, brand.visualData?.couponEligibility)`);
  } else {
    content = content.replace(/if \(activeCoupon\?\.type === 'temporary' && data\.before\)/g, `if (activeCoupon?.type === 'temporary' && data.before && checkPlanEligibility(data.plan + " " + data.period, activeCoupon, brand.visualData?.couponEligibility))`);
  }
  
  fs.writeFileSync(filePath, content);
}

applyEligibilityCheck('src/components/charts/AnnualPriceChart.astro');
applyEligibilityCheck('src/components/charts/UnlimitedTrafficChart.astro');
applyEligibilityCheck('src/components/charts/CouponComparison.astro', true);

console.log('Eligibility checks added to charts.');
