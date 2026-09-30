const fs = require('fs');

const path = 'src/content/brands/lingmao.md';
let content = fs.readFileSync(path, 'utf8');

const oldPricing = `pricing:
  - name: "灵猫·年付小包"
    traffic: "45GB/月"
    period: "年付"
    originalPrice: "¥85"
    couponEligible: false

  - name: "灵猫·年付Small"
    traffic: "150GB/月"
    period: "年付"
    originalPrice: "¥195"
    couponEligible: true

  - name: "灵猫·年付Big"
    traffic: "300GB/月"
    period: "年付"
    originalPrice: "¥295"
    couponEligible: true

  - name: "灵猫·季付Small"
    traffic: "150GB/月"
    period: "季付"
    originalPrice: "¥65"
    couponEligible: true

  - name: "灵猫·季付Big"
    traffic: "300GB/月"
    period: "季付"
    originalPrice: "¥125"
    couponEligible: true

  - name: "灵猫·月付Small"
    traffic: "150GB/月"
    period: "月付"
    originalPrice: "¥25"
    couponEligible: true

  - name: "灵猫·月付Big"
    traffic: "300GB/月"
    period: "月付"
    originalPrice: "¥45"
    couponEligible: true

  - name: "灵猫·不限时Small"
    traffic: "100GB总量"
    period: "一次性"
    originalPrice: "¥100"
    couponEligible: false

  - name: "灵猫·不限时Big"
    traffic: "500GB总量"
    period: "一次性"
    originalPrice: "¥350"
    couponEligible: false

  - name: "灵猫·大流量定制"
    traffic: "按需求定制"
    period: "月付"
    originalPrice: "¥999"
    couponEligible: false`;

const newPricing = `pricing:
  - name: "灵猫·年付小包"
    traffic: "45GB/月"
    period: "年付"
    originalPrice: "¥85"
    couponEligible: false
    badge: "轻量年付"
    desc: "轻量个人使用"

  - name: "灵猫·年付Small"
    traffic: "150GB/月"
    period: "年付"
    originalPrice: "¥195"
    couponEligible: true
    badge: "年付轻量"
    desc: "日常网页/视频"

  - name: "灵猫·年付Big"
    traffic: "300GB/月"
    period: "年付"
    originalPrice: "¥295"
    couponEligible: true
    badge: "年付大流量"
    desc: "多设备 / 视频"

  - name: "灵猫·季付Small"
    traffic: "150GB/月"
    period: "季付"
    originalPrice: "¥65"
    couponEligible: true
    desc: "日常网页/视频"

  - name: "灵猫·季付Big"
    traffic: "300GB/月"
    period: "季付"
    originalPrice: "¥125"
    couponEligible: true
    desc: "多设备 / 视频"

  - name: "灵猫·月付Small"
    traffic: "150GB/月"
    period: "月付"
    originalPrice: "¥25"
    couponEligible: true
    desc: "先月付体验"

  - name: "灵猫·月付Big"
    traffic: "300GB/月"
    period: "月付"
    originalPrice: "¥45"
    couponEligible: true
    desc: "多设备 / 视频"

  - name: "灵猫·不限时Small"
    traffic: "100GB总量"
    period: "一次性"
    originalPrice: "¥100"
    couponEligible: false
    desc: "备用 / 低频使用"

  - name: "灵猫·不限时Big"
    traffic: "500GB总量"
    period: "一次性"
    originalPrice: "¥350"
    couponEligible: false
    desc: "长期备用使用"

  - name: "灵猫·大流量定制"
    traffic: "按需求定制"
    period: "月付"
    originalPrice: "¥999"
    couponEligible: false
    desc: "具体需求需确认"`;

content = content.replace(oldPricing, newPricing);

fs.writeFileSync(path, content);
console.log('Updated lingmao pricing with desc and badge');
