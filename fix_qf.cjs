const fs = require('fs');

const path = 'src/components/charts/QuickFacts.astro';
let content = fs.readFileSync(path, 'utf8');

// I'll rewrite the frontmatter of QuickFacts
const newFrontmatter = `---
import { getActiveCoupon } from '../../utils/coupon.js';
const { brand } = Astro.props;

if (!brand) return null;

const activeCoupon = getActiveCoupon(brand);
const facts = [];

if (brand.lineType) facts.push({ label: '线路', value: Array.isArray(brand.lineType) ? brand.lineType.join(' / ') : brand.lineType });
if (brand.protocols) facts.push({ label: '协议', value: Array.isArray(brand.protocols) ? brand.protocols.join(' / ') : brand.protocols });
if (brand.speedLimit) facts.push({ label: '最高标称速率', value: brand.speedLimit });
if (brand.deviceLimit) facts.push({ label: '设备', value: brand.deviceLimit });
if (brand.ipType) facts.push({ label: 'IP', value: brand.ipType });
if (activeCoupon && activeCoupon.code) facts.push({ label: '优惠码', value: \`\${activeCoupon.code} · \${activeCoupon.discount}\` });
if (brand.nodeSnapshot && brand.nodeSnapshot.total) facts.push({ label: '当前节点快照', value: \`\${brand.nodeSnapshot.total} 个\`, sub: \`\${brand.nodeSnapshot.online} 在线 · \${brand.nodeSnapshot.offline} 离线\\n\${brand.nodeSnapshot.date} 官方后台快照\` });

if (facts.length === 0) return null;
---`;

content = content.replace(/---[\s\S]*?---/, newFrontmatter);
fs.writeFileSync(path, content);
console.log('Fixed QuickFacts');
