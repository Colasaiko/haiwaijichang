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
 * Checks if a SPECIFIC coupon is applicable to a SPECIFIC pricing entry.
 * @param {Object} brand - The full brand object (to check global rules if needed)
 * @param {Object} coupon - The coupon object (can be standard or temporary)
 * @param {Object} pricingEntry - The pricing entry containing { name, period, couponEligible }
 * @returns {boolean} - True if applicable, false otherwise.
 */
export function isCouponApplicableToPricing(brand, coupon, pricingEntry) {
  if (!pricingEntry || !coupon) return false;

  // Highest priority rule: if pricing entry explicitly forbids coupons
  if (pricingEntry.couponEligible === false) return false;

  const planName = pricingEntry.name || pricingEntry.plan || pricingEntry.label || "";
  const period = pricingEntry.period || "";

  // Check eligiblePlans
  if (coupon.eligiblePlans && Array.isArray(coupon.eligiblePlans) && coupon.eligiblePlans.length > 0) {
    const isEligible = coupon.eligiblePlans.some(p => planName.includes(p));
    if (!isEligible) return false;
  }

  // Check excludedPlans
  if (coupon.excludedPlans && Array.isArray(coupon.excludedPlans) && coupon.excludedPlans.length > 0) {
    const isExcluded = coupon.excludedPlans.some(p => planName.includes(p));
    if (isExcluded) return false;
  }

  // Check eligiblePeriods
  if (coupon.eligiblePeriods && Array.isArray(coupon.eligiblePeriods) && coupon.eligiblePeriods.length > 0) {
    const isEligible = coupon.eligiblePeriods.some(p => period.includes(p));
    if (!isEligible) return false;
  }

  // Check excludedPeriods
  if (coupon.excludedPeriods && Array.isArray(coupon.excludedPeriods) && coupon.excludedPeriods.length > 0) {
    const isExcluded = coupon.excludedPeriods.some(p => period.includes(p));
    if (isExcluded) return false;
  }

  return true;
}

/**
 * Gets the BEST applicable coupon for a specific pricing entry.
 * Checks temporary coupons first, falls back to standard coupon if temporary doesn't apply.
 */
export function getBestCouponForPricing(brand, pricingEntry, clientDate = new Date()) {
  if (!brand || !pricingEntry) return null;

  if (pricingEntry.couponEligible === false) return null;

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
    for (const temp of activeTemps) {
      if (isCouponApplicableToPricing(brand, temp, pricingEntry)) {
        return { type: "temporary", ...temp };
      }
    }
  }

  if (brand.coupon) {
    if (isCouponApplicableToPricing(brand, brand.coupon, pricingEntry)) {
      return { type: "standard", ...brand.coupon };
    }
  }

  return null;
}

/**
 * Helper to calculate discount multiplier from a coupon object.
 */
export function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\d+)/);
  if (match) return 1 - (parseInt(match[1]) / 100);
  return 1;
}
