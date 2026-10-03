const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const regex = /function getBestCouponForPricing\(brand, pricingEntry, now = Date\.now\(\)\) \{[\s\S]*?return applicableCoupons\[0\];\n\}/;

const newGetBestLogic = `function getBestCouponForPricing(brand, pricingEntry, now = Date.now()) {
  if (pricingEntry.couponEligible === false) return null;

  let activeTemps = (brand.temporaryCoupons || []).filter(c => {
    if (c.manualActive === false) return false;
    if (c.manualActive === true) {
      if (c.startsAt && now < new Date(c.startsAt).getTime()) return false;
      if (c.expiresAt && now > new Date(c.expiresAt).getTime()) return false;
      return true;
    }
    if (!c.startsAt || !c.expiresAt) return false;
    return now >= new Date(c.startsAt).getTime() && now <= new Date(c.expiresAt).getTime();
  });

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
}`;

c = c.replace(regex, newGetBestLogic);

const jilianTest = `
  // Jilian Best Coupon Logic test
  const jlEventDate = new Date('2026-10-05T12:00:00Z');
  let jlShortPass = true;
  let jlLongPass = true;
  let jlExcl1Pass = false;
  let jlExcl2Pass = false;

  const jlBaseM = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '月付');
  const jlBaseQ = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '季付');
  const jlBaseH = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '半年付');
  
  const cM = getBestCouponForPricing(jilianBrand, jlBaseM, jlEventDate);
  const cQ = getBestCouponForPricing(jilianBrand, jlBaseQ, jlEventDate);
  const cH = getBestCouponForPricing(jilianBrand, jlBaseH, jlEventDate);

  if (!cM || cM.code !== 'JLY888') jlShortPass = false;
  if (!cQ || cQ.code !== 'JLY888') jlShortPass = false;
  if (!cH || cH.code !== 'JLY888') jlShortPass = false;

  if (jlShortPass) console.log('JILIAN SHORT PERIOD BEST COUPON: PASS');
  else { console.error('ERROR: JILIAN SHORT PERIOD BEST COUPON failed'); jErrors++; errors++; }

  const jlBaseY = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '年付');
  const jlBase2Y = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '两年付');
  const jlBase3Y = jilianBrand.pricing.find(p => p.name === '极连云 · 基础套餐' && p.period === '三年付');

  const cY = getBestCouponForPricing(jilianBrand, jlBaseY, jlEventDate);
  const c2Y = getBestCouponForPricing(jilianBrand, jlBase2Y, jlEventDate);
  const c3Y = getBestCouponForPricing(jilianBrand, jlBase3Y, jlEventDate);

  if (!cY || cY.code !== '2happy80') jlLongPass = false;
  if (!c2Y || c2Y.code !== '2happy80') jlLongPass = false;
  if (!c3Y || c3Y.code !== '2happy80') jlLongPass = false;

  if (jlLongPass) console.log('JILIAN LONG PERIOD TEMP COUPON: PASS');
  else { console.error('ERROR: JILIAN LONG PERIOD TEMP COUPON failed'); jErrors++; errors++; }

  const jlSpec = jilianBrand.pricing.find(p => p.name === '限时年付套餐体验' && p.period === '年付');
  const cSpec = getBestCouponForPricing(jilianBrand, jlSpec, jlEventDate);
  if (cSpec && cSpec.code === 'JLY888') jlExcl1Pass = true;
  
  if (jlExcl1Pass) console.log('JILIAN SPECIAL ANNUAL TEMP EXCLUDED: PASS');
  else { console.error('ERROR: JILIAN SPECIAL ANNUAL TEMP EXCLUDED failed'); jErrors++; errors++; }

  const jlUnlim = jilianBrand.pricing.find(p => p.name === '极连云 · 不限时套餐' && p.period === '一次性');
  const cUnlim = getBestCouponForPricing(jilianBrand, jlUnlim, jlEventDate);
  if (cUnlim && cUnlim.code === 'JLY888') jlExcl2Pass = true;

  if (jlExcl2Pass) console.log('JILIAN UNLIMITED TEMP EXCLUDED: PASS');
  else { console.error('ERROR: JILIAN UNLIMITED TEMP EXCLUDED failed'); jErrors++; errors++; }
`;

const consPass = "if (jErrors === 0) console.log('JILIAN COUPON CONSISTENCY: PASS');";
const target = "if (jErrors === 0) console.log('JILIAN COUPON CONSISTENCY: PASS');";
c = c.replace(target, jilianTest + "\n  " + target);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
