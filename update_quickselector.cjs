const fs = require('fs');
const path = 'src/components/charts/QuickSelector.astro';
let content = fs.readFileSync(path, 'utf8');

// Replace desc logic
const descRegex = /let desc = '普通个人使用';[\s\S]*?else if \(traffic\.includes\('120'\) \|\| traffic\.includes\('150'\)\) desc = '日常网页\/视频';/;

const newDescLogic = `let desc = plans[0].desc || '普通个人使用';
  let badge = plans[0].badge;
  if (!plans[0].desc) {
    if (name.includes('学生')) desc = '轻量使用\\n偶尔访问';
    else if (traffic.includes('300')) desc = '中等流量';
    else if (traffic.includes('600')) desc = '视频 / 多设备';
    else if (traffic.includes('1.0TB') || traffic.includes('1000') || traffic.includes('1800') || traffic.includes('830')) desc = '大流量使用';
    else if (traffic.includes('120') || traffic.includes('150')) desc = '日常网页/视频';
  }`;

content = content.replace(descRegex, newDescLogic);

// Ensure the HTML uses badge if available
const htmlRegex = /<div class="text-sm font-bold text-white whitespace-pre-line leading-snug">\{card\.desc\}<\/div>/;
const newHtml = `<div class="text-sm font-bold text-white whitespace-pre-line leading-snug">{card.badge ? <span class="bg-brand-neon text-brand-dark px-1.5 py-0.5 rounded text-xs mb-1 inline-block">{card.badge}</span> : null}<div>{card.desc}</div></div>`;

content = content.replace(htmlRegex, newHtml);

// Exclude plans that shouldn't be in QuickSelector, or let all of them render.
// The prompt implies they should all render.

// Make sure `badge` is passed to the return object
content = content.replace(/name,[\s]*traffic,/, 'name,\n    traffic,\n    badge,');

fs.writeFileSync(path, content);
console.log('Updated QuickSelector to support badge and desc');
