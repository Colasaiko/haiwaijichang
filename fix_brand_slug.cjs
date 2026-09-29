const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/const title = .*/, 'const title = brand.seoTitle || `${brand.name} 怎么样？线路评测、套餐价格与使用教程 - 海外机场`;');
c = c.replace(/const description = .*/, 'const description = brand.seoDescription || `详细了解 ${brand.name} 的线路质量、套餐价格、流媒体及 ChatGPT 解锁能力。为您提供最新优惠信息及真实使用评价，帮您判断 ${brand.name} 是否适合您。`;');

// Make sure H1 is extracted or updated. Let's see if H1 is there.
c = c.replace(/<h1 class="(.*?)">\s*\{brand.name\}\s*<\/h1>/s, '<h1 class="$1">\n            {brand.h1 || brand.name}\n          </h1>');

fs.writeFileSync('src/pages/brands/[slug].astro', c);
