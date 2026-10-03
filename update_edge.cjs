const fs = require('fs');
let c = fs.readFileSync('src/content/brands/edge.md', 'utf8');

c = c.replace(
  'scope: "常规套餐的半年及以上 / 限时年付 / 不限时100G"',
  'scope: "常规套餐半年及以上 / 限时年付 / 两个永久不限时包"'
);

c = c.replace(
  'description: "适用于常规套餐半年/年/2年/3年、限时年付以及永久不限时100G。体验月付小包不参与。"',
  'description: "适用于常规套餐半年/年/两年/三年、限时年付，以及永久不限时100G和450G。限时体验月付小包不参与。"'
);

c = c.replace(
`      - plans:
          - "永久不限时100G"
        periods:
          - "一次性"`,
`      - plans:
          - "永久不限时100G"
          - "永久不限时450G"
        periods:
          - "一次性"`
);

fs.writeFileSync('src/content/brands/edge.md', c);
