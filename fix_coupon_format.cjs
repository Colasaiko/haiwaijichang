const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

const regex = /\{\(brand\.coupon \|\| \(brand\.discount && brand\.discount !== '\(暂无优惠）'\)\) && \(\(\) => \{[\s\S]*?\}\)\(\)\}/;

const newBlock = `{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
            const couponCode = brand.coupon?.code || brand.discount || null;
            const couponDiscount = brand.coupon?.discount || null;
            const couponScope = brand.coupon?.scope || null;
            return (
              <div class="mt-4 flex flex-col items-center justify-center space-y-2">
                <div class="inline-flex flex-col sm:flex-row sm:items-center bg-brand-dark border border-brand-neon/30 px-6 py-3 rounded-md text-sm shadow-[0_0_10px_rgba(56,189,248,0.1)] gap-3">
                  
                  {couponCode && couponCode !== '(暂无优惠）' ? (
                    <div class="flex items-center">
                      <span class="text-slate-400 mr-2">优惠码:</span>
                      <code class="text-brand-neon font-bold tracking-wider">{couponCode}</code>
                    </div>
                  ) : null}

                  {couponDiscount && (
                    <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                      <span class="text-slate-400 mr-2">优惠:</span>
                      <span class="text-brand-accent font-bold">{couponDiscount}</span>
                    </div>
                  )}

                  {couponScope && (
                    <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                      <span class="text-slate-400 mr-2">适用范围:</span>
                      <span class="text-white">{couponScope}</span>
                    </div>
                  )}
                  
                </div>
              </div>
            );
          })()}`;

c = c.replace(regex, newBlock);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed coupon format precisely.');
