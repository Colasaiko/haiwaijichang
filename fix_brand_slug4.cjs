const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/\{brand\.coupon \|\| \(brand\.discount && brand\.discount !== '\(暂无优惠）'\) && \([\s\S]*?<\/span>\r?\n\s*<\/div>\r?\n\s*\)\}/, 
`{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
  const couponCode = brand.coupon?.code || null;
  const couponDiscount = brand.coupon?.discount || brand.discount;
  const couponScope = brand.coupon?.scope || null;
  return (
    <div class="mt-4 text-center">
      <div class="inline-flex items-center space-x-2 bg-brand-dark border border-brand-neon/30 px-4 py-2 rounded-sm text-sm">
        <span class="text-slate-400">优惠码:</span>
        {couponCode ? <code class="text-brand-neon font-bold tracking-wider">{couponCode}</code> : <span class="text-slate-500">自动应用</span>}
        <span class="text-white/20 mx-2">|</span>
        <span class="text-brand-accent font-bold">{couponDiscount}</span>
        {couponScope && <span class="text-white/20 mx-2">|</span>}
        {couponScope && <span class="text-slate-400">{couponScope}</span>}
      </div>
    </div>
  );
})()}`);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed coupon in slug.astro');
