export function getActiveCoupon(brand) {
  if (!brand) return null;

  const now = Date.now();

  // 1. Find all active temporary coupons
  let activeTemps = [];
  if (brand.temporaryCoupons && Array.isArray(brand.temporaryCoupons)) {
    activeTemps = brand.temporaryCoupons.filter(c => {
      if (!c.startsAt || !c.expiresAt) return false;
      const start = new Date(c.startsAt).getTime();
      const end = new Date(c.expiresAt).getTime();
      return now >= start && now <= end;
    });
  }

  // 2. Sort by priority and return the highest
  if (activeTemps.length > 0) {
    activeTemps.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const bestTemp = activeTemps[0];
    return {
      type: "temporary",
      ...bestTemp
    };
  }

  // 3. Fallback to standard coupon
  if (brand.coupon) {
    return {
      type: "standard",
      ...brand.coupon
    };
  }

  return null;
}
