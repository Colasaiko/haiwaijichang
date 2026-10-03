const fs = require('fs');

let c = fs.readFileSync('src/content/brands/jilian.md', 'utf8');

const replacement = `  periodPrices:
    "限时年付套餐体验":
      - period: 年付
        months: 12
        price: 96
    "极连云 · 基础套餐":
      - period: 月付
        months: 1
        price: 18
      - period: 季付
        months: 3
        price: 51.30
      - period: 半年付
        months: 6
        price: 97.20
      - period: 年付
        months: 12
        price: 183.60
      - period: 两年付
        months: 24
        price: 345.60
      - period: 三年付
        months: 36
        price: 486
    "极连云 · 进阶套餐":
      - period: 月付
        months: 1
        price: 32
      - period: 季付
        months: 3
        price: 102
      - period: 半年付
        months: 6
        price: 194
      - period: 年付
        months: 12
        price: 367
      - period: 两年付
        months: 24
        price: 691
      - period: 三年付
        months: 36
        price: 972
    "极连云 · 旗舰套餐":
      - period: 月付
        months: 1
        price: 61
      - period: 季付
        months: 3
        price: 183
      - period: 半年付
        months: 6
        price: 366
      - period: 年付
        months: 12
        price: 732
      - period: 两年付
        months: 24
        price: 1464
      - period: 三年付
        months: 36
        price: 2196
    "极连云 · 尊享套餐":
      - period: 月付
        months: 1
        price: 122
      - period: 季付
        months: 3
        price: 410.40
      - period: 半年付
        months: 6
        price: 777.60
      - period: 年付
        months: 12
        price: 1468.80
      - period: 两年付
        months: 24
        price: 2764.80
      - period: 三年付
        months: 36
        price: 3888
  unlimitedTraffic:`;

c = c.replace(/  periodPrices:[\s\S]*?  unlimitedTraffic:/, replacement);
fs.writeFileSync('src/content/brands/jilian.md', c);
