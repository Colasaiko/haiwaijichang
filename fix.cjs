const fs = require('fs');

// Fix network.astro arrays
let network = fs.readFileSync('src/pages/network.astro', 'utf8');

network = network.replace(
  /<h2 class="text-3xl font-bold">常见问题<\/h2>/,
  '<h2 class="text-3xl font-bold">{faq.title}</h2>'
);

network = network.replace(
  /\{\[\s*\{ q: "我应该选择哪家服务？"[\s\S]*?\]\.map/m,
  '{faq.items.map'
);

network = network.replace(
  /\{\[\s*\{ title: "日常浏览"[\s\S]*?\]\.map/m,
  '{howToChoose.items.map'
);

network = network.replace(
  /\{\[\s*\{ key: "Routing"[\s\S]*?\]\.map/m,
  '{coreTechnology.items.map'
);

fs.writeFileSync('src/pages/network.astro', network, 'utf8');

// Fix index.astro markdown rendering
let index = fs.readFileSync('src/pages/index.astro', 'utf8');
index = index.replace(
  /<p class="text-lg text-slate-400">\s*\{seoSection.p1\}\s*<\/p>/,
  '<p class="text-lg text-slate-400" set:html={seoSection.p1.replace(/\\*\\*([^\\*]+)\\*\\*/g, \'<strong>$1</strong>\')} />'
);
index = index.replace(
  /<p class="text-slate-400">\s*\{seoSection.p2\}\s*<\/p>/,
  '<p class="text-slate-400" set:html={seoSection.p2.replace(/\\*\\*([^\\*]+)\\*\\*/g, \'<strong>$1</strong>\').replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, \'<a href="$2" class="text-brand-neon hover:underline">$1</a>\')} />'
);

fs.writeFileSync('src/pages/index.astro', index, 'utf8');
console.log('fixed arrays');
