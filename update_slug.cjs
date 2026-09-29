const fs = require('fs');
let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

content = content.replace(/href="#" data-departure-link/g, 'href={brand.aff || "#"} data-departure-link');

const pricingBlock = `<li><strong>套餐价格：</strong> {brand.pricing && brand.pricing.length > 0 ? (
  <div class="mt-4 overflow-x-auto w-full">
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
  </div>
) : "暂无可靠的套餐价格资料，以官网实时标注为准。"}</li>`;

content = content.replace(
  /<li><strong>套餐价格：<\/strong> .*?<\/li>/s,
  pricingBlock
);

fs.writeFileSync('src/pages/brands/[slug].astro', content);
console.log('Updated [slug].astro template');
