const fs = require('fs');

let c = fs.readFileSync('src/pages/status.astro', 'utf8');
const historySectionRegex = /<!-- 4\. Historical Uptime -->[\s\S]*?<!-- 5\. Recent Incidents -->/;
c = c.replace(historySectionRegex, '<!-- 5. Recent Incidents -->');

// Check if incidents array maps properly when empty.
c = c.replace(/\{incidents\.length > 0 \? \([\s\S]*?\) : \(/, `{incidents && incidents.length > 0 ? (
          <div class="space-y-6">
            {incidents.map(inc => (
              <div class="relative pl-8 sm:pl-32 py-6 group">
                <div class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-[6.5rem] before:h-full before:-ml-px before:w-0.5 before:bg-white/10 before:top-10">
                  <div class="absolute left-0 sm:left-24 w-4 h-4 rounded-full bg-brand-navy border-2 border-brand-accent flex items-center justify-center mt-1 z-10">
                    <div class="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                  </div>
                  <div class="text-sm font-mono text-slate-500 sm:w-24 sm:text-right sm:pr-8 sm:-ml-28 mb-2 sm:mb-0 mt-0.5">{inc.date}</div>
                  <h4 class="text-lg font-bold text-white">{inc.title}</h4>
                </div>
                <div class="sm:pl-0">
                  <p class="text-slate-400 text-sm">{inc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (`);

// Check if scheduled array maps properly when empty.
c = c.replace(/\{scheduled\.length > 0 \? \([\s\S]*?\) : \(/, `{scheduled && scheduled.length > 0 ? (
          <div class="space-y-4">
            {scheduled.map(sc => (
              <div class="bg-brand-navy border border-white/5 rounded-lg p-5 flex flex-col sm:flex-row sm:items-start justify-between group hover:border-brand-accent/30 transition-colors">
                <div class="mb-4 sm:mb-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="px-2 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-mono tracking-widest uppercase rounded border border-brand-accent/20">Maintenance</span>
                    <span class="text-xs font-mono text-slate-500">{sc.date}</span>
                  </div>
                  <h4 class="text-base font-bold text-white mb-1">{sc.title}</h4>
                  <p class="text-sm text-slate-400">{sc.desc}</p>
                </div>
                <div class="shrink-0 flex items-center text-sm font-mono text-slate-500">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Est. {sc.duration}
                </div>
              </div>
            ))}
          </div>
        ) : (`);

c = c.replace(/No historical incident data\./, '暂无公开事故记录。');
c = c.replace(/No scheduled maintenance\./, '暂无计划维护。');

fs.writeFileSync('src/pages/status.astro', c);
console.log('Fixed status completely');
