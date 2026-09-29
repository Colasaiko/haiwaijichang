const fs = require('fs');
['src/pages/network.astro'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/const brandEntries = await getCollection\('brands'\);\nconst brands = brandEntries\.map\(e => \(\{ id: e\.id, \.\.\.e\.data \}\)\);\n/, '');
  c = c.replace('// Get top 5 brands', "const brandEntries = await getCollection('brands');\nconst brands = brandEntries.map(e => ({ id: e.id, ...e.data }));\n// Get top 5 brands");
  fs.writeFileSync(f, c);
});
