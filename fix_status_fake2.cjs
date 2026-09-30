const fs = require('fs');
let c = fs.readFileSync('src/pages/status.astro', 'utf8');

c = c.replace(/\/\/ Generate 90 days uptime[\s\S]*?\}\);/g, '');

c = c.replace(/<div class="text-2xl font-bold text-white font-mono">99\.98%<\/div>[\s\S]*?<div class="text-xs text-slate-500 mt-1 uppercase tracking-wider">90 Days Uptime<\/div>/, 
  `<div class="text-sm font-bold text-white font-mono pt-3">暂无可验证的历史可用率数据</div>
                <div class="text-xs text-slate-500 mt-1 uppercase tracking-wider">当前状态信息由站点人工维护，并非实时监控结果。</div>`);

c = c.replace(/<div class="flex items-end space-x-1 sm:space-x-1\.5 overflow-hidden h-8 mb-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, `</div>
              </div>
            </div>
          </div>
        </div>
      </section>`);

fs.writeFileSync('src/pages/status.astro', c);
console.log('Fixed status fake data');
