const fs = require('fs');

let c = fs.readFileSync('src/pages/status.astro', 'utf8');

c = c.replace(/const uptimeDays.*?\n.*?\n\s*\}\);/g, '');

c = c.replace(/\{heroText\}/g, `状态信息由站点人工维护，并非实时监控结果。`);

c = c.replace(/<div class="text-2xl font-bold text-white font-mono">99\.98%<\/div>\s*<div class="text-xs text-slate-500 mt-1 uppercase tracking-wider">90 Days Uptime<\/div>/g, 
`<div class="text-sm font-bold text-white font-mono pt-3">暂无可验证的历史可用率数据</div>\n<div class="text-xs text-slate-500 mt-1 uppercase tracking-wider">Historical Data Not Available</div>`);

// The uptime graph itself (which I replaced earlier using Array.from. Let's make sure it's gone or replace the whole section).
// Oh wait, my previous `fix_status.cjs` replaced the Array.from, but maybe left the container.
// The user says "保留当前机场风格 UI 可以，但不要制造历史数字。" So I should remove the graph block entirely.

c = c.replace(/<div class="flex items-end space-x-1 sm:space-x-1\.5 overflow-hidden h-8 mb-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, `</div></div></div></section>`);

fs.writeFileSync('src/pages/status.astro', c);
console.log('Fixed status.astro fake data.');
