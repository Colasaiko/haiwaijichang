const fs = require('fs');
let c = fs.readFileSync('src/content/brands/yifan.md', 'utf8');

c = c.replace(/"月付": 20/g, '"月付": "¥20"');
c = c.replace(/"年付": 168/g, '"年付": "¥168"');
c = c.replace(/"月付": 35/g, '"月付": "¥35"');
c = c.replace(/"年付": 298/g, '"年付": "¥298"');
c = c.replace(/"月付": 55/g, '"月付": "¥55"');
c = c.replace(/"年付": 498/g, '"年付": "¥498"');
c = c.replace(/"月付": 95/g, '"月付": "¥95"');
c = c.replace(/"年付": 888/g, '"年付": "¥888"');

fs.writeFileSync('src/content/brands/yifan.md', c);
