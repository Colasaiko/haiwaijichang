const fs = require('fs');

let c = fs.readFileSync('src/utils/coupon.js', 'utf8');

const target = `  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      applicableCoupons.push({ type: 'standard', ...brand.coupon });
    }
  }`;

const replacement = `  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      // Check if any active temp coupon overrides standard
      const isOverridden = activeTemps.some(t => t.overrideStandard === true && isCouponApplicableToPricing(brand, t, pricingEntry));
      if (!isOverridden) {
        applicableCoupons.push({ type: 'standard', ...brand.coupon });
      }
    }
  }`;

c = c.replace(target, replacement);

fs.writeFileSync('src/utils/coupon.js', c);
