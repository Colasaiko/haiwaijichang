const fs = require('fs');
let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const jlTestStr = `
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
  else { console.error('ERROR: JILIAN SHORT PERIOD BEST COUPON failed'); jlErrors++; errors++; }

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
  else { console.error('ERROR: JILIAN LONG PERIOD TEMP COUPON failed'); jlErrors++; errors++; }

  const jlSpec = jilianBrand.pricing.find(p => p.name === '限时年付套餐体验' && p.period === '年付');
  const cSpec = getBestCouponForPricing(jilianBrand, jlSpec, jlEventDate);
  if (cSpec && cSpec.code === 'JLY888') jlExcl1Pass = true;
  
  if (jlExcl1Pass) console.log('JILIAN SPECIAL ANNUAL TEMP EXCLUDED: PASS');
  else { console.error('ERROR: JILIAN SPECIAL ANNUAL TEMP EXCLUDED failed'); jlErrors++; errors++; }

  const jlUnlim = jilianBrand.pricing.find(p => p.name === '极连云 · 不限时套餐' && p.period === '一次性');
  const cUnlim = getBestCouponForPricing(jilianBrand, jlUnlim, jlEventDate);
  if (cUnlim && cUnlim.code === 'JLY888') jlExcl2Pass = true;

  if (jlExcl2Pass) console.log('JILIAN UNLIMITED TEMP EXCLUDED: PASS');
  else { console.error('ERROR: JILIAN UNLIMITED TEMP EXCLUDED failed'); jlErrors++; errors++; }
`;

checker = checker.replace("console.log('JILIAN COUPON CONSISTENCY: PASS');", jlTestStr + "\n  console.log('JILIAN COUPON CONSISTENCY: PASS');");
fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
