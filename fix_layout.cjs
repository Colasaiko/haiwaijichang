const fs = require('fs');

const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

// Fix 1: Left column flex-1
content = content.replace(
  '<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">\n        <div>',
  '<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">\n        <div class="flex-1 min-w-0">'
);

// Fix 2: Right column constrain width
content = content.replace(
  '<div class="shrink-0">',
  '<div class="shrink-0 w-full md:w-auto md:max-w-md lg:max-w-lg flex flex-col items-start md:items-end">'
);

// Fix 3: Allow coupon container to wrap
content = content.replace(
  'inline-flex flex-col sm:flex-row sm:items-center bg-brand-dark border',
  'inline-flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-end bg-brand-dark border'
);

// We need to also align text to the right on desktop, or we can just let it wrap gracefully.
// Make sure the CTA button is also consistent.
// I'll also add flex-wrap to the temp coupon container just in case.
content = content.replace(
  'flex flex-col sm:flex-row sm:items-center justify-center gap-3',
  'flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-center gap-3'
);

// Make sure the h1 wraps nicely, min-w-0 on flex-1 ensures it doesn't get pushed out.

fs.writeFileSync(path, content);
console.log('Fixed flex layout for hero section in slug.astro');
