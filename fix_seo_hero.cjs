const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/const currentUrl = Astro\.url\.href;/, `
const keywords = Array.isArray(brand.keywords) 
  ? brand.keywords.join(', ')
  : brand.keywords || \`\${brand.name}, \${brand.name}怎么样, \${brand.name}机场, \${brand.name}优惠码, \${brand.name}专线, \${brand.name}教程\`;
const currentUrl = Astro.url.href;`);

c = c.replace(/<Layout title=\{title\} description=\{description\} keywords=\{`\$\{brand\.name\}, \$\{brand\.name\}怎么样, \$\{brand\.name\}机场, \$\{brand\.name\}优惠码, \$\{brand\.name\}专线, \$\{brand\.name\}教程`\}>/, 
`<Layout title={title} description={description} keywords={keywords}>`);

c = c.replace(/<p class="text-lg text-slate-400 max-w-2xl leading-relaxed">\s*\{brand\.name\} 是一家优质的海外网络加速服务提供商，专为解决国际网络延迟、流媒体解锁和海外工作需求而设计。本页为您提供详细的评测和使用指导。\s*<\/p>/, 
`<p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
            {brand.heroDescription || "查看该品牌当前收录的线路、套餐与使用资料。"}
          </p>`);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed SEO and HeroDescription in slug.astro');
