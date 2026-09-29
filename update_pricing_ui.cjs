const fs = require('fs');
let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

const oldTable = `<div class="mt-4 overflow-x-auto w-full">
    <table class="min-w-full text-sm text-left text-slate-300">
      <thead class="text-xs uppercase bg-white/5 text-slate-400">
        <tr>
          <th class="px-4 py-2">套餐名称</th>
          <th class="px-4 py-2">包含流量</th>
          <th class="px-4 py-2">参考价格</th>
        </tr>
      </thead>
      <tbody>
        {brand.pricing.map((p) => (
          <tr class="border-b border-white/5">
            <td class="px-4 py-2 font-medium text-white">{p.name || '未知'}</td>
            <td class="px-4 py-2">{p.traffic || '-'}</td>
            <td class="px-4 py-2 text-brand-neon">{p.price || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>`;

const newTable = `<div class="mt-6 mb-4 overflow-x-auto w-full border border-white/10 rounded-lg">
    <table class="min-w-full text-sm text-left text-slate-300 border-collapse">
      <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
        <tr>
          <th class="px-5 py-4 font-bold tracking-wider">套餐名称</th>
          <th class="px-5 py-4 font-bold tracking-wider">包含流量</th>
          <th class="px-5 py-4 font-bold tracking-wider">参考价格</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5 bg-brand-dark/30">
        {brand.pricing.map((p) => (
          <tr class="hover:bg-white/5 transition-colors">
            <td class="px-5 py-4 font-bold text-white align-middle">{p.name || '未知'}</td>
            <td class="px-5 py-4 align-middle">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-neon/10 text-brand-neon border border-brand-neon/20">
                {p.traffic || '-'}
              </span>
            </td>
            <td class="px-5 py-3 align-middle">
              <div class="flex flex-wrap gap-2">
                {p.price ? p.price.split('|').map((pricePart: string) => (
                  <span class="inline-block bg-white/10 border border-white/20 rounded px-3 py-1.5 text-xs text-brand-neon font-mono shadow-sm">
                    {pricePart.trim()}
                  </span>
                )) : '-'}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>`;

content = content.replace(oldTable, newTable);
fs.writeFileSync('src/pages/brands/[slug].astro', content);
console.log('Updated pricing table rendering in [slug].astro');
