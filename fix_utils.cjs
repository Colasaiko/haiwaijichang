const fs = require('fs');

let c = fs.readFileSync('src/utils/coupon.js', 'utf8');

const regex = /  if \(activeTemps\.length > 0\) \{[\s\S]*?return null;\n\}/;

const newLogic = `
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
      applicableCoupons.push({ type: "standard", ...brand.coupon });
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
    
    // Lower multiplier means higher discount (better for user)
    if (multA !== multB) {
      return multA - multB; 
    }
    
    // If multiplier is same, prefer temporary
    if (a.type === 'temporary' && b.type !== 'temporary') return -1;
    if (b.type === 'temporary' && a.type !== 'temporary') return 1;
    
    // If both temporary, prefer higher priority
    if (a.type === 'temporary' && b.type === 'temporary') {
      return (b.priority || 0) - (a.priority || 0);
    }
    
    return 0;
  });

  return applicableCoupons[0];
}`;

c = c.replace(regex, newLogic);
fs.writeFileSync('src/utils/coupon.js', c);

// Do the same for check-coupon-consistency.mjs
let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
const cRegex = /  let activeTemps = \(brand\.temporaryCoupons \|\| \[\]\)[\s\S]*?return null;\n\}/;

const cNewLogic = `  let activeTemps = (brand.temporaryCoupons || []).filter(c => {
    if (c.manualActive === false) return false;
    if (c.manualActive === true) {
      if (c.startsAt && now < new Date(c.startsAt).getTime()) return false;
      if (c.expiresAt && now > new Date(c.expiresAt).getTime()) return false;
      return true;
    }
    if (!c.startsAt || !c.expiresAt) return false;
    return now >= new Date(c.startsAt).getTime() && now <= new Date(c.expiresAt).getTime();
  });

${newLogic.trim()}`;

checker = checker.replace(cRegex, cNewLogic);
fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
