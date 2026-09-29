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
      if (content.includes("const brands = brandEntries.map")) {
        // If it's already sorting, skip
        if (!content.includes(".sort((a, b) => (a.order || 999) - (b.order || 999))")) {
          content = content.replace(
            /const brands = brandEntries\.map\(e => \(\{ id: e\.id, \.\.\.e\.data \}\)\);/g,
            "const brands = brandEntries.map(e => ({ id: e.id, ...e.data })).sort((a, b) => (a.order || 999) - (b.order || 999));"
          );
          
          content = content.replace(
            /const brands = brandEntries\.map\(\(e\) => \(\{[\s\n]*id: e\.id,[\s\n]*\.\.\.e\.data,[\s\n]*\}\)\);/g,
            "const brands = brandEntries.map((e) => ({ id: e.id, ...e.data })).sort((a, b) => (a.order || 999) - (b.order || 999));"
          );

          fs.writeFileSync(p, content);
          console.log('Updated', p);
        }
      }
      
      // Special case for [slug].astro where `allBrands` is mapped
      if (p.includes('[slug].astro')) {
         if (!content.includes(".sort((a, b) => (a.order || 999) - (b.order || 999))")) {
            content = content.replace(
              /const allBrands = allEntries\.map\(e => \(\{ id: e\.id, \.\.\.e\.data \}\)\);/,
              "const allBrands = allEntries.map(e => ({ id: e.id, ...e.data })).sort((a, b) => (a.order || 999) - (b.order || 999));"
            );
            fs.writeFileSync(p, content);
            console.log('Updated slug astro', p);
         }
      }
    }
  });
}

processDir('src/pages');
processDir('src/components');
processDir('src/layouts');
