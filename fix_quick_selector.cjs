const fs = require('fs');

let c = fs.readFileSync('src/components/charts/QuickSelector.astro', 'utf8');

c = c.replace(/<div class="flex overflow-x-auto gap-4 pb-4 snap-x">/, '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">');
c = c.replace(/<div class="shrink-0 w-\[240px\] snap-center bg-brand-dark/g, '<div class="bg-brand-dark');

fs.writeFileSync('src/components/charts/QuickSelector.astro', c);
console.log('Fixed QuickSelector scroll');
