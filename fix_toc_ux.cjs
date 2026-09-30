const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// Remove stopPropagation
c = c.replace(/onclick="event\.stopPropagation\(\);"/g, '');

// Update IntersectionObserver to open parent <details>
const oldScript = `            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.classList.add('text-brand-neon', 'border-brand-neon');
              a.classList.remove('text-slate-400', 'border-transparent');
            } else {`;
            
const newScript = `            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.classList.add('text-brand-neon', 'border-brand-neon');
              a.classList.remove('text-slate-400', 'border-transparent');
              const details = a.closest('details');
              if (details) details.open = true;
            } else {`;

c = c.replace(oldScript, newScript);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed TOC UX');
