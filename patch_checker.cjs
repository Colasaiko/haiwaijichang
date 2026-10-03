const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const target = `  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      applicableCoupons.push({ type: 'standard', ...brand.coupon });
    }
  }`;

const replacement = `  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      const isOverridden = activeTemps.some(t => t.overrideStandard === true && isCouponApplicableToPricing(brand, t, pricingEntry));
      if (!isOverridden) {
        applicableCoupons.push({ type: 'standard', ...brand.coupon });
      }
    }
  }`;

c = c.replace(target, replacement);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
