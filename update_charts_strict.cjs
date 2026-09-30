const fs = require('fs');

function injectResolver(filePath, type) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('getBestCouponForPricing')) {
    content = content.replace(/import \{ getActiveCoupon \}/, `import { getActiveCoupon, getBestCouponForPricing, getDiscountMultiplier }`);
  }
  
  if (type === 'AnnualPriceChart') {
    content = content.replace(/let mappedData = data\.map\(d => \{[\s\S]*?return d;\n\}\);/, `let mappedData = data.map(d => {
  const planName = d.plan || d.label;
  const pPeriod = d.period || brand.visualData?.priceChartLabel || (isMonthly ? "月付" : "年付");
  const pEntry = brand.pricing?.find(p => p.name === planName && p.period === pPeriod) || { name: planName, period: pPeriod };
  
  const coupon = getBestCouponForPricing(brand, pEntry);
  if (coupon && coupon.type === 'temporary' && d.original) {
    const mult = getDiscountMultiplier(coupon);
    return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)) };
  } else if (!coupon) {
    // If no coupon is applicable (even standard), remove discounted
    return { ...d, discounted: undefined };
  }
  return d;
});`);
  } else if (type === 'UnlimitedTrafficChart') {
    content = content.replace(/data = data\.map\(d => \{[\s\S]*?return d;\n\}\);/, `data = data.map(d => {
  const planName = d.plan || d.label;
  const pEntry = brand.pricing?.find(p => p.name === planName && (p.period === d.period || p.period === '一次性')) || { name: planName, period: d.period || '一次性' };
  
  const coupon = getBestCouponForPricing(brand, pEntry);
  if (coupon && coupon.type === 'temporary' && d.original) {
    const mult = getDiscountMultiplier(coupon);
    return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)) };
  } else if (!coupon) {
    return { ...d, discounted: undefined };
  }
  return d;
});`);
  } else if (type === 'CouponComparison') {
    // Modify CouponComparison.astro
    content = content.replace(/let data = \{ \.\.\.brand\.visualData\.couponExample \};[\s\S]*?\}\n/m, `let data = { ...brand.visualData.couponExample };
const pEntry = brand.pricing?.find(p => p.name === data.plan && p.period === data.period) || { name: data.plan, period: data.period };
const coupon = getBestCouponForPricing(brand, pEntry);

if (!coupon) {
  // If NO coupon is applicable, this chart shouldn't really render, but we return null or handle it.
  return null;
} else if (coupon.type === 'temporary' && data.before) {
  const mult = getDiscountMultiplier(coupon);
  data.after = parseFloat((data.before * mult).toFixed(2));
  data.discount = (data.before - data.after).toFixed(2).replace(/\\.00$/, '');
  data.coupon = coupon.code;
  data.percent = coupon.discountPercent.replace(/\\D/g, '');
} else if (coupon.type === 'standard') {
  data.coupon = coupon.code;
  data.percent = coupon.discount ? coupon.discount.replace(/\\D/g, '') : '';
}
`);
  } else if (type === 'CouponEligibilityMatrix') {
    content = content.replace(/\{data\.map\(item => \{[\s\S]*?return \(/, `{data.map(item => {
      // Find all pricing entries for this plan
      const planName = item.plan || item.label;
      const entries = brand.pricing?.filter(p => p.name === planName) || [{ name: planName, period: '未知' }];
      
      const periodsWithCoupon = entries.filter(p => getBestCouponForPricing(brand, p));
      const isEligible = periodsWithCoupon.length > 0;
      
      return (`);
      
    // Modify the matrix visual to show periods
    const oldMatrixInner = `<span class={\`text-sm font-bold mb-3 \${isEligible ? 'text-white' : 'text-slate-400'}\`}>
          {item.label}
        </span>
        {isEligible ? (
          <div class="inline-flex items-center text-brand-neon text-sm font-bold bg-brand-neon/10 px-3 py-1.5 rounded-full border border-brand-neon/20">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            可用
          </div>
        ) : (
          <div class="inline-flex items-center text-slate-400 text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-full border border-slate-600">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            不适用
          </div>
        )}`;
        
    const newMatrixInner = `<span class={\`text-sm font-bold mb-2 \${isEligible ? 'text-white' : 'text-slate-400'}\`}>
          {item.label}
        </span>
        {isEligible ? (
          <div class="flex flex-col items-center">
            <div class="inline-flex items-center text-brand-neon text-xs font-bold bg-brand-neon/10 px-2 py-1 rounded-full border border-brand-neon/20 mb-2">
              <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              可用
            </div>
            <div class="text-[10px] text-slate-400 text-center leading-tight">
              {periodsWithCoupon.map(p => p.period).join('/')}
            </div>
          </div>
        ) : (
          <div class="flex flex-col items-center">
            <div class="inline-flex items-center text-slate-400 text-xs font-bold bg-slate-800 px-2 py-1 rounded-full border border-slate-600">
              <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              不适用
            </div>
          </div>
        )}`;
    content = content.replace(oldMatrixInner, newMatrixInner);
  }
  
  fs.writeFileSync(filePath, content);
}

injectResolver('src/components/charts/AnnualPriceChart.astro', 'AnnualPriceChart');
injectResolver('src/components/charts/UnlimitedTrafficChart.astro', 'UnlimitedTrafficChart');
injectResolver('src/components/charts/CouponComparison.astro', 'CouponComparison');
injectResolver('src/components/charts/CouponEligibilityMatrix.astro', 'CouponEligibilityMatrix');

console.log('Charts updated with strict pricing entry resolving.');
