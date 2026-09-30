const fs = require('fs');

const file = 'src/components/charts/AnnualPriceChart.astro';
let content = fs.readFileSync(file, 'utf8');

// I will just replace the entire file content for simplicity, since it's getting complex.
const newComponent = `---
import { getBestCouponForPricing, getDiscountMultiplier } from '../../utils/coupon.js';
const { brand } = Astro.props;

if (!brand || !brand.visualData) return null;

const chartsConfig = brand.visualData.priceCharts || [];
if (brand.visualData.annualPrice) {
  chartsConfig.push({
    id: "annual",
    label: brand.visualData.priceChartLabel || "年付",
    title: brand.visualData.priceChartTitle, // optional
    data: brand.visualData.annualPrice
  });
}
if (brand.visualData.monthlyPrice) {
  chartsConfig.push({
    id: "monthly",
    label: brand.visualData.priceChartLabel || "月付",
    data: brand.visualData.monthlyPrice
  });
}

if (chartsConfig.length === 0) return null;

// Preprocess all charts
const charts = chartsConfig.map(chart => {
  const isMonthly = chart.id === "monthly";
  const priceChartLabel = chart.label || (isMonthly ? "月付" : "年付");
  
  let mappedData = chart.data.map(d => {
    const planName = d.plan || d.label;
    const pPeriod = d.period || priceChartLabel;
    const pEntry = brand.pricing?.find(p => p.name === planName && p.period === pPeriod) || { name: planName, period: pPeriod };
    
    const coupon = getBestCouponForPricing(brand, pEntry);
    if (coupon && coupon.type === 'temporary' && d.original) {
      const mult = getDiscountMultiplier(coupon);
      return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)), resolvedCoupon: coupon };
    } else if (!coupon) {
      return { ...d, discounted: undefined, resolvedCoupon: null };
    } else if (coupon.type === 'standard' && d.original) {
      // If we don't have visual discounted hardcoded, we calculate it now for standard coupons too!
      if (d.discounted === undefined) {
        const mult = getDiscountMultiplier(coupon);
        return { ...d, discounted: parseFloat((d.original * mult).toFixed(2)), resolvedCoupon: coupon };
      }
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

  const appliedCoupons = Array.from(new Set(mappedData.filter(d => d.resolvedCoupon && d.discounted).map(d => d.resolvedCoupon.code)));
  let couponDesc = '';
  let titleText = chart.title || \`\${priceChartLabel}价格对比\`;

  if (hasDiscount) {
    if (appliedCoupons.length === 1) {
      couponDesc = \`折后价按优惠码 \${appliedCoupons[0]} 计算。\`;
      if (!chart.title) {
        const c = mappedData.find(d => d.resolvedCoupon?.code === appliedCoupons[0])?.resolvedCoupon;
        titleText = \`\${priceChartLabel}原价 vs \${c?.discount || ''}价\`;
      }
    } else if (appliedCoupons.length > 1) {
      couponDesc = "折后价按各套餐当前实际适用优惠计算。";
      if (!chart.title) titleText = \`\${priceChartLabel}原价 vs 折后价\`;
    } else {
      couponDesc = "部分套餐包含优惠，以实际计算为准。";
      if (!chart.title) titleText = \`\${priceChartLabel}原价 vs 折后价\`;
    }
  } else {
    couponDesc = \`官方\${priceChartLabel}标价。未包含优惠码折扣情况。\`;
  }

  return {
    ...chart,
    priceChartLabel,
    mappedData,
    hasDiscount,
    max,
    titleText,
    couponDesc
  };
});

---

{charts.map(chart => (
  <div class="mb-12 bg-brand-dark p-6 rounded-xl border border-white/5 overflow-x-auto">
    <div class="mb-6 min-w-[500px]">
      <h2 class="text-xl font-bold text-white uppercase tracking-wider font-mono flex items-center">
        <svg class="w-5 h-5 text-brand-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {chart.titleText}
      </h2>
      <p class="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">FARE COMPARISON</p>
      <p class="text-sm text-slate-400 mt-2">
        {chart.couponDesc}
      </p>
    </div>
    
    <div class="flex items-end h-64 space-x-4 sm:space-x-8 border-b border-l border-white/10 pl-2 pb-2 mt-12 relative min-w-[500px]">
      <!-- Grid Lines -->
      <div class="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none opacity-20 z-0">
        {[...Array(4)].map((_, i) => (
          <div class="w-full border-t border-dashed border-slate-500 flex-grow"></div>
        ))}
      </div>

      {chart.mappedData.map(item => {
        const isStudent = item.label.includes('学生');
        if (chart.hasDiscount && item.original && item.discounted && item.original !== item.discounted) {
          const heightOrig = (item.original / chart.max) * 100;
          const heightDisc = (item.discounted / chart.max) * 100;
          const saved = (item.original - item.discounted).toFixed(2).replace(/\\.00$/, '');
          return (
            <div class="flex flex-col items-center flex-1 group z-10 h-full justify-end relative">
              <div class="flex items-end justify-center w-full h-full space-x-1">
                <!-- Original Bar -->
                <div 
                  class="w-1/2 max-w-[2.5rem] rounded-t-sm transition-all duration-300 relative flex flex-col items-center justify-start bg-slate-700 opacity-60"
                  style={\`height: \${heightOrig}%; min-height: 24px;\`}
                >
                  <span class="text-[9px] sm:text-[10px] font-mono font-bold text-slate-300 -mt-5 bg-slate-800 px-1 rounded shadow-sm line-through">
                    ¥{item.original}
                  </span>
                </div>
                <!-- Discounted Bar -->
                <div 
                  class="w-1/2 max-w-[2.5rem] rounded-t-sm transition-all duration-300 relative flex flex-col items-center justify-start bg-gradient-to-t from-brand-neon/80 to-brand-neon shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                  style={\`height: \${heightDisc}%; min-height: 24px;\`}
                >
                  <span class="text-xs sm:text-sm font-mono font-bold text-brand-dark -mt-6 sm:-mt-7 bg-white px-1 rounded shadow-sm">
                    ¥{item.discounted}
                  </span>
                </div>
              </div>
              <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-brand-accent/20 border border-brand-accent text-brand-accent text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                省 ¥{saved}
              </div>
              <div class="mt-3 text-[10px] sm:text-xs text-center font-bold text-slate-300 flex flex-col items-center whitespace-nowrap">
                <span>{item.label}</span>
                {item.resolvedCoupon && <span class="text-[8px] sm:text-[9px] text-brand-neon font-mono scale-90 sm:scale-100">{item.resolvedCoupon.code}</span>}
              </div>
            </div>
          );
        } else {
          const height = ((item.value || item.original) / chart.max) * 100;
          return (
            <div class="flex flex-col items-center flex-1 group z-10 h-full justify-end relative">
              <div 
                class={\`w-full max-w-[3rem] sm:max-w-[4rem] rounded-t-sm transition-all duration-300 relative flex flex-col items-center justify-start \${isStudent ? 'bg-slate-700' : 'bg-gradient-to-t from-brand-accent/80 to-brand-accent shadow-[0_0_10px_rgba(250,204,21,0.2)]'}\`}
                style={\`height: \${height}%; min-height: 24px;\`}
              >
                <span class="text-xs sm:text-sm font-mono font-bold text-brand-dark -mt-6 sm:-mt-7 bg-white/90 px-1 rounded shadow-sm">
                  ¥{item.value || item.original}
                </span>
              </div>
              <div class="mt-3 text-[10px] sm:text-xs text-center font-bold text-slate-300 flex flex-col items-center whitespace-nowrap">
                <span>{item.label}</span>
                {!item.resolvedCoupon ? <span class="text-[8px] sm:text-[9px] text-slate-500 scale-90 sm:scale-100">优惠不适用</span> : <span class="text-[8px] sm:text-[9px] text-brand-neon font-mono scale-90 sm:scale-100">{item.resolvedCoupon.code}</span>}
              </div>
            </div>
          );
        }
      })}
    </div>
  </div>
))}
`;

fs.writeFileSync(file, newComponent);
console.log('Re-wrote AnnualPriceChart.astro to support multi charts');
