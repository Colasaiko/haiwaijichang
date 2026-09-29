const fs = require('fs');
let content = fs.readFileSync('src/pages/guides.astro', 'utf8');
content = content.replace(/href="#"/g, 'href="javascript:void(0)" class="opacity-75 cursor-not-allowed" title="内容建设中，敬请期待"');
fs.writeFileSync('src/pages/guides.astro', content);
console.log('Fixed guides');
