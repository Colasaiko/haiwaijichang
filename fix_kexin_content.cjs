const fs = require('fs');

let c = fs.readFileSync('src/content/brands/kexin.md', 'utf8');

c = c.replace(
  '官方也没有针对任何第三方通用客户端（如 Clash、Shadowrocket、Sing-box 等）做严格限制，用户可以自由选用顺手的客户端进行订阅导入。',
  '不限制客户端数量；具体客户端兼容性以官方当前支持情况为准。'
);

const refundStr = '**支持退款吗？**';
const refundIndex = c.indexOf(refundStr);
if (refundIndex !== -1) {
  c = c.substring(0, refundIndex).trimEnd() + '\\n';
}

fs.writeFileSync('src/content/brands/kexin.md', c);
