const fs = require('fs');

const file = 'src/components/charts/AnnualPriceChart.astro';
let content = fs.readFileSync(file, 'utf8');

// Replace the discounted item label rendering
const oldDiscountedLabel = /<div class="mt-3 text-\[10px\] sm:text-xs text-center font-bold text-slate-300 h-8 flex flex-col items-center whitespace-nowrap">\s*\{item.label\}\s*<\/div>/;
const newDiscountedLabel = `<div class="mt-3 text-[10px] sm:text-xs text-center font-bold text-slate-300 flex flex-col items-center whitespace-nowrap">
              <span>{item.label}</span>
              {item.resolvedCoupon && <span class="text-[8px] sm:text-[9px] text-brand-neon font-mono scale-90 sm:scale-100">{item.resolvedCoupon.code}</span>}
            </div>`;
content = content.replace(oldDiscountedLabel, newDiscountedLabel);

// Replace the non-discounted item label rendering
const oldNonDiscountedLabel = /<div class="mt-3 text-\[10px\] sm:text-xs text-center font-bold text-slate-300 h-8 flex flex-col items-center whitespace-nowrap">\s*\{item.label\}\s*\{isStudent && <span class="text-\[8px\] text-slate-500 scale-90">无优惠<\/span>\}\s*<\/div>/;
const newNonDiscountedLabel = `<div class="mt-3 text-[10px] sm:text-xs text-center font-bold text-slate-300 flex flex-col items-center whitespace-nowrap">
              <span>{item.label}</span>
              {!item.resolvedCoupon ? <span class="text-[8px] sm:text-[9px] text-slate-500 scale-90 sm:scale-100">优惠不适用</span> : <span class="text-[8px] sm:text-[9px] text-brand-neon font-mono scale-90 sm:scale-100">{item.resolvedCoupon.code}</span>}
            </div>`;
content = content.replace(oldNonDiscountedLabel, newNonDiscountedLabel);

fs.writeFileSync(file, content);
console.log('Updated AnnualPriceChart.astro HTML labels');
