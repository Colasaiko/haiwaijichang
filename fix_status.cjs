const fs = require('fs');

let c = fs.readFileSync('src/pages/status.astro', 'utf8');

c = c.replace(/\{Array\.from\(\{ length: 90 \}\)\.map\(\(\_, i\) => \([\s\S]*?\}\)/g, 
`{Array.from({ length: 90 }).map((_, i) => (
  <div class="w-1.5 h-8 bg-brand-neon/80 rounded-sm hover:bg-white transition-colors cursor-pointer group relative">
    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-dark border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-10">
      {90 - i} days ago<br/><span class="text-brand-neon">100% Uptime</span>
    </div>
  </div>
))}`);

fs.writeFileSync('src/pages/status.astro', c);
console.log('Fixed status astro.');
