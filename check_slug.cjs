const fs = require('fs');

const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('getActiveCoupon')) {
  content = content.replace(/import \{ getCollection \} from 'astro:content';/g, `import { getCollection } from 'astro:content';\nimport { getActiveCoupon } from '../../utils/coupon.js';`);
  
  content = content.replace(/const brand = Astro\.props\.brand;/g, `const brand = Astro.props.brand;\nconst activeCoupon = getActiveCoupon(brand);`);
  
  // Find where brand.coupon is rendered in the Hero section and replace it.
  // We need to look for something like `{brand.coupon && (`
  
  const heroCouponRegex = /\{brand\.coupon && \(\s*<div class="bg-brand-navy\/50[^\}]*\}\)/;
  
  // Wait, let's just write a regex or replace block for the whole Hero coupon.
  // Or I can use a simpler approach: finding the exact block.
}
