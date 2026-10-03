const fs = require('fs');
const matter = require('gray-matter');

const periodMonths = {
  "月付": 1,
  "季付": 3,
  "半年付": 6,
  "年付": 12,
  "二年付": 24,
  "两年付": 24,
  "三年付": 36,
  "一次性": 0
};

function processBrand(file) {
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data;
  
  if (file.includes('sujie.md')) {
    let newPricing = [];
    data.pricing.forEach(p => {
      if (p.period) {
        newPricing.push(p);
      } else {
        const parts = p.price.split('|').map(s => s.trim());
        parts.forEach(part => {
          const match = part.match(/¥?([\d\.]+)\/(.*)/);
          if (match) {
            newPricing.push({
              name: p.name,
              traffic: p.traffic,
              period: match[2],
              price: "¥" + Number(match[1]).toFixed(2)
            });
          }
        });
      }
    });
    data.pricing = newPricing;
  }
  
  const trafficData = [];
  const periodPrices = {};
  const trafficSet = new Set();
  
  data.pricing.forEach(p => {
    let tVal = 0;
    const tStr = p.traffic.replace(/\/月|\/季|\/年/g, '').trim();
    if (tStr.toUpperCase().includes('GB')) {
      tVal = parseFloat(tStr);
    } else if (tStr.toUpperCase().includes('TB')) {
      tVal = parseFloat(tStr) * 1024;
    } else if (tStr.includes('G')) {
      tVal = parseFloat(tStr);
    }
    
    let label = p.name.replace(/FlyV 会员 - |星岛梦 · |速界机场 /g, '').trim();
    
    if (tVal > 0 && !trafficSet.has(p.name)) {
      trafficSet.add(p.name);
      trafficData.push({
        label: label,
        plan: p.name,
        value: tVal,
        display: tStr
      });
    }
    
    if (!periodPrices[p.name]) {
      periodPrices[p.name] = [];
    }
    
    let m = periodMonths[p.period] || 0;
    let priceNum = parseFloat(String(p.price).replace(/[¥,]/g, ''));
    if (!isNaN(priceNum)) {
      periodPrices[p.name].push({
        period: p.period,
        months: m,
        price: priceNum
      });
    }
  });
  
  trafficData.sort((a,b) => a.value - b.value);
  
  data.visualData = {
    traffic: trafficData,
    periodPrices: periodPrices
  };
  
  const output = matter.stringify(parsed.content || '', data);
  fs.writeFileSync(file, output, 'utf8');
  console.log('Processed ' + file);
}

processBrand('src/content/brands/sujie.md');
processBrand('src/content/brands/feiv.md');
processBrand('src/content/brands/kuaili.md');
