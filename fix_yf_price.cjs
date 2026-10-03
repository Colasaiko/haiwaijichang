const fs = require('fs');
let c = fs.readFileSync('src/content/brands/yifan.md', 'utf8');
c = c.replace(/originalPrice: (\d+(?:\.\d+)?)/g, (match, p1) => {
  return 'originalPrice: "¥' + parseFloat(p1).toFixed(2) + '"';
});
fs.writeFileSync('src/content/brands/yifan.md', c);
