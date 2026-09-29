const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');

let lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('javascript:void(0)')) {
    lines[i] = lines[i].replace('<a href="javascript:void(0)"', '<div');
  }
  if (lines[i].trim() === '</a>' && lines[i+1] && lines[i+1].includes('}))')) {
    lines[i] = lines[i].replace('</a>', '</div>');
  }
}
fs.writeFileSync('src/pages/guides.astro', lines.join('\n'));
