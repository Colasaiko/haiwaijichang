const fs = require('fs');

let c = fs.readFileSync('src/content/brands/kexin.md', 'utf8');

c = c.replace(
  '"官方声明不限制使用何种客户端"',
  '"不限制客户端数量；具体客户端兼容性以官方当前支持情况为准"'
);

// The previous script accidentally added the literal string "\\n"
c = c.replace(/\\n$/g, '');

fs.writeFileSync('src/content/brands/kexin.md', c);
