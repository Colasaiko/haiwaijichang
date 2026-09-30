const fs = require('fs');

const path = 'src/components/charts/QuickSelector.astro';
let content = fs.readFileSync(path, 'utf8');

const newScript = `---
import { getBestCouponForPricing } from '../../utils/coupon.js';
const { brand } = Astro.props;

if (!brand || !brand.visualData || !brand.visualData.traffic || !brand.visualData.annualPrice) return null;

const planMap = new Map();
brand.pricing.forEach(p => {
  if (!planMap.has(p.name)) planMap.set(p.name, []);
  planMap.get(p.name).push(p);
});

const cards = Array.from(planMap.entries()).map(([name, plans]) => {
  const monthPlan = plans.find(p => p.period === '月付' || p.period.includes('月'));
  const yearPlan = plans.find(p => p.period === '年付' || p.period.includes('年'));
  
  let priceStr = '';
  if (monthPlan) priceStr += \`\${monthPlan.originalPrice || monthPlan.price || ''}/月起\`;
  else if (yearPlan) priceStr += \`\${yearPlan.originalPrice || yearPlan.price || ''}/年\`;
  else priceStr += \`\${plans[0].originalPrice || plans[0].price || ''}\`;
  
  let traffic = plans[0].traffic;
  
  let desc = '普通个人使用';
  if (name.includes('学生')) desc = '轻量使用\\n偶尔访问';
  else if (traffic.includes('300')) desc = '中等流量';
  else if (traffic.includes('600')) desc = '视频 / 多设备';
  else if (traffic.includes('1.0TB') || traffic.includes('1000') || traffic.includes('1800') || traffic.includes('830')) desc = '大流量使用';
  else if (traffic.includes('120') || traffic.includes('150')) desc = '日常网页/视频';
  
  // Resolve coupon status for each period
  const periodsWithCoupon = [];
  const periodsWithoutCoupon = [];
  let bestCouponName = null;
  let isTemp = false;
  
  plans.forEach(p => {
    const activeCoupon = getBestCouponForPricing(brand, p);
    if (activeCoupon) {
      periodsWithCoupon.push(p.period);
      if (!bestCouponName || activeCoupon.type === 'temporary') {
        bestCouponName = activeCoupon.code;
        isTemp = activeCoupon.type === 'temporary';
      }
    } else {
      periodsWithoutCoupon.push(p.period);
    }
  });
  
  return {
    name,
    traffic,
    priceStr,
    desc,
    periodsWithCoupon,
    periodsWithoutCoupon,
    bestCouponName,
    isTemp,
    yearPlan
  };
});
---`;

content = content.replace(/---[\s\S]*?---/, newScript);

// Now update the rendering part
const oldMarkup = `{card.isStudent ? (
            <div class="inline-block px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">不支持优惠码</div>
          ) : (
            <div class="flex flex-col space-y-2">
              <div class="inline-block self-start px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs rounded border border-brand-accent/20">
                {brand.coupon?.code} 可用
              </div>
              {card.yearPlan && card.yearPlan.discountPrice && (
                <div class="text-xs text-brand-neon font-bold">
                  年付实测 {card.yearPlan.discountPrice}
                </div>
              )}
            </div>
          )}`;
          
const newMarkup = `{card.periodsWithCoupon.length === 0 ? (
            <div class="inline-block px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">优惠码不适用</div>
          ) : (
            <div class="flex flex-col space-y-2">
              <div class={\`inline-block self-start px-2 py-1 text-xs rounded border \${card.isTemp ? 'bg-brand-neon/10 text-brand-neon border-brand-neon/30' : 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'}\`}>
                {card.bestCouponName} {card.isTemp ? '限时可用' : '可用'}
              </div>
              <div class="text-[10px] text-slate-500">
                {card.periodsWithCoupon.join(' / ')} {card.periodsWithoutCoupon.length > 0 ? \` (排除 \${card.periodsWithoutCoupon.join('/')})\` : ''}
              </div>
            </div>
          )}`;

content = content.replace(oldMarkup, newMarkup);

fs.writeFileSync(path, content);
console.log('Updated QuickSelector.astro');
