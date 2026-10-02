const cp = require('child_process');
const fs = require('fs');

try {
  if (fs.existsSync('inject_u1s1.cjs')) fs.unlinkSync('inject_u1s1.cjs');
  if (fs.existsSync('do_build.cjs')) fs.unlinkSync('do_build.cjs');
} catch (e) {}

cp.execSync('git add .', {stdio: 'inherit'});
cp.execSync('git commit -m "refactor: complete u1s1 brand page refactoring"', {stdio: 'inherit'});
cp.execSync('git push origin main', {stdio: 'inherit'});
