const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// 1. Schema Fake Price Removal
// It looks like `\"price\": \"10.00\"` is there. Let's find how schema is generated.
c = c.replace(/\"price\": \"10\.00\",?\s*\"priceCurrency\": \"USD\"/g, function(match) {
  return `\${brand.schemaPrice ? \`"price": "\${brand.schemaPrice.value}", "priceCurrency": "\${brand.schemaPrice.currency}"\` : ''}`;
});

// Actually, the easiest way is to rewrite the LD-JSON completely:
c = c.replace(/<script type="application\/ld\+json" set:html=\{JSON\.stringify\(\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "Product"[\s\S]*?\}\)\} \/>/, `
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": brand.name,
    "description": brand.description || brand.heroDescription || \`查看 \${brand.name} 详情\`,
    "offers": brand.schemaPrice ? {
      "@type": "Offer",
      "price": brand.schemaPrice.value,
      "priceCurrency": brand.schemaPrice.currency
    } : undefined
  })} />
`);

// 2. Remove automatic hero description
c = c.replace(
  /<p class="text-lg text-slate-400 max-w-2xl">[\s\S]*?<\/p>/,
  `<p class="text-lg text-slate-400 max-w-2xl">{brand.heroDescription || "查看该品牌当前收录的线路、套餐与使用资料。"}</p>`
);

// 3. Remove "理论上在晚高峰时能提供较低的物理延迟" and other hardcoded logic from the body.
// Wait, the body was generating things based on hasIPLC.
// The user said: "以下内容不能由 Renderer 自动替品牌生成: 品牌定位, 使用场景判断, AI 支持结论, Streaming 支持结论"
// "删除推断式品牌文案... 可以继续用 Feature 判断生成标签, 但正文解释必须来自 Brand MD."
c = c.replace(/<h3>已知服务特性<\/h3>[\s\S]*?<h3>使用建议与支持<\/h3>/, "<h3>使用建议与支持</h3>"); // Just remove the auto-generated bullets completely!

c = c.replace(/<div class="mt-8 pt-8 border-t border-white\/10">[\s\S]*?<\/div>\s*<\/div>/, `
  </div>
  <div class="mt-8 pt-8 border-t border-white/10">
    <h3 class="text-xl font-bold text-white mb-4">准备好体验 {brand.name} 了吗？</h3>
    {(brand.purchase?.url || brand.aff) ? (
      <a href={brand.purchase?.url || brand.aff} data-departure-link={brand.purchase?.cloaked !== false ? 'true' : undefined} class="inline-flex items-center justify-center px-8 py-3 bg-brand-neon text-brand-dark font-bold rounded-sm hover:bg-white transition-all tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.2)]">
        {brand.purchase?.label || '前往购买'}
      </a>
    ) : (
      <span class="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-slate-400 font-bold rounded-sm cursor-not-allowed tracking-widest">
        购买入口待补充
      </span>
    )}
  </div>
`);

// Support brand.coupon if it exists
c = c.replace(/brand\.discount && brand\.discount !== '\(暂无优惠）'/g, "brand.coupon || (brand.discount && brand.discount !== '(暂无优惠）')");
c = c.replace(/>\{brand\.discount\}<\/span>/, ">{brand.coupon ? brand.coupon.discount : brand.discount}</span>");


fs.writeFileSync('src/pages/brands/[slug].astro', c);

console.log('Fixed brand slug astro.');
