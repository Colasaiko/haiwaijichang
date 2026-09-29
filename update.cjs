const fs = require('fs');

let indexContent = fs.readFileSync('src/pages/index.astro', 'utf8');

// Replace top matter
indexContent = indexContent.replace(
  `import { getCollection } from 'astro:content';`,
  `import { getCollection, getEntry } from 'astro:content';`
);
indexContent = indexContent.replace(
  `const blogs = (await getCollection('blog')).slice(0, 3);\n---`,
  `const blogs = (await getCollection('blog')).slice(0, 3);\n\nconst page = await getEntry('pages', 'home');\nconst { title, description, keywords, faqSchema, hero, seoSection, fastPick, featuredBrands, moreBrands, scenarios, blog } = page.data;\n---`
);

// Replace Layout
indexContent = indexContent.replace(
  /<Layout[^>]+>/s,
  `<Layout \n  title={title}\n  description={description}\n  keywords={keywords}\n>`
);

// Replace FAQ schema
indexContent = indexContent.replace(
  /"mainEntity": \[\s*\{[\s\S]*?\}\s*\]/s,
  `"mainEntity": faqSchema.map(faq => ({\n      "@type": "Question",\n      "name": faq.question,\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": faq.answer\n      }\n    }))`
);

// Replace Hero Section
indexContent = indexContent.replace(/OVERSEAS AIRPORT · GLOBAL NETWORK/g, `{hero.tagline}`);
indexContent = indexContent.replace(/海外机场<br \/>/g, `{hero.h1}<br />`);
indexContent = indexContent.replace(/连接你的下一站/g, `{hero.h1Span}`);
indexContent = indexContent.replace(/为海外网站、流媒体、AI 工具、远程办公与日常网络访问场景，提供更顺畅的全球网络连接体验。/g, `{hero.description}`);
indexContent = indexContent.replace(/立即登机/g, `{hero.primaryButton}`);
indexContent = indexContent.replace(/查看全球航线/g, `{hero.secondaryButton}`);

// Replace SEO Section
indexContent = indexContent.replace(
  /2026机场推荐与科学上网选择指南/g, 
  `{seoSection.title}`
);
indexContent = indexContent.replace(
  /在寻找 <strong>2026机场推荐<\/strong> 或 <strong>梯子推荐<\/strong> 时，我们往往会面临无数复杂的选择。不要盲目相信跑满带宽的测速截图，因为 <strong>稳定机场<\/strong> 的核心在于底层的 <strong>专线机场<\/strong> 架构（如 IPLC\/IEPL）以及应对晚高峰网络拥堵的路由优化策略。/g,
  `{seoSection.p1}`
);
indexContent = indexContent.replace(
  /对于预算有限的用户，高性价比的 <strong>便宜机场<\/strong> 同样可以满足轻度浏览需求；而如果你是重度使用者，支持 <strong>Clash机场<\/strong> 配置、提供原生 IP 的 <strong>流媒体机场<\/strong> 甚至是 <strong>ChatGPT机场<\/strong> 则显得尤为重要。你可以通过我们的 <a href="\/ranking" class="text-brand-neon hover:underline">机场天梯榜<\/a> 根据自身真实场景（而不是虚假的绝对分数）进行选择。/g,
  `{seoSection.p2}`
);

// Replace FAST PICK
indexContent = indexContent.replace(
  /FAST PICK/g, `{fastPick.tagline}`
);
indexContent = indexContent.replace(
  /不知道选哪个？按需求直接选。/g, `{fastPick.title}`
);
indexContent = indexContent.replace(
  /不用研究几十个参数，根据你的主要用途快速找到合适品牌。/g, `{fastPick.description}`
);

// Replace FEATURED DEPARTURES
indexContent = indexContent.replace(
  /FEATURED DEPARTURES/g, `{featuredBrands.tagline}`
);
indexContent = indexContent.replace(
  /精选品牌/g, `{featuredBrands.title}`
);

// Replace MORE BRANDS
indexContent = indexContent.replace(
  /MORE BRANDS/g, `{moreBrands.tagline}`
);
indexContent = indexContent.replace(
  /更多品牌/g, `{moreBrands.title}`
);
indexContent = indexContent.replace(
  /暂无完整匹配该标签的资料，请尝试其他分类。/g, `{moreBrands.noResults}`
);

// Replace SCENARIOS
indexContent = indexContent.replace(
  /SCENARIOS/g, `{scenarios.tagline}`
);
indexContent = indexContent.replace(
  /常用网络环境与场景支持/g, `{scenarios.title}`
);

indexContent = indexContent.replace(
  /<a href="\/use-cases"([^>]+)>\s*<h4([^>]+)>AI 工具与开发<\/h4>\s*<p([^>]+)>稳定解锁 ChatGPT, Claude, Midjourney，告别 IP 纯净度低导致的封号风控。<\/p>\s*<\/a>/s,
  `<a href={scenarios.cards[0].link} $1>\n          <h4 $2>{scenarios.cards[0].title}</h4>\n          <p $3>{scenarios.cards[0].desc}</p>\n        </a>`
);
indexContent = indexContent.replace(
  /<a href="\/use-cases"([^>]+)>\s*<h4([^>]+)>全球流媒体<\/h4>\s*<p([^>]+)>支持 Netflix, Disney\+, Hulu 原生 IP，享受 4K 高清且无需缓冲的观影体验。<\/p>\s*<\/a>/s,
  `<a href={scenarios.cards[1].link} $1>\n          <h4 $2>{scenarios.cards[1].title}</h4>\n          <p $3>{scenarios.cards[1].desc}</p>\n        </a>`
);
indexContent = indexContent.replace(
  /<a href="\/use-cases"([^>]+)>\s*<h4([^>]+)>跨平台设备<\/h4>\s*<p([^>]+)>兼容 Windows, macOS, iOS, Android, 甚至软路由设备，一键导入节点，全设备在线。<\/p>\s*<\/a>/s,
  `<a href={scenarios.cards[2].link} $1>\n          <h4 $2>{scenarios.cards[2].title}</h4>\n          <p $3>{scenarios.cards[2].desc}</p>\n        </a>`
);

// Replace BLOG
indexContent = indexContent.replace(
  /OFFICIAL BLOG/g, `{blog.tagline}`
);
indexContent = indexContent.replace(
  /最新深度评测与指南/g, `{blog.title}`
);
indexContent = indexContent.replace(
  /查看全部文章/g, `{blog.viewAll}`
);

fs.writeFileSync('src/pages/index.astro', indexContent, 'utf8');

let networkContent = fs.readFileSync('src/pages/network.astro', 'utf8');

// Replace top matter
networkContent = networkContent.replace(
  `import Layout from '../layouts/Layout.astro';`,
  `import Layout from '../layouts/Layout.astro';\nimport { getEntry } from 'astro:content';`
);
networkContent = networkContent.replace(
  `const featuredBrands = brands.slice(0, 5);\n---`,
  `const featuredBrands = brands.slice(0, 5);\n\nconst page = await getEntry('pages', 'network');\nconst { title, description, keywords, faqSchema, hero, routeBoard, featuredRoutes, howToChoose, coreTechnology, deviceCompatibility, networkStatus, faq } = page.data;\n---`
);

// Replace Layout
networkContent = networkContent.replace(
  /<Layout[^>]+>/s,
  `<Layout \n  title={title}\n  description={description}\n  keywords={keywords}\n>`
);

// Replace FAQ schema
networkContent = networkContent.replace(
  /"mainEntity": \[\s*\{[\s\S]*?\}\s*\]/s,
  `"mainEntity": faqSchema.map(f => ({\n      "@type": "Question",\n      "name": f.question,\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": f.answer\n      }\n    }))`
);

// Replace Hero Section
networkContent = networkContent.replace(/Global Network/g, `{hero.tagline}`);
networkContent = networkContent.replace(/全球网络，/g, `{hero.h1}`);
networkContent = networkContent.replace(/连接你的每一站/g, `{hero.h1Span}`);
networkContent = networkContent.replace(/打破地域限制，构建属于你的专属数字航线。从亚洲到北美，从欧洲到大洋洲，让每一次访问都畅通无阻。/g, `{hero.description}`);
networkContent = networkContent.replace(/选择你的目的地/g, `{hero.primaryButton}`);

// Replace Route Board
networkContent = networkContent.replace(/DEPARTURES INFO/g, `{routeBoard.tagline}`);
networkContent = networkContent.replace(/Network Route Board/g, `{routeBoard.title}`);

// Replace Featured Routes
networkContent = networkContent.replace(/精选主力航线/g, `{featuredRoutes.title}`);
networkContent = networkContent.replace(/覆盖全球主要核心骨干节点，为您提供优质、低延迟的国际连接体验。/g, `{featuredRoutes.description}`);
networkContent = networkContent.replace(/主要用途：/g, `{featuredRoutes.labels.mainUsage}`);
networkContent = networkContent.replace(/起步价格：/g, `{featuredRoutes.labels.startingPrice}`);
networkContent = networkContent.replace(/核心特性：/g, `{featuredRoutes.labels.coreFeatures}`);

// Replace How to Choose
networkContent = networkContent.replace(/How to Choose/g, `{howToChoose.tagline}`);
networkContent = networkContent.replace(/线路应该怎么选？/g, `{howToChoose.title}`);
networkContent = networkContent.replace(/不同用途不一定需要同一条线路。最好的方式是利用客户端的“规则分流”功能。/g, `{howToChoose.tip}`);

// Replace Core Technology
networkContent = networkContent.replace(/Core Technology/g, `{coreTechnology.tagline}`);
networkContent = networkContent.replace(/网络技术与指标解析/g, `{coreTechnology.title}`);
networkContent = networkContent.replace(/了解影响网络体验的关键因素。我们不断优化这些底层指标，以确保您的航班平稳运行。/g, `{coreTechnology.description}`);
networkContent = networkContent.replace(/查看详细技术白皮书 &rarr;/g, `{coreTechnology.viewMore}`);

// Replace Device Comp
networkContent = networkContent.replace(/全平台设备支持/g, `{deviceCompatibility.title}`);
networkContent = networkContent.replace(/查看各设备配置教程/g, `{deviceCompatibility.viewTutorial}`);

// Replace Status
networkContent = networkContent.replace(/Live Metrics/g, `{networkStatus.tagline}`);
networkContent = networkContent.replace(/Network Status/g, `{networkStatus.title}`);
networkContent = networkContent.replace(/SYSTEM STATUS/g, `{networkStatus.systemStatus}`);
networkContent = networkContent.replace(/ALL SYSTEMS OPERATIONAL/g, `{networkStatus.operational}`);

fs.writeFileSync('src/pages/network.astro', networkContent, 'utf8');

console.log('done');
