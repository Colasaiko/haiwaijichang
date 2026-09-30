const fs = require('fs');

// 1. BlogBrandCard.astro
let b = fs.readFileSync('src/components/BlogBrandCard.astro', 'utf8');
b = b.replace(/\{brand\.discount && brand\.discount !== '暂无优惠' && brand\.discount !== '\(暂无优惠）' && \([\s\S]*?<\/div>\s*\)\}/, 
`{(brand.coupon || (brand.discount && brand.discount !== '暂无优惠' && brand.discount !== '(暂无优惠）'))) && (() => {
  const code = brand.coupon?.code || brand.discount;
  const val = brand.coupon?.discount || '';
  if (!code || code === '暂无优惠' || code === '(暂无优惠）') return null;
  return (
    <div class="mt-3 text-xs text-brand-accent font-mono border border-brand-accent/20 bg-brand-accent/5 inline-block px-2 py-1 rounded">
      优惠: {val} {code ? \`[\${code}]\` : ''}
    </div>
  );
})()}`);
fs.writeFileSync('src/components/BlogBrandCard.astro', b);

// 2. index.astro in brands
let i = fs.readFileSync('src/pages/brands/index.astro', 'utf8');
i = i.replace(/\{brand\.discount && brand\.discount !== '\(暂无优惠）' && \([\s\S]*?<\/div>\s*\)\}/g, 
`{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
  const code = brand.coupon?.code || brand.discount;
  const val = brand.coupon?.discount || '';
  if (!code || code === '暂无优惠' || code === '(暂无优惠）') return null;
  return (
    <div class="mt-4 text-xs font-mono font-bold text-brand-accent/80 flex items-center justify-center">
      <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
      {val} {code ? \`Code: \${code}\` : ''}
    </div>
  );
})()}`);
fs.writeFileSync('src/pages/brands/index.astro', i);

// 3. network.astro
let n = fs.readFileSync('src/pages/network.astro', 'utf8');
n = n.replace(/\{brand\.discount && brand\.discount !== '\(暂无优惠）' && \([\s\S]*?<\/div>\s*\)\}/g, 
`{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
  const code = brand.coupon?.code || brand.discount;
  const val = brand.coupon?.discount || '';
  if (!code || code === '暂无优惠' || code === '(暂无优惠）') return null;
  return (
    <div class="mt-4 text-xs font-mono font-bold text-brand-accent/80 flex items-center justify-center">
      <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
      {val} {code ? \`Code: \${code}\` : ''}
    </div>
  );
})()}`);
fs.writeFileSync('src/pages/network.astro', n);

console.log('Fixed coupons in all other astros');
