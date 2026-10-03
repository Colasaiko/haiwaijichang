const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

c = c.replace(/if \(!brand \|\| !pricingEntry\) return null;[\s\S]*?if \(!match\) return 1;/m, `if (!brand || !pricingEntry) return null;
  if (pricingEntry.couponEligible === false) return null;

  const now = nowParam ? new Date(nowParam).getTime() : Date.now();

  let activeTemps = [];
  if (brand.temporaryCoupons && Array.isArray(brand.temporaryCoupons)) {
    activeTemps = brand.temporaryCoupons.filter(c => {
      if (c.manualActive === false) return false;
      if (c.manualActive === true) {
        if (c.startsAt && now < new Date(c.startsAt).getTime()) return false;
        if (c.expiresAt && now > new Date(c.expiresAt).getTime()) return false;
        return true;
      }
      if (!c.startsAt || !c.expiresAt) return false;
      const start = new Date(c.startsAt).getTime();
      const end = new Date(c.expiresAt).getTime();
      return now >= start && now <= end;
    });
  }

  let applicableCoupons = [];
  if (activeTemps.length > 0) {
    for (const temp of activeTemps) {
      if (isCouponApplicableToPricing(brand, temp, pricingEntry)) {
        applicableCoupons.push({ type: "temporary", ...temp });
      }
    }
  }

  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      const isOverridden = activeTemps.some(t => t.overrideStandard === true && isCouponApplicableToPricing(brand, t, pricingEntry));
      if (!isOverridden) {
        applicableCoupons.push({ type: "standard", ...brand.coupon });
      }
    }
  }

  if (applicableCoupons.length === 0) return null;

  applicableCoupons.sort((a, b) => {
    const getMult = (c) => {
      if (!c.discountPercent) return 1;
      const m = c.discountPercent.match(/(\\d+)/);
      return m ? (1 - parseInt(m[1]) / 100) : 1;
    };
    const multA = getMult(a);
    const multB = getMult(b);
    
    if (multA !== multB) {
      return multA - multB; 
    }
    
    if (a.type === 'temporary' && b.type !== 'temporary') return -1;
    if (b.type === 'temporary' && a.type !== 'temporary') return 1;
    
    if (a.type === 'temporary' && b.type === 'temporary') {
      return (b.priority || 0) - (a.priority || 0);
    }
    
    return 0;
  });

  return applicableCoupons[0];
}

function getStandardCouponForPricing(brand, pricingEntry) {
  if (!brand || !pricingEntry) return null;
  if (pricingEntry.couponEligible === false) return null;
  if (brand.coupon && isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
    return { type: "standard", ...brand.coupon };
  }
  return null;
}

function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\\d+)/);
  if (!match) return 1;`);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
