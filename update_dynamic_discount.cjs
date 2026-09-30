const fs = require('fs');

function applyDynamicDiscount(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('function getDiscountMultiplier')) {
    const fn = `
function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\\d+)/);
  if (match) {
    return 1 - (parseInt(match[1]) / 100);
  }
  return 1;
}
`;
    // Insert after const activeCoupon = getActiveCoupon(brand);
    content = content.replace(/const activeCoupon = getActiveCoupon\(brand\);/g, `const activeCoupon = getActiveCoupon(brand);\n${fn}`);
  }
  
  fs.writeFileSync(filePath, content);
}

// For AnnualPriceChart
let apContent = fs.readFileSync('src/components/charts/AnnualPriceChart.astro', 'utf8');
if (!apContent.includes('const mult = getDiscountMultiplier(activeCoupon)')) {
  apContent = apContent.replace('const hasDiscount', `const mult = getDiscountMultiplier(activeCoupon);\nlet mappedData = data.map(d => {\n  if (activeCoupon?.type === 'temporary' && d.original && brand.visualData?.couponEligibility?.find(e => e.label === d.label)?.eligible !== false) {\n    return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)) };\n  }\n  return d;\n});\nconst hasDiscount`);
  apContent = apContent.replace(/data\.some/g, 'mappedData.some');
  apContent = apContent.replace(/data\.flatMap/g, 'mappedData.flatMap');
  apContent = apContent.replace(/data\.map/g, 'mappedData.map');
  apContent = apContent.replace(/const mult =/g, `function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\\d+)/);
  if (match) return 1 - (parseInt(match[1]) / 100);
  return 1;
}
const mult =`);
  fs.writeFileSync('src/components/charts/AnnualPriceChart.astro', apContent);
}

// For UnlimitedTrafficChart
let utContent = fs.readFileSync('src/components/charts/UnlimitedTrafficChart.astro', 'utf8');
if (!utContent.includes('const mult = getDiscountMultiplier')) {
  utContent = utContent.replace(/let data = brand\.visualData\.unlimitedTraffic;/g, `function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\\d+)/);
  if (match) return 1 - (parseInt(match[1]) / 100);
  return 1;
}
let data = brand.visualData.unlimitedTraffic;`);
  
  utContent = utContent.replace(/if \(\!Array\.isArray\(data\)\) data = \[data\];/g, `if (!Array.isArray(data)) data = [data];\nconst mult = getDiscountMultiplier(activeCoupon);\ndata = data.map(d => {\n  if (activeCoupon?.type === 'temporary' && d.original && brand.visualData?.couponEligibility?.find(e => e.label === d.label)?.eligible !== false) {\n    return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)) };\n  }\n  return d;\n});`);
  
  fs.writeFileSync('src/components/charts/UnlimitedTrafficChart.astro', utContent);
}

// For CouponComparison
let ccContent = fs.readFileSync('src/components/charts/CouponComparison.astro', 'utf8');
if (!ccContent.includes('const mult = getDiscountMultiplier')) {
  ccContent = ccContent.replace(/const data = brand\.visualData\.couponExample;/g, `function getDiscountMultiplier(coupon) {
  if (!coupon || !coupon.discountPercent) return 1;
  const match = coupon.discountPercent.match(/(\\d+)/);
  if (match) return 1 - (parseInt(match[1]) / 100);
  return 1;
}
let data = { ...brand.visualData.couponExample };
if (activeCoupon?.type === 'temporary' && data.before) {
  const mult = getDiscountMultiplier(activeCoupon);
  data.after = parseFloat((data.before * mult).toFixed(2));
  data.discount = (data.before - data.after).toFixed(2).replace(/\\.00$/, '');
  data.coupon = activeCoupon.code;
  data.percent = activeCoupon.discountPercent.replace(/\\D/g, '');
}`);
  
  fs.writeFileSync('src/components/charts/CouponComparison.astro', ccContent);
}

console.log('Dynamic discounts injected.');
