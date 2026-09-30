const fs = require('fs');
let c = fs.readFileSync('src/pages/status.astro', 'utf8');

c = c.replace(/\{uptimeDays\.map\([\s\S]*?\)\}/, '');
c = c.replace(/const uptimeDays = Array\.from\(\{ length: 90 \}, \(\_, i\) => \{\r?\n\s*\/\/ Make a few random days yellow to look realistic, but mostly green\r?\n\s*return \(i === 15 \|\| i === 70\) \? 'yellow' : 'green';\r?\n\}\);/, '');

fs.writeFileSync('src/pages/status.astro', c);
