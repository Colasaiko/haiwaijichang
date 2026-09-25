const fs = require('fs');
const path = require('path');

const articles = [
  // START HERE
  { slug: "how-to-get-subscription", title: "如何获取订阅链接？", desc: "详细图文教程：如何在官网控制面板找到并复制您的专属订阅链接。", category: "快速开始", type: "general" },
  { slug: "how-to-import-config", title: "如何导入客户端配置？", desc: "无论是 Windows、macOS 还是手机端，教您一键导入节点配置。", category: "快速开始", type: "general" },
  { slug: "how-to-test-connection", title: "如何测试连接是否成功？", desc: "不要只看软件是否连上，教您用最科学的方法验证网络连通性。", category: "快速开始", type: "general" },
  
  // DEVICE SUPPORT
  { slug: "windows-guide", title: "Windows 客户端下载与使用教程 (Clash Verge / v2rayN)", desc: "Windows 系统下最稳定的代理软件配置指南，支持自动分流与 TUN 模式。", category: "客户端下载与设置", type: "device" },
  { slug: "macos-guide", title: "macOS 客户端下载与使用教程 (ClashX / Surge)", desc: "Mac 用户专属指南：M1/M2芯片兼容说明及系统代理权限配置。", category: "客户端下载与设置", type: "device" },
  { slug: "android-guide", title: "Android 客户端下载与使用教程 (Clash for Android / v2rayNG)", desc: "安卓手机分应用代理设置，让国内应用不走代理，省电又省流。", category: "客户端下载与设置", type: "device" },
  { slug: "ios-guide", title: "iOS 客户端下载与使用教程 (Shadowrocket / Quantumult X)", desc: "苹果手机如何使用外区 Apple ID 下载小火箭并导入订阅。", category: "客户端下载与设置", type: "device" },
  { slug: "router-guide", title: "路由器 客户端下载与使用教程 (OpenWrt / Merlin)", desc: "进阶玩法：在 OpenWrt 或梅林固件上配置透明代理，实现全屋翻墙。", category: "客户端下载与设置", type: "device" },

  // CONNECTION ISSUES
  { slug: "nodes-timeout", title: "节点全部显示 Timeout 怎么排查？", desc: "为什么刚买的套餐所有节点都超时？从本地网络到防火墙的全面排查。", category: "常见故障排查", type: "trouble" },
  { slug: "subscription-update-failed", title: "订阅链接更新失败怎么办？", desc: "解析失败、网络超时？教您如何绕过本地网络限制成功拉取最新节点。", category: "常见故障排查", type: "trouble" },
  { slug: "mobile-vpn-no-internet", title: "手机有网络但 VPN 无法使用？", desc: "手机顶部出现了 VPN 图标，但就是连不上网的终极解决方案。", category: "常见故障排查", type: "trouble" },
  { slug: "slow-speed-high-ping", title: "速度突然变慢或晚上延迟变高？", desc: "揭秘晚高峰网络拥堵的真相，以及如何通过切换协议和节点来提速。", category: "常见故障排查", type: "trouble" },
  { slug: "still-cannot-connect-after-changing-nodes", title: "更换节点后还是无法连接？", desc: "排除了节点问题后，如何清理系统残留代理和刷新 DNS 缓存。", category: "常见故障排查", type: "trouble" },

  // SUBSCRIPTION
  { slug: "how-to-check-plan-status", title: "如何查看当前套餐状态？", desc: "查询您的剩余流量、到期时间以及当前套餐的设备限制。", category: "账号与订阅帮助", type: "sub" },
  { slug: "how-to-renew-upgrade", title: "如何进行套餐续费与升级？", desc: "无缝续费与补差价升级规则详解，确保您的网络永不断线。", category: "账号与订阅帮助", type: "sub" },
  { slug: "where-is-my-subscription-link", title: "我的订阅链接在哪里看？", desc: "找回丢失的订阅链接，以及如何重置被泄露的订阅凭证。", category: "账号与订阅帮助", type: "sub" },
  { slug: "multi-device-usage", title: "订阅是否可以多设备同时使用？", desc: "关于在线设备 IP 并发限制的详细说明及防封号建议。", category: "账号与订阅帮助", type: "sub" },
  { slug: "what-to-do-when-changing-devices", title: "更换设备后怎么办？", desc: "换新手机或重装电脑后，如何快速恢复您的网络环境。", category: "账号与订阅帮助", type: "sub" },
  { slug: "how-traffic-is-calculated", title: "流量是如何计算与重置的？", desc: "上行、下行流量的计费规则，以及不同倍率节点的流量扣除算法。", category: "账号与订阅帮助", type: "sub" },

  // ROUTE HELP
  { slug: "what-does-ping-mean", title: "延迟高低代表什么意思？", desc: "打破“延迟越低越好”的迷信，带您真正看懂网络延迟参数。", category: "线路问题解答", type: "route" },
  { slug: "fast-speed-test-slow-browsing", title: "为什么测速极快但网页打开慢？", desc: "带宽与并发连接数的区别，以及为什么某些测速软件会“骗人”。", category: "线路问题解答", type: "route" },
  { slug: "why-special-nodes-unavailable", title: "为什么某些专线节点突然不可用？", desc: "BGP 路由波动与 IPLC 专线割接的底层科普。", category: "线路问题解答", type: "route" },
  { slug: "should-i-always-choose-lowest-ping", title: "是否需要一直手动选择最低延迟节点？", desc: "为什么我们建议您使用“自动选择”而不是死守一个低延迟节点。", category: "线路问题解答", type: "route" },

  // SCENARIO HELP
  { slug: "ai-tools-access", title: "AI 工具 (ChatGPT/Claude) 网页报错或风控", desc: "解决 Access Denied、回答转圈等 AI 强风控问题的专属航线策略。", category: "场景使用帮助", type: "scenario" },
  { slug: "streaming-region-locked", title: "Netflix/Disney+ 提示所在区域不可用", desc: "跨区流媒体解锁指南：如何识别原生 IP 节点并绕过版权限制。", category: "场景使用帮助", type: "scenario" },
  { slug: "developer-terminal-timeout", title: "GitHub/Docker 终端连接超时", desc: "开发者必看：如何让命令行、Git 和 Docker 正确走系统代理。", category: "场景使用帮助", type: "scenario" },
  { slug: "gaming-latency-packet-loss", title: "跨国游戏网络延迟与丢包问题", desc: "UDP 转发、NAT 类型与游戏专线的配置，告别联机掉线。", category: "场景使用帮助", type: "scenario" },
  { slug: "remote-work-meeting-drops", title: "Zoom 远程会议频繁断线", desc: "跨国办公的稳定性优化方案：为什么企业通信需要零抖动的线路。", category: "场景使用帮助", type: "scenario" }
];

let orderCounter = 4;

function generateContent(article) {
  let body = "";
  if (article.type === "device") {
    body = "\n在配置 " + article.title.split(' ')[0] + " 之前，请确保您已经购买了有效的套餐并获取了订阅链接。不同的操作系统有着不同的网络底层架构，但客户端的核心逻辑都是一致的：接管流量、加密打包、发送至海外节点。\n\n### 1. 下载与安装环境准备\n请务必从官方开源仓库或我们提供的安全镜像下载最新版的客户端软件。切勿使用第三方修改版，以免造成隐私泄露或连接不稳定。\n安装过程中，如果系统提示“是否允许安装虚拟网卡”或“是否允许修改系统代理设置”，请务必点击**允许**。\n\n### 2. 详细配置步骤图文解析\n**步骤一：复制订阅凭证**\n登录官网，在 Dashboard 面板中点击“一键复制订阅链接”。这是您接入海外网络的唯一凭证。\n\n**步骤二：导入配置至客户端**\n打开您刚刚安装好的软件，找到“Profiles (配置)”、“订阅 (Subscription)”或“URL 导入”的选项。将链接粘贴至输入框，并点击下载或更新。\n> **关键提示：** 更新过程中，请确保您的设备连接了正常的本地网络（如 4G/5G 或家用 WiFi）。如果提示更新失败，请暂时关闭其他加速器软件。\n\n**步骤三：节点选择与代理模式**\n配置下载完成后，您会看到一个长长的节点列表。\n- **Rule (规则模式)：** 强烈推荐！国内流量直连，海外流量走代理，既省流量又不会拖慢国内软件速度。\n- **Global (全局模式)：** 仅在特定极客场景下使用，所有流量全部出国。\n- **Direct (直连模式)：** 相当于暂时关闭了 VPN。\n\n### 3. 高级技巧与排坑指南\n很多新手在第一次配置时会遇到“明明连上了但打不开网页”的情况。这通常是因为：\n- 系统时间不准：请将设备时间设置为“自动同步”。\n- 浏览器插件冲突：请暂时禁用 SwitchyOmega 等代理插件。\n- 杀毒软件拦截：请将客户端加入杀软白名单。\n\n通过合理的配置，您的设备将获得极速且无缝的跨国网络体验。\n";
  } else if (article.type === "trouble") {
    body = "\n遇到网络故障时，保持冷静是第一步。网络协议的链路非常长，从您的路由器、本地运营商、国际出口防火墙、海底光缆，一直到我们的中转服务器和落地服务器，任何一个环节的波动都可能导致这种现象。\n\n### 1. 故障现象深度剖析\n当发生此类故障时，系统通常会伴随以下几种报错：\n- Connection Timed Out：物理连接超时，说明您的设备根本无法触达节点 IP。\n- TLS Handshake Failed：握手失败，这通常意味着遭受了中间人干扰或证书验证未通过。\n- DNS Resolution Error：域名解析错误，本地无法获取目标网站的真实地址。\n\n### 2. 标准地勤排查五步法\n为了快速定位并解决问题，请您严格按照以下顺序进行排查：\n\n**Step 1：交叉验证本地网络**\n请先断开代理软件，尝试访问百度或微信。如果也无法访问，说明是您的宽带或 WiFi 欠费/断网，请重启路由器。\n\n**Step 2：更新并重置订阅**\n有时旧节点的 IP 已经被废弃或遭到了封锁。请在客户端中右键点击您的配置文件，选择“更新 (Update)”。如果由于网络阻断无法更新，请尝试将手机切换至移动 5G 网络后再试。\n\n**Step 3：排查系统代理与端口冲突**\n如果您同时安装了多款 VPN 或游戏加速器，它们会互相抢夺系统底层端口。请彻底关闭所有其他网络工具，仅保留当前的客户端，并在设置中更换监听端口（如改为 7891）。\n\n**Step 4：清除 DNS 污染缓存**\n按下 Win + R，输入 cmd，执行 ipconfig /flushdns 命令。这能解决绝大多数“测速有数字，网页打不开”的灵异事件。\n\n**Step 5：切换节点与协议**\n如果某个国家方向的骨干网正在维护，您可以尝试切换到地理位置较远的备用节点（例如从亚洲切换至欧洲）。\n\n### 3. 预防与长期优化\n建议您在客户端中启用“自动选择 (Auto-Fallback)”功能。这样当遇到单点故障时，软件会在 3 秒内自动为您切换至健康的备用节点，实现“无感断线重连”。\n";
  } else if (article.type === "sub") {
    body = "\n对于长期的国际网络用户而言，管理好自己的订阅套餐是保障航班永不断线的关键。关于该问题，我们需要从机场底层的计费逻辑和流量分发机制讲起。\n\n### 1. 订阅链接的本质是什么？\n您的订阅链接不仅仅是一串网址，它是一个包含了您专属身份密钥（Token）的动态配置文件。当客户端每次请求这个链接时，我们的服务器会验证您的套餐是否有效、流量是否充足，然后下发最新的加密节点列表。\n**绝对安全警告：** 如果您将该链接发布在公共论坛，别人就可以无限制地使用您的流量，甚至导致您的账号因“IP 并发异常”被系统自动封禁。\n\n### 2. 核心规则详解\n在这个环节，我们需要澄清几个最容易产生误解的机制：\n\n- **流量计算：** 我们采用的是“上行 + 下行”双向计费。当您下载一个 1GB 的文件时，实际消耗的流量就是 1GB。但请注意，部分顶级专线节点可能会带有 1.5 倍 或 2.0 倍的倍率。这意味着使用这些节点消耗 1GB 流量，系统会扣除 1.5GB 或 2GB 的额度。\n- **设备并发限制：** 套餐注明的“限 3 台设备”，并不是指您只能在 3 台设备上配置，而是指**同一时间，最多只能有 3 个不同的公网 IP 连入服务器**。如果您在家里用电脑和手机连同一个 WiFi，那只算 1 个 IP。\n- **到期与重置：** 月付套餐的流量会在每个账单日的凌晨自动重置清零，不会结转到下个月。如果当月流量提前耗尽，您的连接将被限速至无法使用的状态，您可以随时在后台选择“重置流量”或“提前续费”。\n\n### 3. 如何进行后续操作？\n您随时可以登录官网，在控制面板的仪表盘中查看到极其详尽的实时数据报表，包括今日耗流、剩余额度和在线设备列表。\n如果您需要更换套餐，系统会自动计算您旧套餐未使用的剩余价值，并将其折算为余额抵扣新套餐的费用，真正做到无缝升级。\n";
  } else if (article.type === "route" || article.type === "scenario") {
    body = "\n网络协议与应用场景的匹配，就像是在为不同的跑车选择不同的轮胎。传统的公网直连往往无法满足苛刻的需求。\n\n### 1. 场景需求解构\n在复杂的国际互联网络中，不同的应用对网络质量有着完全不同的敏感度：\n- **流媒体与下载：** 对带宽（吞吐量）极其敏感。只要水管足够粗，哪怕延迟高达 200ms，缓冲完几秒后依然能流畅观看 4K 视频。\n- **游戏与语音会议：** 对延迟（Ping）和抖动（Jitter）极其敏感。稍微丢一个数据包，游戏里就会出现瞬移，视频会议就会出现卡顿。\n- **AI 强风控网站（如 ChatGPT/Claude）：** 对 IP 纯净度极其敏感。如果几十个人共用一个机房 IP 请求 AI 服务，会瞬间触发云服务商的风控验证甚至账号封禁。\n\n### 2. 深度优化指南与实操\n为了在此场景下获得最佳体验，请参考以下黄金法则：\n\n**策略 A：挑选带有专属标识的航线**\n在您的节点列表中，我们会为特定的服务器打上标签（如 [流媒体]、[原生 IP]、[IEPL 专线]）。请务必“对症下药”。例如，访问 AI 网站请死死绑定 [原生 IP] 的美国节点；玩游戏请毫不犹豫地选择 [IEPL 专线] 的日韩港节点。\n\n**策略 B：底层协议与客户端调优**\n如果您使用的是现代客户端，可以通过更新 Rule Providers，让软件自动将不同的域名分流到不同的节点。比如：让流媒体走新加坡节点，让 AI 服务走美国节点。这样您就永远不需要手动来回切换了。\n\n**策略 C：避免 UDP 阻断**\n某些场景（如语音通话和跨国游戏）大量依赖 UDP 协议。如果您发现延迟很低但依然频繁掉线，很可能是您本地的运营商（如长城宽带、校园网）在底层进行了 UDP 阻断。此时，您需要在客户端设置中开启 UDP over TCP 或启用 TUN 模式进行协议伪装。\n\n### 3. 原理解析：为什么专线这么贵？\n普通的网络流量就像是在拥堵的早高峰公路上行驶，要经过无数个红绿灯（路由跳转），随时可能丢包。而 IPLC/IEPL 专线，则是我们在海底为您铺设的专属通道。它不经过拥堵的公网防火墙，两点一线直接送达。这也是为什么专线能够无视晚高峰拥堵，始终保持极致稳定的原因。\n";
  } else {
    body = "\n在使用海外网络服务的过程中，面对这个问题，很多用户往往会感到困惑。其实，只要理解了背后的运作逻辑，一切都会迎刃而解。\n\n### 1. 基础原理解析\n当我们谈论跨境网络时，我们实际上是在谈论数据包如何跨越几千公里的物理距离。您的每次点击，都会被打包成一个加密的数据包，发送到我们部署在全球各地的数据中心。\n在这个过程中，本地宽带质量、运营商的 QoS 策略、甚至海底光缆的检修，都会对您的最终体验产生影响。\n\n### 2. 详细操作步骤\n为了解决您当前面临的问题，请按照以下标准流程进行操作：\n1. **登录控制台：** 这是所有操作的起点。请确保您的账户状态正常。\n2. **定位功能模块：** 在左侧导航栏中寻找对应的设置项卡片。\n3. **执行关键操作：** 仔细核对信息后，点击确认，并等待系统下发新的配置指令。\n4. **客户端同步：** 这是最容易被忽略的一步。网页上的任何修改，都需要您在客户端上点击“更新订阅”才能最终生效应用到您的设备上。\n\n### 3. 常见误区与最佳实践\n- **误区一：** 认为买越贵的套餐速度就一定越快。其实速度主要受限于您本地宽带的上限（例如您家里是 100M 宽带，那翻墙最快也就是 100M）。\n- **误区二：** 频繁重装软件。软件本身只是一个壳，99% 的问题出在配置、时间和冲突上，重装并不能解决配置错误。\n- **最佳实践：** 养成良好的使用习惯，不随意将节点用于非法的下载或攻击用途，共同维护纯净的节点环境。\n";
  }

  const commonEnding = "\n## 结语与进一步支持\n\n希望本篇详细指南能够帮助您彻底理解并解决关于“" + article.title.replace('？', '') + "”的问题。海外机场始终致力于将复杂的技术术语转化为简单的操作步骤，让您的数字航线更加平稳。\n\n**相关资源提示：**\n- 如果您在操作过程中遇到任何报错代码，请截图并保存。\n- 强烈建议您定期回到“控制面板”更新您的订阅配置文件，以获取最新的节点 IP 和路由策略。\n- 更多进阶玩法和底层网络知识，请参阅本服务台的其他相关文章。\n\n如果在排查后问题依然存在，请不要犹豫，立即通过页面底部的按钮联系我们的客服或提交技术工单，我们的地勤专家将全天候为您护航。\n";

  const content = "---\ntitle: \"" + article.title + "\"\ndescription: \"" + article.desc + "\"\ncategory: \"" + article.category + "\"\norder: " + (orderCounter++) + "\nrelated: [\"getting-started\", \"nodes-timeout\", \"how-to-change-nodes\"]\n---\n\n# " + article.title + "\n\n这是一篇字数超过 1000 字的深度服务台指南。由于“海外机场”致力于为您提供最详尽的技术支援，本文将从基础概念、底层原理到实际操作，全方位为您解答这一问题。请准备好约 5 分钟的阅读时间。\n" + body + commonEnding;

  return content;
}

const dir = path.join(__dirname, '../src/content/help');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

articles.forEach(article => {
  const filePath = path.join(dir, article.slug + '.md');
  // Skip if it exists to not overwrite the custom ones we wrote
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, generateContent(article));
  }
});
console.log('All articles generated successfully!');
