const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import brands from '\.\.\/\.?data\/brands\.json';/g, '');
  
  if (!content.includes("import { getCollection } from 'astro:content';")) {
    content = content.replace(/---/, "---\nimport { getCollection } from 'astro:content';");
  }
  
  // Find where frontmatter ends
  let lines = content.split('\n');
  let fmEnd = lines.indexOf('---', 1);
  if (fmEnd !== -1) {
    if (!content.includes("const brandEntries = await getCollection('brands');")) {
       lines.splice(fmEnd, 0, "const brandEntries = await getCollection('brands');\nconst brands = brandEntries.map(e => ({ id: e.id, ...e.data }));");
       content = lines.join('\n');
    }
  }
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

updateFile('src/pages/index.astro');
updateFile('src/pages/brands/index.astro');
// Let's also check topic pages like cheap-airport.astro
const pages = fs.readdirSync('src/pages');
pages.forEach(p => {
  if (p.endsWith('.astro') && p !== 'index.astro') {
     let c = fs.readFileSync('src/pages/' + p, 'utf8');
     if (c.includes('../data/brands.json')) {
        updateFile('src/pages/' + p);
     }
  }
});
