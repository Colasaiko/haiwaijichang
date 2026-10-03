const fs = require('fs');

let u = fs.readFileSync('src/content/brands/u1s1.md', 'utf8');

// Update couponEligible
u = u.replace(/-\s*name:\s*"u1s1 · 定制包"([\s\S]*?)couponEligible:\s*true/, '- name: "u1s1 · 定制包"$1couponEligible: false');

// Update visualData
u = u.replace(/- label: 定制\s*\n\s*plan: u1s1 · 定制包\s*\n\s*eligible: true/, '- label: 定制\n      plan: u1s1 · 定制包\n      eligible: false');

// Update text 1: "及“定制包”均可使用常驻与活动优惠码。" -> "均可使用常驻与活动优惠码；定制包不参与 U1S1 与 U1S1-80 优惠码，具体方案与价格以客服定制结果为准。"
// Wait, the actual text is: "除“就是好用包”外，其余含有月付入口的所有常规套餐（普通人真够了包、你以为用不到包、瘾大就拉满包、我全都要包）及“定制包”均可使用常驻与活动优惠码。"
u = u.replace('及“定制包”均可使用常驻与活动优惠码。', '均可使用常驻与活动优惠码；定制包不参与 U1S1 与 U1S1-80 优惠码，具体方案与价格以客服定制结果为准。');

// Update text 2: "并且定制套餐同样可以使用全场 8 折优惠码进行结算。"
u = u.replace('；并且定制套餐同样可以使用全场 8 折优惠码进行结算。', '；定制包不参与 U1S1 与 U1S1-80 优惠码，具体方案与价格以客服定制结果为准。');

// Update FAQ
u = u.replace('**定制包能用优惠码吗？**\n当前月付可使用。', '**定制包能用优惠码吗？**\n定制包不参与 U1S1 与 U1S1-80 优惠码，具体方案与价格以客服定制结果为准。');

// Remove from eligiblePlans explicitly
u = u.replace('    - "u1s1 · 定制包"\r\n', '');
u = u.replace('    - "u1s1 · 定制包"\n', '');
u = u.replace('    - u1s1 · 定制包\r\n', '');
u = u.replace('    - u1s1 · 定制包\n', '');

fs.writeFileSync('src/content/brands/u1s1.md', u);

// Update scripts/check-coupon-consistency.mjs
let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

checker = checker.replace('U1S1 TEMP COUPON ELIGIBLE: ${tCount}/25', 'U1S1 TEMP COUPON ELIGIBLE: ${tCount}/24');
checker = checker.replace('U1S1 TEMP COUPON EXCLUDED: ${tExc}/3', 'U1S1 TEMP COUPON EXCLUDED: ${tExc}/4');
checker = checker.replace('if (tCount !== 25 || tExc !== 3)', 'if (tCount !== 24 || tExc !== 4)');

checker = checker.replace('U1S1 STANDARD COUPON ELIGIBLE: ${sCount}/25', 'U1S1 STANDARD COUPON ELIGIBLE: ${sCount}/24');
checker = checker.replace('U1S1 STANDARD COUPON EXCLUDED: ${sExc}/3', 'U1S1 STANDARD COUPON EXCLUDED: ${sExc}/4');
checker = checker.replace('if (sCount !== 25 || sExc !== 3)', 'if (sCount !== 24 || sExc !== 4)');

// Update DISCOUNT CALCULATION
checker = checker.replace("checkUDisc('u1s1 · 定制包', '月付', uDateActive, 600, 480.00) &&", "getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 定制包' && x.period === '月付'), uDateActive) === null &&\n      getBestCouponForPricing(u1s1Brand, u1s1Brand.pricing.find(x => x.name === 'u1s1 · 定制包' && x.period === '月付'), uDateExpired) === null &&");

fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);
