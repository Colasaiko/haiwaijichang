const cp = require('child_process');
const fs = require('fs');

try {
  if (fs.existsSync('fix_md.cjs')) fs.unlinkSync('fix_md.cjs');
  if (fs.existsSync('fix_checker.cjs')) fs.unlinkSync('fix_checker.cjs');
} catch (e) {}

cp.execSync('npm run build', {stdio: 'inherit'});
cp.execSync('git add .', {stdio: 'inherit'});
cp.execSync('git commit -m "refactor: strict checker rules and clean markdown copy for weitu and guangsu"', {stdio: 'inherit'});
cp.execSync('git push origin main', {stdio: 'inherit'});

try {
  fs.unlinkSync('do_push.cjs');
} catch(e) {}
