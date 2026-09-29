const fs = require('fs');
const path = require('path');

const brandsList = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));

brandsList.forEach((b, index) => {
  const mdPath = path.join('src/content/brands', b.slug + '.md');
  if (fs.existsSync(mdPath)) {
    let content = fs.readFileSync(mdPath, 'utf8');
    
    // Check if order already exists
    if (!content.includes('\norder:')) {
      content = content.replace(/---/, `---\norder: ${index + 1}`);
      fs.writeFileSync(mdPath, content);
    } else {
      // replace existing order
      content = content.replace(/\norder: [0-9]+/, `\norder: ${index + 1}`);
      fs.writeFileSync(mdPath, content);
    }
  }
});
console.log('Injected order into brand markdown files.');
