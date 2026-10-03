const fs = require('fs');

let c = fs.readFileSync('src/components/charts/CouponEligibilityMatrix.astro', 'utf8');

c = c.replace("const isTestEnv = import.meta.env ? false : true;\nconst clientDate = new Date('2026-10-01T12:00:00Z');", "const clientDate = new Date();");

const wrapperDivOld = '<div class="mb-12 bg-brand-navy p-6 rounded-xl border border-white/5">';
const wrapperDivNew = '<div class={`mb-12 bg-brand-navy p-6 rounded-xl border border-white/5 ${!standardCoupon && useBestCoupons ? "show-if-temp-active" : ""}`}>';

c = c.replace(wrapperDivOld, wrapperDivNew);

const appendStr = `
{!standardCoupon && useBestCoupons && (
  <div class="mb-12 bg-brand-navy p-6 rounded-xl border border-white/5 show-if-temp-expired hidden">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-white uppercase tracking-wider font-mono flex items-center">
        <svg class="w-5 h-5 text-brand-neon mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        当前活动优惠可以用在哪些套餐？
      </h2>
      <p class="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">COUPON ELIGIBILITY</p>
      <p class="text-sm text-slate-400 mt-2">一目了然的优惠码适用范围。不同套餐的优惠资格不同，以下根据当前已确认规则显示；最终是否可用以官方结算页面实际结果为准。</p>
    </div>
    <div class="text-center py-10 bg-slate-800/50 rounded-lg border border-slate-700">
      <div class="text-slate-400">本轮活动已结束，当前暂无已确认常驻优惠码。</div>
    </div>
  </div>
)}
`;

c += appendStr;

fs.writeFileSync('src/components/charts/CouponEligibilityMatrix.astro', c);
