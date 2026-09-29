const fs = require('fs');

const topicPages = [
  'ai.astro', 'cheap-airport.astro', 'clash-airport.astro', 'dedicated-line.astro',
  'ladder-recommendation.astro', 'nodes.astro', 'ranking.astro', 'stable-airport.astro',
  'streaming.astro'
];

topicPages.forEach(p => {
  let content = fs.readFileSync('src/pages/' + p, 'utf8');
  content = content.replace(/import fs from 'fs';\nimport path from 'path';/, '');
  content = content.replace(/const brandsPath = path\.resolve\(process\.cwd\(\), 'src\/data\/brands\.json'\);\nconst brands = JSON\.parse\(fs\.readFileSync\(brandsPath, 'utf8'\)\);/, 
`import { getCollection } from 'astro:content';
const brandEntries = await getCollection('brands');
const brands = brandEntries.map(e => ({ id: e.id, ...e.data }));`);
  fs.writeFileSync('src/pages/' + p, content);
  console.log('Updated ' + p);
});
