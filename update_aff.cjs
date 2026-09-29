const fs = require('fs');

const affData = {
  "飞猫云": "https://flycat1.flycatvipaff.cc/#/?code=UUcH5yh9",
  "星岛梦": "https://kfccbb.xingdaomeng.com/#/?code=1qBePxW1",
  "光速云": "https://mdlky.gsyaff.com/#/?code=GKfXFvJh",
  "唯兔云": "https://fast.v2yunvipaff.com/#/?code=bGS5G7xn",
  "U1S1": "https://pkdj7.vipaff.cc/#/?code=T1UVuVDP",
  "极连云": "https://kdjhao.jlyvipaff.com/#/?code=nrPTQT2i",
  "全球云": "https://sswdh.gcvipaff.com/#/?code=iZl9XAe2",
  "光年梯": "https://ggmq.gntaff.com/#/?code=k0rrn5UQ",
  "Sogo云": "https://wzjc.sogoyunaff.cc/#/?code=JvxcPy2A",
  "宇宙云": "https://wzjc.yuzoucloud.cc/#/?code=204ZUc9t",
  "二猫云": "https://waaa.2maoyunaff.cc/#/?code=c842udvC",
  "一翻云": "https://wzjc.1flyunaff.cc/#/?code=e61goYLt",
  "边缘节点": "https://work.edgenovaaff.cc/#/?code=etUBOp4S",
  "可信云": "https://work.kosingaff.com/#/?code=PY3isazT",
  "速界": "https://work.speedworldaff.cc/#/?code=q1enwrOd",
  "快狸": "https://work.kuailicloud.cc/#/?code=9RhZkrkV",
  "微风网络": "https://edp01.breezenetaff.com/#/?code=bSnymFll",
  "无忧": "https://wep01.worryfreeaff.com/#/?code=ydtFVWqU",
  "灵猫": "https://vip02.civetaff.com/#/?code=2Ai6V6Ub",
  "闪跃": "https://vip02.flashleapaff.com/#/?code=hCwClNUi",
  "萤火虫": "https://vip02.fireflyaff.com/#/?code=mcYQUZxG",
  "跨界": "https://vip02.kuajieaff.com/#/?code=HRzqSLrR",
  "暮光网络": "https://varnexa.twilightaff.com/#/?code=1eGqV85O",
  "飞V": "https://varnexa.flyvaff.com/#/?code=6ae5FH9i",
  "梯子云": "https://varnexa.ladderaff.com/#/?code=3vf6NG2u",
  "浪网": "https://varnexa.wavenetaff.com/#/?code=pcFhy7Lb",
  "WaveNet": "https://varnexa.wavenetaff.com/#/?code=pcFhy7Lb", // Alias
  "灵动云": "https://varnexa.lingdongaff.com/#/?code=TIMwZeIR",
  "隐形人": "https://varnexa.invisibleaff.com/#/?code=8jyAXfu3",
  "sogo云": "https://wzjc.sogoyunaff.cc/#/?code=JvxcPy2A", // Alias
  "速界机场": "https://work.speedworldaff.cc/#/?code=q1enwrOd", // Alias
  "无忧链接": "https://wep01.worryfreeaff.com/#/?code=ydtFVWqU", // Alias
  "跨界云": "https://vip02.kuajieaff.com/#/?code=HRzqSLrR", // Alias
  "暮光加速": "https://varnexa.twilightaff.com/#/?code=1eGqV85O", // Alias
};

let brands = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));

// Try to match and add aff links
brands.forEach(b => {
  const name = b.name.replace(/\\s*\\(.*?\\)/g, '').trim(); // Remove English in parens if any
  if (affData[name]) {
    b.aff = affData[name];
  } else {
    // try lowercase match
    const match = Object.keys(affData).find(k => k.toLowerCase() === name.toLowerCase() || b.name.toLowerCase().includes(k.toLowerCase()));
    if (match) {
      b.aff = affData[match];
    }
  }
});

// Check if there are any missing brands from user's list that aren't in brands.json
const existingNames = brands.map(b => b.name);
const missing = Object.keys(affData).filter(k => 
  !existingNames.some(n => n.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(n.toLowerCase()))
);

// If missing, we create minimal entries for them (e.g. 全球云, 宇宙云)
if (missing.includes("全球云")) {
  brands.push({
    name: "全球云",
    slug: "quanqiuyun",
    aff: affData["全球云"],
    discount: "暂无资料",
    features: ["优质加速网络", "稳定解锁"],
    pricing: []
  });
}
if (missing.includes("宇宙云")) {
  brands.push({
    name: "宇宙云",
    slug: "yuzhouyun",
    aff: affData["宇宙云"],
    discount: "暂无资料",
    features: ["优质加速网络", "稳定解锁"],
    pricing: []
  });
}

fs.writeFileSync('src/data/brands.json', JSON.stringify(brands, null, 2));
console.log('Updated brands with AFF links!');
