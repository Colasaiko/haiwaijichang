const fs = require('fs');

const file = 'src/components/charts/QuickFacts.astro';
let content = fs.readFileSync(file, 'utf8');

// Replace the facts logic to support nodeMultiplier and maxBandwidth
const oldFactsLogic = /if \(brand\.deviceLimit\) facts\.push\(\{ label: '设备', value: brand\.deviceLimit \}\);\nif \(brand\.ipType\) facts\.push\(\{ label: 'IP', value: brand\.ipType \}\);\nif \(activeCoupon && activeCoupon\.code\) facts\.push\(\{ label: '优惠码', value: \`\$\{activeCoupon\.code\} · \$\{activeCoupon\.discount\}\` \}\);/;

const newFactsLogic = `if (brand.deviceLimit) facts.push({ label: '设备', value: brand.deviceLimit });
if (brand.nodeMultiplier) facts.push({ label: '节点倍率', value: brand.nodeMultiplier });
if (brand.maxBandwidth) facts.push({ label: '最大带宽', value: brand.maxBandwidth });
if (brand.ipType) facts.push({ label: 'IP', value: brand.ipType });

if (brand.coupon && brand.coupon.code) {
  facts.push({ label: '常驻优惠', value: \`\${brand.coupon.code} · \${brand.coupon.discount}\` });
}

const now = Date.now();
let activeTemps = [];
if (brand.temporaryCoupons && Array.isArray(brand.temporaryCoupons)) {
  activeTemps = brand.temporaryCoupons.filter(c => {
    if (!c.startsAt || !c.expiresAt) return false;
    return now >= new Date(c.startsAt).getTime() && now <= new Date(c.expiresAt).getTime();
  });
}
if (activeTemps.length > 0) {
  activeTemps.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  facts.push({ label: '限时优惠', value: \`\${activeTemps[0].code} · \${activeTemps[0].discount}\`, isTemp: true });
} else if (brand.temporaryCoupons && brand.temporaryCoupons.length > 0) {
  // If has temporary coupons but expired
  facts.push({ label: '限时优惠', value: '- · -', isTemp: true });
}
`;

content = content.replace(oldFactsLogic, newFactsLogic);

// Replace template condition if fact.label === "优惠码"
content = content.replace(/\{fact\.label === "优惠码" && activeCoupon\?\.type === "temporary" && <span class="ml-2 text-\[8px\] bg-brand-neon\/20 text-brand-neon px-1 rounded">限时<\/span>\}/, 
`{fact.isTemp && <span class="ml-2 text-[8px] bg-brand-neon/20 text-brand-neon px-1 rounded">限时</span>}`);

fs.writeFileSync(file, content);
console.log('Updated QuickFacts.astro');
