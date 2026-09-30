const fs = require('fs');

const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace H1 section
const h1Search = /<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">\s*\{brand\.h1 \|\| brand\.name\}\s*<\/h1>/;

const h1Replace = `<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 flex flex-col items-start gap-5">
            <span>{brand.h1 || brand.name}</span>
            <span 
              id="hero-limited-coupon-slot"
              data-temporary-coupons={JSON.stringify(brand.temporaryCoupons || [])}
              class="inline-flex flex-col sm:flex-row sm:items-center sm:flex-wrap text-sm md:text-base font-normal tracking-normal bg-brand-navy/30 border border-brand-accent/30 rounded px-4 py-2 text-brand-accent gap-2 md:gap-3 shadow-[0_0_15px_rgba(250,204,21,0.1)] max-w-full"
            >
              <span class="bg-brand-accent text-brand-dark px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0">限时优惠码</span>
              <span class="flex items-center flex-wrap gap-2 md:gap-3">
                <strong id="h1-temp-code" class="font-mono text-brand-neon tracking-wider">-</strong>
                <button id="h1-temp-copy" class="hidden items-center justify-center bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors" title="复制优惠码">复制</button>
                <span class="opacity-50">｜</span>
                <strong id="h1-temp-discount">-</strong>
                <span id="h1-temp-expiry-sep" class="opacity-50 hidden">｜</span>
                <span id="h1-temp-expiry" class="text-xs md:text-sm text-slate-300 hidden"></span>
              </span>
            </span>
          </h1>`;

content = content.replace(h1Search, h1Replace);

// 2. Replace Hero Right Column (Coupons)
const rightSearchRegex = /\{\(\(\) => \{\s*const activeCoupon = getActiveCoupon\(brand\);[\s\S]*?\}\(\)\}/;

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

content = content.replace(rightSearchRegex, rightReplace);

fs.writeFileSync(path, content);
console.log('Updated H1 and Coupon Cards in slug.astro');
