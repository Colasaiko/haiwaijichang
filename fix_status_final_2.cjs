const fs = require('fs');

let c = fs.readFileSync('src/pages/status.astro', 'utf8');

// 1. Completely remove 90 Days graph section
const historySectionRegex = /<!-- 4\. Uptime Graph \(GitHub Style\) -->[\s\S]*?<!-- 5\. Scheduled Maintenance -->/;
c = c.replace(historySectionRegex, '<!-- 5. Scheduled Maintenance -->');

// 2. Fix Scheduled Maintenance empty state
c = c.replace(/<div class="space-y-6">\s*\{scheduled\.map[\s\S]*?\}\)\}\s*<\/div>/, 
`{scheduled && scheduled.length > 0 ? (
        <div class="space-y-6">
          {scheduled.map(item => (
            <div class="border-l-2 border-brand-accent pl-4 ml-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h4 class="text-lg font-bold text-white">{item.title}</h4>
                <span class="text-xs font-mono bg-brand-accent/20 text-brand-accent px-2 py-1 rounded mt-2 sm:mt-0">{item.date}</span>
              </div>
              <p class="text-sm text-brand-accent/80 font-mono mb-2">{item.time}</p>
              <p class="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        <div class="text-sm text-slate-400">暂无计划维护。</div>
      )}`);

// 3. Fix Incidents empty state
c = c.replace(/<div class="space-y-8 relative before:absolute[\s\S]*?\}\)\}\s*<\/div>/, 
`{incidents && incidents.length > 0 ? (
        <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300/10 before:to-transparent">
          {incidents.map((incident, i) => (
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div class={\`flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-dark \${incident.status === 'RESOLVED' ? 'bg-green-500' : 'bg-slate-500'} text-brand-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10\`}>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-brand-navy p-5 rounded border border-white/10 shadow">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-bold text-white text-sm">{incident.title}</span>
                  <span class="text-[10px] font-mono text-slate-500">{incident.date}</span>
                </div>
                <div class={\`text-[10px] font-mono tracking-widest mb-3 \${incident.status === 'RESOLVED' ? 'text-green-400' : 'text-slate-400'}\`}>
                  [{incident.status}] {incident.time}
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">{incident.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="text-sm text-slate-400">暂无公开事故记录。</div>
      )}`);

// 4. Ensure Hero description
c = c.replace(/状态信息由站点人工维护，并非实时监控结果。/, '状态信息由站点人工维护，并非实时监控结果。');

fs.writeFileSync('src/pages/status.astro', c);
console.log('Fixed status completely per final instructions.');
