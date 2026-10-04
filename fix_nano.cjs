const fs = require('fs');
const matter = require('gray-matter');

// 1. Modify nanocloud.md
const nanoFile = 'src/content/brands/nanocloud.md';
let raw = fs.readFileSync(nanoFile, 'utf8');
let parsed = matter(raw);

if (Array.isArray(parsed.data.aiSupport)) {
  parsed.data.aiSupport = parsed.data.aiSupport.filter(item => item === 'ChatGPT');
}

const output = matter.stringify(parsed.content, parsed.data);
fs.writeFileSync(nanoFile, output, 'utf8');
console.log('Modified nanocloud.md aiSupport.');

// 2. Patch checker
const checkScript = 'scripts/check-coupon-consistency.mjs';
let checkContent = fs.readFileSync(checkScript, 'utf8');

const nanoUniqueCheck = `
  const ncSeen = new Set();
  for (const p of ncBrand.pricing) {
    const key = p.name + '|' + p.period;
    if (ncSeen.has(key)) {
      console.error('ERROR: NANOCLOUD duplicate pricing entry: ' + key);
      ncErrors++; errors++;
    }
    ncSeen.add(key);
  }
`;

const phantomUniqueCheck = `
  const phSeen = new Set();
  for (const p of phBrand.pricing) {
    const key = p.name + '|' + p.period;
    if (phSeen.has(key)) {
      console.error('ERROR: PHANTOM duplicate pricing entry: ' + key);
      phErrors++; errors++;
    }
    phSeen.add(key);
  }
`;

// Insert after pricing length check for Nano
checkContent = checkContent.replace(
  /if \(ncBrand\.pricing\.length !== 8\) \{\s*console\.error[^}]+\}\s*\}\s*/,
  match => match + nanoUniqueCheck + '\n'
);

// Insert after pricing length check for Phantom
checkContent = checkContent.replace(
  /if \(phBrand\.pricing\.length !== 6\) \{\s*console\.error[^}]+\}\s*\}\s*/,
  match => match + phantomUniqueCheck + '\n'
);

fs.writeFileSync(checkScript, checkContent, 'utf8');
console.log('Patched check-coupon-consistency.mjs with uniqueness checks.');
