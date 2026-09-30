const fs = require('fs');

// 1. guides.astro
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');
c = c.replace(/const categoryGuides = allGuides\.filter\(g => g\.data\.category === category\.id \|\| \(!g\.data\.category && category\.id === 'clash'\)\);/, 
  "const categoryGuides = allGuides.filter(g => g.data.category === category.id);");
fs.writeFileSync('src/pages/guides.astro', c);

// 2. clash-what-is.md
let m = fs.readFileSync('src/content/guides/clash-what-is.md', 'utf8');
m = m.replace(/description: "关于 Clash 机场的详细指南"/, 'description: "关于 Clash 机场的详细指南"\ncategory: "clash"');
fs.writeFileSync('src/content/guides/clash-what-is.md', m);

console.log('Fixed guides category logic');
