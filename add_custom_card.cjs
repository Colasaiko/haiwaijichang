const fs = require('fs');
const path = 'src/content/brands/lingmao.md';
let content = fs.readFileSync(path, 'utf8');

const customTrafficCard = `
## CUSTOM TRAFFIC / 大流量定制

<div class="bg-brand-navy p-6 rounded-xl border border-white/5 mb-12">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-xl font-bold text-white mb-1">大流量定制展示入口</h3>
      <div class="text-2xl font-black text-brand-neon font-mono">¥999 <span class="text-xs text-slate-400 font-normal">/月</span></div>
    </div>
    <div class="text-right">
      <span class="inline-block bg-brand-neon/10 text-brand-neon text-xs font-bold px-3 py-1 rounded uppercase tracking-wider border border-brand-neon/20">联系客服确认</span>
    </div>
  </div>
  <p class="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
    官方页面将该项目作为大流量及专线定制入口，具体流量、用途和配置需要联系客服或提交工单确认。
  </p>
</div>
`;

content = content.replace('## IPLC / x1 / 不限速 / 1000Mbps', customTrafficCard + '\n## IPLC / x1 / 不限速 / 1000Mbps');

fs.writeFileSync(path, content);
console.log('Added CUSTOM TRAFFIC card to lingmao.md');
