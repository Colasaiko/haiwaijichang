const fs = require('fs');

const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

// The block to replace starts at:
// {(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
// and ends after the corresponding })()}

const startString = "{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {";
let startIndex = content.indexOf(startString);

if (startIndex !== -1) {
  // Find the end of this block
  const endString = "})()}";
  let endIndex = content.indexOf(endString, startIndex) + endString.length;
  
  const rightReplace = `{(() => {
            const stdCoupon = brand.coupon;
            return (
              <div class="mt-4 flex flex-col items-end justify-center space-y-3 w-full">
                
                {/* Detailed Temp Coupon Card (Client-side populated) */}
                <div id="hero-temp-detailed-card" class="hidden flex-col bg-brand-dark border border-brand-accent px-6 py-4 rounded-md text-sm shadow-[0_0_15px_rgba(250,204,21,0.2)] w-full">
                  <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span class="text-[10px] font-bold tracking-widest bg-brand-accent text-brand-dark px-2 py-0.5 rounded uppercase flex items-center shrink-0">
                      <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      LIMITED OFFER
                    </span>
                    <span id="card-temp-countdown" class="text-brand-accent font-bold text-[10px] sm:text-xs ml-2 text-right"></span>
                  </div>
                  <div id="card-temp-name" class="text-white font-bold mb-3 text-center">-</div>
                  <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-center gap-3">
                    <div class="flex items-center">
                      <span class="text-slate-400 mr-2 text-xs shrink-0">优惠码:</span>
                      <code id="card-temp-code" class="text-brand-neon font-bold tracking-wider text-base">-</code>
                    </div>
                    <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                      <span class="text-slate-400 mr-2 text-xs shrink-0">优惠:</span>
                      <span id="card-temp-discount" class="text-brand-accent font-bold text-base">-</span>
                    </div>
                    <div class="flex items-center sm:border-l sm:border-white/20 sm:pl-3">
                      <span class="text-slate-400 mr-2 text-xs shrink-0">范围:</span>
                      <span id="card-temp-scope" class="text-white text-xs">-</span>
                    </div>
                  </div>
                </div>

                {/* Standard Coupon */}
                {stdCoupon && (
                  <div class="inline-flex flex-col sm:flex-row sm:flex-wrap sm:items-center bg-brand-dark border border-brand-neon/30 px-6 py-3 rounded-md text-sm shadow-[0_0_10px_rgba(56,189,248,0.1)] gap-3 w-full justify-center lg:justify-start">
                    <div class="w-full text-center sm:hidden mb-1 text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">常驻优惠</div>
                    <div class="hidden sm:block text-[10px] font-bold tracking-widest bg-brand-neon/20 text-brand-neon px-2 py-0.5 rounded uppercase mr-2 shrink-0">常驻优惠</div>
                    
                    <div class="flex items-center justify-center">
                      <span class="text-slate-400 mr-2 text-xs shrink-0">优惠码:</span>
                      <code class="text-brand-neon font-bold tracking-wider">{stdCoupon.code}</code>
                    </div>

                    {stdCoupon.discount && (
                      <div class="flex items-center justify-center sm:border-l sm:border-white/20 sm:pl-3">
                        <span class="text-slate-400 mr-2 text-xs shrink-0">优惠:</span>
                        <span class="text-brand-accent font-bold">{stdCoupon.discount}</span>
                      </div>
                    )}

                    {stdCoupon.scope && (
                      <div class="flex items-center justify-center sm:border-l sm:border-white/20 sm:pl-3">
                        <span class="text-slate-400 mr-2 text-xs shrink-0">适用范围:</span>
                        <span class="text-white text-xs text-center">{stdCoupon.scope}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <script is:inline>
                  (function() {
                    const slot = document.getElementById('hero-limited-coupon-slot');
                    if (!slot) return;
                    
                    const tempsRaw = slot.getAttribute('data-temporary-coupons');
                    let temps = [];
                    try { temps = JSON.parse(tempsRaw); } catch(e) {}
                    
                    const h1Code = document.getElementById('h1-temp-code');
                    const h1Discount = document.getElementById('h1-temp-discount');
                    const h1Expiry = document.getElementById('h1-temp-expiry');
                    const h1ExpirySep = document.getElementById('h1-temp-expiry-sep');
                    const h1Copy = document.getElementById('h1-temp-copy');
                    
                    const card = document.getElementById('hero-temp-detailed-card');
                    const cardName = document.getElementById('card-temp-name');
                    const cardCode = document.getElementById('card-temp-code');
                    const cardDiscount = document.getElementById('card-temp-discount');
                    const cardScope = document.getElementById('card-temp-scope');
                    const cardCountdown = document.getElementById('card-temp-countdown');
                    
                    let activeInterval = null;
                    
                    function update() {
                      const now = Date.now();
                      const activeTemps = temps.filter(c => {
                        if (!c.startsAt || !c.expiresAt) return false;
                        const s = new Date(c.startsAt).getTime();
                        const e = new Date(c.expiresAt).getTime();
                        return now >= s && now <= e;
                      });
                      
                      if (activeTemps.length > 0) {
                        activeTemps.sort((a, b) => (b.priority || 0) - (a.priority || 0));
                        const best = activeTemps[0];
                        const expiresAt = new Date(best.expiresAt).getTime();
                        
                        // Populate H1
                        h1Code.textContent = best.code;
                        h1Discount.textContent = best.discount;
                        
                        const expDate = new Date(best.expiresAt);
                        h1Expiry.textContent = (expDate.getMonth() + 1) + '月' + expDate.getDate() + '日截止';
                        h1Expiry.classList.remove('hidden');
                        h1ExpirySep.classList.remove('hidden');
                        h1Copy.classList.remove('hidden');
                        h1Copy.classList.add('flex');
                        
                        h1Copy.onclick = () => {
                          navigator.clipboard.writeText(best.code).then(() => {
                            h1Copy.textContent = '已复制';
                            setTimeout(() => h1Copy.textContent = '复制', 2000);
                          });
                        };
                        
                        // Populate Card
                        if (card) {
                          card.style.display = 'flex';
                          cardName.textContent = best.name;
                          cardCode.textContent = best.code;
                          cardDiscount.textContent = best.discount;
                          cardScope.textContent = best.scope || '-';
                          
                          const diff = expiresAt - now;
                          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          cardCountdown.textContent = \`剩余 \${d}天 \${h}小时\`;
                        }
                        return true;
                      } else {
                        // Reset to placeholders
                        h1Code.textContent = '-';
                        h1Discount.textContent = '-';
                        h1Expiry.classList.add('hidden');
                        h1ExpirySep.classList.add('hidden');
                        h1Copy.classList.add('hidden');
                        h1Copy.classList.remove('flex');
                        
                        if (card) {
                          card.style.display = 'none';
                        }
                        if (activeInterval) clearInterval(activeInterval);
                        return false;
                      }
                    }
                    
                    if (update()) {
                      activeInterval = setInterval(update, 1000 * 60 * 60);
                    }
                  })();
                </script>
              </div>
            );
          })()}`;
          
  content = content.substring(0, startIndex) + rightReplace + content.substring(endIndex);
  fs.writeFileSync(path, content);
  console.log('Fixed right column replacement.');
} else {
  console.log('Could not find right column block to replace.');
}
