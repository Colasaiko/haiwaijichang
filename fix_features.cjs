const fs = require('fs');
const path = require('path');

const brands = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));

brands.forEach(b => {
  const mdPath = path.join('src/content/brands', b.slug + '.md');
  if (fs.existsSync(mdPath)) {
    let content = fs.readFileSync(mdPath, 'utf8');
    
    // Check if features already exists in yaml
    if (!content.includes('features:')) {
       const featuresArray = b.features ? b.features.map(f => `  - "${f}"`).join('\n') : '';
       if (featuresArray) {
          content = content.replace(/---/, `---\nfeatures:\n${featuresArray}`);
          fs.writeFileSync(mdPath, content);
       }
    }
  }
});
console.log('Fixed features in MD frontmatter');
