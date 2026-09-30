const fs = require('fs');
let c = fs.readFileSync('dist/brands/weifeng/index.html', 'utf8');
const start = c.indexOf('<nav class="toc">');
const end = c.indexOf('</nav>', start);
console.log(c.substring(start, end + 6));
