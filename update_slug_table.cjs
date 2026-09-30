const fs = require('fs');

const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

// I also need to make sure getBestCouponForPricing is imported in slug.astro
if (!content.includes('getBestCouponForPricing')) {
  content = content.replace(/import \{ getActiveCoupon \} from '\.\.\/\.\.\/utils\/coupon\.js';/, `import { getActiveCoupon, getBestCouponForPricing, getDiscountMultiplier } from '../../utils/coupon.js';`);
}

// Modify the table header
content = content.replace(
  '<th class="px-5 py-4 font-bold tracking-wider">价格</th>',
  '<th class="px-5 py-4 font-bold tracking-wider">价格</th>\n              <th class="px-5 py-4 font-bold tracking-wider">优惠情况</th>'
);

// Modify the table body loop
const searchRow = /<td class="px-5 py-3 align-middle">\s*<div class="flex flex-col space-y-1">\s*\{p\.discountPrice \? \(\s*<>\s*<span class="text-sm font-bold text-brand-neon">\{p\.discountPrice\}<\/span>\s*\{p\.originalPrice && <span class="text-xs text-slate-500 line-through">\{p\.originalPrice\}<\/span>\}\s*<\/>\s*\) : \(\s*<span class="text-sm font-bold text-brand-neon">\{p\.price \|\| p\.originalPrice \|\| '-'\}<\/span>\s*\)\}\s*<\/div>\s*<\/td>/;

const replaceRow = `<td class="px-5 py-3 align-middle">
                  <div class="flex flex-col space-y-1">
                    {(() => {
                      const coupon = getBestCouponForPricing(brand, p);
                      if (!coupon) {
                        return <span class="text-sm font-bold text-brand-neon">{p.price || p.originalPrice || '-'}</span>;
                      } else {
                        // Dynamically calculate discount or use hardcoded if not temporary
                        let discPrice = p.discountPrice;
                        if (coupon.type === 'temporary' && (p.originalPrice || p.price)) {
                          const origMatch = (p.originalPrice || p.price).match(/\\d+(\\.\\d+)?/);
                          if (origMatch) {
                            const val = parseFloat(origMatch[0]);
                            const mult = getDiscountMultiplier(coupon);
                            const prefix = (p.originalPrice || p.price).includes('¥') ? '¥' : '';
                            discPrice = prefix + (val * mult).toFixed(2).replace(/\\.00$/, '');
                          }
                        }
                        if (discPrice) {
                          return (
                            <>
                              <span class="text-sm font-bold text-brand-neon">{discPrice}</span>
                              <span class="text-xs text-slate-500 line-through">{p.originalPrice || p.price}</span>
                            </>
                          );
                        } else {
                           return <span class="text-sm font-bold text-brand-neon">{p.price || p.originalPrice || '-'}</span>;
                        }
                      }
                    })()}
                  </div>
                </td>
                <td class="px-5 py-3 align-middle text-xs">
                  {(() => {
                    const coupon = getBestCouponForPricing(brand, p);
                    if (!coupon) return <span class="text-slate-500 bg-slate-800 px-2 py-1 rounded">不适用</span>;
                    return (
                      <span class={\`\${coupon.type === 'temporary' ? 'text-brand-neon bg-brand-neon/10 border-brand-neon/20' : 'text-brand-accent bg-brand-accent/10 border-brand-accent/20'} border px-2 py-1 rounded whitespace-nowrap\`}>
                        {coupon.code} · {coupon.type === 'temporary' ? '限时' : ''}{coupon.discount}
                      </span>
                    );
                  })()}
                </td>`;

content = content.replace(searchRow, replaceRow);

fs.writeFileSync(path, content);
console.log('Updated price table in slug.astro');
