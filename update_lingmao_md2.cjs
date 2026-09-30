const fs = require('fs');

const path = 'src/content/brands/lingmao.md';
let content = fs.readFileSync(path, 'utf8');

// replace smallPlanPrice and bigPlanPrice with priceCharts
content = content.replace(/  smallPlanPrice:[\s\S]*?  couponEligibility:/,
`  priceCharts:
    - id: "small"
      title: "SMALL PLAN / 150GB 周期价格"
      label: "Small 周期"
      data:
        - label: "月付"
          plan: "灵猫·月付Small"
          period: "月付"
          original: 25
        - label: "季付"
          plan: "灵猫·季付Small"
          period: "季付"
          original: 65
        - label: "年付"
          plan: "灵猫·年付Small"
          period: "年付"
          original: 195
    - id: "big"
      title: "BIG PLAN / 300GB 周期价格"
      label: "Big 周期"
      data:
        - label: "月付"
          plan: "灵猫·月付Big"
          period: "月付"
          original: 45
        - label: "季付"
          plan: "灵猫·季付Big"
          period: "季付"
          original: 125
        - label: "年付"
          plan: "灵猫·年付Big"
          period: "年付"
          original: 295

  couponEligibility:`);

fs.writeFileSync(path, content);
console.log('Updated lingmao.md with priceCharts');
