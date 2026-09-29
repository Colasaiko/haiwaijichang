const fs = require('fs');

const pages = [
  'about.astro', 'ai.astro', 'cheap-airport.astro', 'clash-airport.astro', 'dedicated-line.astro',
  'faq.astro', 'help.astro', 'index.astro', 'ladder-recommendation.astro', 'network.astro',
  'nodes.astro', 'privacy.astro', 'ranking.astro', 'stable-airport.astro', 'status.astro',
  'streaming.astro', 'technology.astro', 'terms.astro', 'use-cases.astro'
];

pages.forEach(p => {
  const path = 'src/pages/' + p;
  if (fs.existsSync(path)) {
    let c = fs.readFileSync(path, 'utf8');
    c = c.replace(/<Layout\s+title="[^"]+"\s+description="[^"]+"\s*(?:keywords="[^"]+"\s*)?>/s, '<Layout \n  title={title}\n  description={description}\n  keywords={keywords}\n>');
    fs.writeFileSync(path, c);
  }
});

console.log('Fixed SEO layouts.');
