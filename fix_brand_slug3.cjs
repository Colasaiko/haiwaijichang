const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// 1. Fix Keywords
c = c.replace(
  /const title = .*?;\nconst description = .*?;\nconst h1 = .*?;/,
  `const title = brand.seoTitle || brand.title || \`\${brand.name} 怎么样？线路评测、套餐价格与使用教程 - 海外机场\`;
const description = brand.seoDescription || brand.description || \`详细了解 \${brand.name} 的线路质量、套餐价格、流媒体及 ChatGPT 解锁能力。为您提供最新优惠信息及真实使用评价，帮您判断 \${brand.name} 是否适合您。\`;
const keywords = Array.isArray(brand.keywords) 
  ? brand.keywords.join(', ')
  : brand.keywords || \`\${brand.name}, \${brand.name}怎么样, \${brand.name}机场, \${brand.name}优惠码, \${brand.name}专线, \${brand.name}教程\`;
const h1 = brand.h1 || brand.name;`
);

c = c.replace(
  /<Layout title=\{title\} description=\{description\} keywords=\{`\$\{brand.name\}, \$\{brand.name\}怎么样, \$\{brand.name\}机场, \$\{brand.name\}优惠码, \$\{brand.name\}专线, \$\{brand.name\}教程`\}>/,
  `<Layout title={title} description={description} keywords={keywords}>`
);

// 2. Fix Hero Description
c = c.replace(
  /<p class="text-lg text-slate-400 max-w-2xl leading-relaxed">\s*\{brand\.name\} 是一家优质的海外网络加速服务提供商，专为解决国际网络延迟、流媒体解锁和海外工作需求而设计。本页为您提供详细的评测和使用指导。\s*<\/p>/,
  `<p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
            {brand.heroDescription || "查看该品牌当前收录的线路、套餐与使用资料。"}
          </p>`
);

// 3. Coupon Logic
c = c.replace(
  /\{brand\.coupon \|\| \(brand\.discount && brand\.discount !== '\(暂无优惠）'\) && \(/,
  `{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (`
);

c = c.replace(
  /\{brand\.coupon \? brand\.coupon\.discount : brand\.discount\}/,
  `{brand.coupon ? \`\${brand.coupon.discount || ''} \${brand.coupon.code ? ' - Code: '+brand.coupon.code : ''}\` : brand.discount}`
);

// But we want it nicely formatted as per user request. Let's find the coupon block.
// Wait, I don't know what it looks like now. Let's just write a new coupon block.
c = c.replace(
  /\{(brand\.coupon \|\| \(brand\.discount && brand\.discount !== '\(暂无优惠）'\)\) && \([\s\S]*?<\/div>\s*\)\}/,
  `{(brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')) && (() => {
    const couponCode = brand.coupon?.code || null;
    const couponDiscount = brand.coupon?.discount || brand.discount;
    const couponScope = brand.coupon?.scope || null;
    return (
      <div class="mt-4 text-center">
        <div class="inline-flex items-center space-x-2 bg-brand-dark border border-brand-neon/30 px-4 py-2 rounded-sm text-sm">
          <span class="text-slate-400">优惠码:</span>
          {couponCode ? <code class="text-brand-neon font-bold tracking-wider">{couponCode}</code> : <span class="text-slate-500">自动应用</span>}
          <span class="text-white/20 mx-2">|</span>
          <span class="text-brand-accent font-bold">{couponDiscount}</span>
          {couponScope && <span class="text-white/20 mx-2">|</span>}
          {couponScope && <span class="text-slate-400">{couponScope}</span>}
        </div>
      </div>
    );
  })()}`
);


// 4. Restore Pricing Table inside the <Content /> area or after it?
// User said: Renderer 负责表格。内容归 Markdown。
// Let's inject it right before the Purchase button.
c = c.replace(
  /<div class="mt-8 pt-8 border-t border-white\/10">/,
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
  <div class="mt-8 pt-8 border-t border-white/10">`
);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed slug.astro');
