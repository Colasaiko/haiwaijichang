const fs = require('fs');

let c = fs.readFileSync('src/components/BlogBrandCard.astro', 'utf8');

c = c.replace(/\{\(brand\.coupon[\s\S]*?\}\)\(\)\}/, 
`{(brand.coupon || (brand.discount && brand.discount !== '暂无优惠' && brand.discount !== '(暂无优惠）')) && (
  <div class="mt-3 text-xs text-brand-accent font-mono border border-brand-accent/20 bg-brand-accent/5 inline-block px-2 py-1 rounded">
    {brand.coupon ? \`优惠: \${brand.coupon.discount} [\${brand.coupon.code}]\` : \`优惠: \${brand.discount}\`}
  </div>
)}`);

fs.writeFileSync('src/components/BlogBrandCard.astro', c);

let i = fs.readFileSync('src/pages/brands/index.astro', 'utf8');
i = i.replace(/\{\(brand\.coupon[\s\S]*?\}\)\(\)\}/g, 
`{(brand.coupon || (brand.discount && brand.discount !== '暂无优惠' && brand.discount !== '(暂无优惠）')) && (
  <div class="mt-4 text-xs font-mono font-bold text-brand-accent/80 flex items-center justify-center">
    <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
    {brand.coupon ? \`\${brand.coupon.discount} Code: \${brand.coupon.code}\` : brand.discount}
  </div>
)}`);
fs.writeFileSync('src/pages/brands/index.astro', i);

let n = fs.readFileSync('src/pages/network.astro', 'utf8');
n = n.replace(/\{\(brand\.coupon[\s\S]*?\}\)\(\)\}/g, 
`{(brand.coupon || (brand.discount && brand.discount !== '暂无优惠' && brand.discount !== '(暂无优惠）')) && (
  <div class="mt-4 text-xs font-mono font-bold text-brand-accent/80 flex items-center justify-center">
    <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
    {brand.coupon ? \`\${brand.coupon.discount} Code: \${brand.coupon.code}\` : brand.discount}
  </div>
)}`);
fs.writeFileSync('src/pages/network.astro', n);

console.log('Fixed IIFE in Astros');
