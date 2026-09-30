const fs = require('fs');

const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

// The block to replace is:
/*
          {(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
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
          })()}
*/

const searchBlock = /\{\(brand\.coupon \|\| \(brand\.discount && brand\.discount !== '\(暂无优惠）'\)\)\) && \(\(\) => \{[\s\S]*?\}\)\(\)\}/;

const replacement = `
          {(() => {
            const activeCoupon = getActiveCoupon(brand);
            const stdCoupon = brand.coupon;
            
            if (!activeCoupon) return null;
            
            return (
              <div class="mt-4 flex flex-col items-center justify-center space-y-2 w-full">
                {activeCoupon.type === 'temporary' && (
                  <div id="hero-temp-coupon" class="inline-flex flex-col bg-brand-dark border border-brand-accent px-6 py-4 rounded-md text-sm shadow-[0_0_15px_rgba(250,204,21,0.2)] w-full">
                    <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <span class="text-[10px] font-bold tracking-widest bg-brand-accent text-brand-dark px-2 py-0.5 rounded uppercase flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        LIMITED OFFER / 限时优惠
                      </span>
                      <span class="text-brand-accent font-bold text-xs" id="coupon-countdown" data-expires={activeCoupon.expiresAt}></span>
                    </div>
                    
                    <div class="text-white font-bold mb-3 text-center">{activeCoupon.name}</div>
                    
                    <div class="flex flex-col sm:flex-row sm:items-center justify-center gap-3">
                      <div class="flex items-center">
                        <span class="text-slate-400 mr-2 text-xs">优惠码:</span>
                        <code class="text-brand-neon font-bold tracking-wider text-base">{activeCoupon.code}</code>
                      </div>
                      
                      {activeCoupon.discount && (
                        <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                          <span class="text-slate-400 mr-2 text-xs">优惠:</span>
                          <span class="text-brand-accent font-bold text-base">{activeCoupon.discount}</span>
                        </div>
                      )}
                      
                      {activeCoupon.scope && (
                        <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                          <span class="text-slate-400 mr-2 text-xs">范围:</span>
                          <span class="text-white text-xs">{activeCoupon.scope}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {stdCoupon && (
                  <div id="hero-std-coupon" class={\`inline-flex flex-col sm:flex-row sm:items-center bg-brand-dark border border-brand-neon/30 px-6 py-3 rounded-md text-sm shadow-[0_0_10px_rgba(56,189,248,0.1)] gap-3 \${activeCoupon.type === 'temporary' ? 'hidden' : ''}\`}>
                    <div class="flex items-center">
                      <span class="text-slate-400 mr-2">优惠码:</span>
                      <code class="text-brand-neon font-bold tracking-wider">{stdCoupon.code}</code>
                    </div>

                    {stdCoupon.discount && (
                      <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                        <span class="text-slate-400 mr-2">优惠:</span>
                        <span class="text-brand-accent font-bold">{stdCoupon.discount}</span>
                      </div>
                    )}

                    {stdCoupon.scope && (
                      <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                        <span class="text-slate-400 mr-2">适用范围:</span>
                        <span class="text-white">{stdCoupon.scope}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {activeCoupon.type === 'temporary' && (
                  <script is:inline>
                    (function() {
                      const tempEl = document.getElementById('hero-temp-coupon');
                      const stdEl = document.getElementById('hero-std-coupon');
                      const countdownEl = document.getElementById('coupon-countdown');
                      
                      if (!tempEl || !countdownEl) return;
                      
                      const expiresAt = new Date(countdownEl.getAttribute('data-expires')).getTime();
                      
                      function update() {
                        const now = Date.now();
                        if (now > expiresAt) {
                          tempEl.style.display = 'none';
                          if (stdEl) {
                            stdEl.classList.remove('hidden');
                            stdEl.style.display = 'inline-flex';
                          }
                          return false; // Stop checking
                        } else {
                          // Update countdown
                          const diff = expiresAt - now;
                          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          countdownEl.textContent = \`剩余 \${d}天 \${h}小时\`;
                          return true; // Keep checking
                        }
                      }
                      
                      // Run immediately to prevent FOUC
                      if (update()) {
                        // If still valid, setup interval
                        setInterval(update, 1000 * 60 * 60); // Check every hour
                      }
                    })();
                  </script>
                )}
              </div>
            );
          })()}
`;

if (!content.includes('activeCoupon.type === \'temporary\'')) {
  // We need to add import getActiveCoupon as well.
  if (!content.includes('getActiveCoupon')) {
    content = content.replace(/import \{ getCollection \} from 'astro:content';/, "import { getCollection } from 'astro:content';\nimport { getActiveCoupon } from '../../utils/coupon.js';");
  }
  
  content = content.replace(searchBlock, replacement);
  fs.writeFileSync(path, content);
  console.log('slug.astro updated successfully');
} else {
  console.log('slug.astro already updated');
}
