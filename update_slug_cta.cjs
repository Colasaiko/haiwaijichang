const fs = require('fs');

let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// Replace CTA text in Hero
content = content.replace(
  /<a href=\{brand\.aff \|\| "#"\} data-departure-link class="inline-flex items-center justify-center px-8 py-4 bg-brand-neon text-brand-dark font-bold text-lg rounded-sm hover:bg-brand-neon\/90 transition-all uppercase tracking-widest shadow-\[0_0_20px_rgba\(56,189,248,0\.3\)\]">[\s\S]*?<\/a>/,
  `{brand.aff ? (
            <a href={brand.aff} data-departure-link class="inline-flex items-center justify-center px-8 py-4 bg-brand-neon text-brand-dark font-bold text-lg rounded-sm hover:bg-white transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(56,189,248,0.3)] w-full md:w-auto">
              快速购买
            </a>
          ) : (
            <span class="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-slate-400 font-bold text-lg rounded-sm cursor-not-allowed uppercase tracking-widest w-full md:w-auto">
              购买入口待补充
            </span>
          )}`
);

// Add CTA at the end of the article
content = content.replace(
  /<\/p>\s*<\/div>\s*<\/div>\s*<!-- Sidebar -->/,
  `</p>
          <div class="mt-8 pt-8 border-t border-white/10">
            <h3 class="text-xl font-bold text-white mb-4">准备好体验 {brand.name} 了吗？</h3>
            {brand.aff ? (
              <a href={brand.aff} data-departure-link class="inline-flex items-center justify-center px-8 py-3 bg-brand-neon text-brand-dark font-bold rounded-sm hover:bg-white transition-all tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                前往购买
              </a>
            ) : (
              <span class="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-slate-400 font-bold rounded-sm cursor-not-allowed tracking-widest">
                购买入口待补充
              </span>
            )}
          </div>
        </div>
      </div>

      <!-- Sidebar -->`
);

fs.writeFileSync('src/pages/brands/[slug].astro', content);
console.log('Updated [slug].astro with new CTA design.');
