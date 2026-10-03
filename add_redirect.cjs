const fs = require('fs');
let cfg = fs.readFileSync('astro.config.mjs', 'utf8');
cfg = cfg.replace("site: 'https://haiwaijichang.com/',", "site: 'https://haiwaijichang.com/', redirects: { '/brands/v': '/brands/feiv' },");
fs.writeFileSync('astro.config.mjs', cfg);
console.log('Redirect added.');
