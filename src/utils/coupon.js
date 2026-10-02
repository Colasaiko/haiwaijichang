// File: src/utils/coupon.js

/**
 * Gets the active general coupon (ignoring specific pricing entries).
 * This is primarily for the Hero section, QuickFacts, etc. where we just need "what's currently running".
 */
export function getActiveCoupon(brand, clientDate = new Date()) {
  if (!brand) return null;

  const now = new Date(clientDate).getTime();

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

  if (activeTemps.length > 0) {
    activeTemps.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const bestTemp = activeTemps[0];
    return {
      type: "temporary",
      ...bestTemp
    };
  }

  if (brand.coupon) {
    return {
      type: "standard",
      ...brand.coupon
    };
  }

  return null;
}

/**
 * Helper to calculate discount multiplier from a coupon object.
 */
export function isCouponApplicableToPricing(brand, coupon, pricingEntry) {
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

export function getBestCouponForPricing(brand, pricingEntry, nowParam) {
  if (!brand || !pricingEntry) return null;
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
        applicableCoupons.push({ type: 'temporary', ...temp });
      }
    }
  }

  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      // Check if any active temp coupon overrides standard
      const isOverridden = activeTemps.some(t => t.overrideStandard === true && isCouponApplicableToPricing(brand, t, pricingEntry));
      if (!isOverridden) {
        applicableCoupons.push({ type: 'standard', ...brand.coupon });
      }
    }
  }

  if (applicableCoupons.length === 0) return null;

  applicableCoupons.sort((a, b) => {
    const getMult = (c) => {
      if (!c.discountPercent) return 1;
      const m = c.discountPercent.match(/(\d+)/);
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

export function getStandardCouponForPricing(brand, pricingEntry) {
  if (!brand || !pricingEntry) return null;
  if (pricingEntry.couponEligible === false) return null;
  if (brand.coupon && isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
    return { type: "standard", ...brand.coupon };
  }
  return null;
}

export function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\d+)/);
  if (match) return 1 - (parseInt(match[1]) / 100);
  return 1;
}

/**
 * Gets a verified coupon for a specific pricing entry (ignoring standard/temp).
 * Used only for UI rendering to show users that a verified coupon exists for this plan,
 * but it DOES NOT resolve to the main price (because usage may be limited).
 */
export function getVerifiedCouponForPricing(brand, pricingEntry) {
  if (!brand || !pricingEntry) return null;
  if (pricingEntry.couponEligible === false) return null;

  if (brand.verifiedCoupons && Array.isArray(brand.verifiedCoupons)) {
    const workingCoupons = brand.verifiedCoupons.filter(c => c.status === 'verified-currently-working');
    for (const vc of workingCoupons) {
      if (isCouponApplicableToPricing(brand, vc, pricingEntry)) {
        return { type: "verified", ...vc };
      }
    }
  }

  return null;
}
