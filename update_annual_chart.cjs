const fs = require('fs');

function updateAnnualPriceChart() {
  const file = 'src/components/charts/AnnualPriceChart.astro';
  let content = fs.readFileSync(file, 'utf8');

  // Replace frontmatter processing
  const oldFrontmatterRegex = /const mult = getDiscountMultiplier\(activeCoupon\);\nlet mappedData = [\s\S]*?const discountPercentText = activeCoupon\?\.discount \|\| '';/m;
  
  const newFrontmatter = `let mappedData = data.map(d => {
  const planName = d.plan || d.label;
  const pPeriod = d.period || brand.visualData?.priceChartLabel || (isMonthly ? "月付" : "年付");
  const pEntry = brand.pricing?.find(p => p.name === planName && p.period === pPeriod) || { name: planName, period: pPeriod };
  
  const coupon = getBestCouponForPricing(brand, pEntry);
  if (coupon && coupon.type === 'temporary' && d.original) {
    const mult = getDiscountMultiplier(coupon);
    return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)), resolvedCoupon: coupon };
  } else if (!coupon) {
    return { ...d, discounted: undefined, resolvedCoupon: null };
  } else if (coupon.type === 'standard' && d.original) {
    // Standard coupon. Wait, in original behavior, does it rely on visualData.discounted?
    // The user's request: "Firefly年付版 ¥96 优惠不适用; Lite ¥240 -> ¥192 firefly".
    // If we just return the visualData's discounted value for standard coupons:
    return { ...d, resolvedCoupon: coupon };
  }
  return { ...d, resolvedCoupon: coupon };
});

const hasDiscount = mappedData.some(d => d.original !== undefined && d.discounted !== undefined && d.original !== d.discounted);

const max = Math.max(...mappedData.flatMap(d => {
  const vals = [d.value || 0];
  if (d.original) vals.push(d.original);
  if (d.discounted) vals.push(d.discounted);
  return vals;
}));

// Determine coupon text based on actual applied coupons
const appliedCoupons = Array.from(new Set(mappedData.filter(d => d.resolvedCoupon && d.discounted).map(d => d.resolvedCoupon.code)));
let couponDesc = '';
let titleText = \`\${priceChartLabel}价格对比\`;

if (hasDiscount) {
  if (appliedCoupons.length === 1) {
    couponDesc = \`折后价按优惠码 \${appliedCoupons[0]} 计算。\`;
    // Find the discount percent for the title
    const c = mappedData.find(d => d.resolvedCoupon?.code === appliedCoupons[0])?.resolvedCoupon;
    titleText = \`\${priceChartLabel}原价 vs \${c?.discount || ''}价\`;
  } else if (appliedCoupons.length > 1) {
    couponDesc = "折后价按各套餐当前实际适用优惠计算。";
    titleText = \`\${priceChartLabel}原价 vs 折后价\`;
  } else {
    couponDesc = "部分套餐包含优惠，以实际计算为准。";
    titleText = \`\${priceChartLabel}原价 vs 折后价\`;
  }
} else {
  couponDesc = \`官方\${priceChartLabel}标价。未包含优惠码折扣情况。\`;
}`;

  content = content.replace(oldFrontmatterRegex, newFrontmatter);
  
  // Also remove const activeCoupon = getActiveCoupon(brand);
  content = content.replace(/const activeCoupon = getActiveCoupon\(brand\);\n/, '');

  // Update template
  const oldTitle = /\{hasDiscount \? `\$\{priceChartLabel\}原价 vs \$\{discountPercentText\}价` : `\$\{priceChartLabel\}价格对比`\}/;
  content = content.replace(oldTitle, '{titleText}');
  
  const oldDesc = /\{hasDiscount \? `左侧为官方\$\{priceChartLabel\}原价，右侧为使用 \$\{couponText\} 后的最终金额。` : `官方\$\{priceChartLabel\}标价。未包含优惠码折扣情况。`\}/;
  content = content.replace(oldDesc, '{couponDesc}');

  fs.writeFileSync(file, content);
  console.log('Updated AnnualPriceChart.astro');
}

updateAnnualPriceChart();
