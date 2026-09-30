const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/<div class="mt-8 pt-8 border-t border-white\/10">/, 
`{brand.pricing && brand.pricing.length > 0 && (
    <div class="mt-12 mb-8">
      <h3 class="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center">
        <span class="w-1.5 h-6 bg-brand-neon mr-3 rounded-sm"></span>
        套餐与价格
      </h3>
      <div class="overflow-x-auto w-full border border-white/10 rounded-lg">
        <table class="min-w-full text-sm text-left text-slate-300 border-collapse">
          <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
            <tr>
              <th class="px-5 py-4 font-bold tracking-wider">套餐名称</th>
              <th class="px-5 py-4 font-bold tracking-wider">包含流量</th>
              <th class="px-5 py-4 font-bold tracking-wider">周期</th>
              <th class="px-5 py-4 font-bold tracking-wider">价格</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 bg-brand-dark/30">
            {brand.pricing.map((p) => (
              <tr class="hover:bg-white/5 transition-colors">
                <td class="px-5 py-4 font-bold text-white align-middle">{p.name || '-'}</td>
                <td class="px-5 py-4 align-middle">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-neon/10 text-brand-neon border border-brand-neon/20">
                    {p.traffic || '-'}
                  </span>
                </td>
                <td class="px-5 py-4 align-middle">{p.period || '-'}</td>
                <td class="px-5 py-3 align-middle">
                  <div class="flex flex-col space-y-1">
                    {p.discountPrice ? (
                      <>
                        <span class="text-sm font-bold text-brand-neon">{p.discountPrice}</span>
                        {p.originalPrice && <span class="text-xs text-slate-500 line-through">{p.originalPrice}</span>}
                      </>
                    ) : (
                      <span class="text-sm font-bold text-brand-neon">{p.price || p.originalPrice || '-'}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
  <div class="mt-8 pt-8 border-t border-white/10">`);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Restored pricing table');
