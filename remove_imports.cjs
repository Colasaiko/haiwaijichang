const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    } else if (p.endsWith('.astro')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes("import fs from")) {
        content = content.replace(/import fs from '[^']+';\n/g, '');
        content = content.replace(/import path from '[^']+';\n/g, '');
        fs.writeFileSync(p, content);
      }
    }
  });
}

processDir('src/pages');
