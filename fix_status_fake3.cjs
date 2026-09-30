const fs = require('fs');
let c = fs.readFileSync('src/pages/status.astro', 'utf8');

const s1 = `// Generate 90 days uptime array (1 = green, 0 = yellow)
const uptimeDays = Array.from({ length: 90 }, (_, i) => {
  // Make a few random days yellow to look realistic, but mostly green
  return (i === 15 || i === 70) ? 'yellow' : 'green';
});`;
c = c.replace(s1, '');

const s2 = `<div class="text-2xl font-bold text-white font-mono">99.98%</div>
                <div class="text-xs text-slate-500 mt-1 uppercase tracking-wider">90 Days Uptime</div>`;
c = c.replace(s2, `<div class="text-sm font-bold text-white font-mono pt-3">暂无可验证的历史可用率数据。</div>
                <div class="text-xs text-slate-500 mt-1 uppercase tracking-wider">当前状态信息由站点人工维护，并非实时监控结果。</div>`);

const s3Regex = /<div class="flex items-end space-x-1 sm:space-x-1\.5 overflow-hidden h-8 mb-2">[\s\S]*?<\/div>/;
c = c.replace(s3Regex, '');

fs.writeFileSync('src/pages/status.astro', c);
console.log('Fixed status fake data');
