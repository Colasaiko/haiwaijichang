const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

const regex = /\{brand\.coupon \|\| \(brand\.discount && brand\.discount !== '\(暂无优惠）'\) && \([\s\S]*?<\/div>\s*\)\}/;

const newBlock = `{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
            const couponCode = brand.coupon?.code || brand.discount || null;
            const couponDiscount = brand.coupon?.discount || null;
            const couponScope = brand.coupon?.scope || null;
            return (
              <div class="mt-4 flex flex-col items-center justify-center space-y-2">
                <div class="inline-flex items-center space-x-2 bg-brand-dark border border-brand-neon/30 px-4 py-2 rounded-sm text-sm shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                  <span class="text-slate-400">优惠码:</span>
                  {couponCode && couponCode !== '(暂无优惠）' ? <code class="text-brand-neon font-bold tracking-wider">{couponCode}</code> : <span class="text-slate-500">自动应用</span>}
                  {couponDiscount && (
                    <>
                      <span class="text-white/20 mx-2">|</span>
                      <span class="text-brand-accent font-bold">{couponDiscount}</span>
                    </>
                  )}
                  {couponScope && (
                    <>
                      <span class="text-white/20 mx-2">|</span>
                      <span class="text-slate-400">{couponScope}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })()}`;

c = c.replace(regex, newBlock);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed coupon in slug.astro');
