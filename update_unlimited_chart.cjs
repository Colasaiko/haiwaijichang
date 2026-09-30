const fs = require('fs');

const file = 'src/components/charts/UnlimitedTrafficChart.astro';
let content = fs.readFileSync(file, 'utf8');

// Replace frontmatter
const oldFrontmatterRegex = /function checkPlanEligibility[\s\S]*?const discountLabel = activeCoupon\?\.discount \|\| '优惠';/m;

const newFrontmatter = `let data = brand.visualData.unlimitedTraffic;
// Support both single object and array
if (!Array.isArray(data)) data = [data];

data = data.map(d => {
  const planName = d.plan || d.label;
  const pEntry = brand.pricing?.find(p => p.name === planName && (p.period === d.period || p.period === '一次性')) || { name: planName, period: d.period || '一次性' };
  
  const coupon = getBestCouponForPricing(brand, pEntry);
  if (coupon && coupon.type === 'temporary' && d.original) {
    const mult = getDiscountMultiplier(coupon);
    return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)), resolvedCoupon: coupon };
  } else if (!coupon) {
    return { ...d, discounted: undefined, resolvedCoupon: null };
  } else if (coupon.type === 'standard' && d.original) {
    return { ...d, resolvedCoupon: coupon };
  }
  return { ...d, resolvedCoupon: coupon };
});`;

content = content.replace(oldFrontmatterRegex, newFrontmatter);
content = content.replace(/const activeCoupon = getActiveCoupon\(brand\);\n/, '');

// Replace template HTML for discountLabel
const oldDiscountHtml = /\{discountLabel\}后省 ¥\{saved\}/;
const newDiscountHtml = `{item.resolvedCoupon?.discount || '优惠'}后省 ¥{saved}`;

content = content.replace(oldDiscountHtml, newDiscountHtml);

fs.writeFileSync(file, content);
console.log('Cleaned up UnlimitedTrafficChart.astro');
