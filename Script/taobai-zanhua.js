/**
 * 🌸 桃白簪花 · 执子之手 —— mihomo 配置覆写脚本
 *
 *   「以中国桃花与白桃为印，收存山河、人物与相守心事。」
 *
 * 原作者：AIsouler（https://github.com/AIsouler/MyClash）
 * 原脚本：https://raw.githubusercontent.com/AIsouler/MyClash/main/Script/mihomoScript.js
 * 本版：基于原脚本微改 + 「桃白簪花」意象重塑
 *   · 全部策略组按「卷首 / 行止 / 山河 / 分卷」四层次重命名，匹配逻辑与规则引用与原版一致
 *   · 面向「超稳定、超低延迟访问各个 APP」的四项增强：
 *     1) sniffer 域名嗅探：QUIC 被拦截自动回落 TCP，视频/语音不断流
 *     2) global-client-fingerprint=chrome：统一 TLS 指纹，降低 CDN 风控拦截概率
 *     3) keep-alive-interval 30s + tcp-keep-alive-idle 30s：空闲保活，减少重连与延迟抖动
 *     4) 自动组「🌸 寻花」以 50ms 容差 url-test 实时测速，始终走花瓣最轻的落处
 *   · 2026-09「🌬️ 御风栈」：对 mihomo 自研 mips 栈（纯 Go 用户态 IP 栈，字节级 DRR 调度）的深度优化组合
 *     御风之本：stack=mips 开关化，老内核可一键回退 mixed
 *     一式·整运：MTU 9000 + GSO 64K 大件整运，摊薄用户态栈每包开销（GSO 仅 Linux 系生效）—— 原创
 *     二式·让路：私网/链路本地/组播不进 TUN 栈，ICMP 本地即答 —— 路由绕行为原创，ICMP 参考 echs-top/proxy
 *     三式·纳新：全锥 NAT（EIM）按开关启用，游戏/语音 P2P 穿透更顺 —— 参考 echs-top/proxy 并开关化
 *       （另有常备 UDP 会话保鲜 udp-timeout=600，默认 300s 易断流，同参考 echs-top/proxy）
 *     净泉·真假分明：fake-ip 规则化——直连域名取真水（real-ip 真实解析、CDN 就近），余者皆镜花（fake-ip 秒回）
 *       —— 思路参考 echs-top/proxy，规则集映射与订阅条目自动转换为原创
 *     断流闸：国外 QUIC 做成看得见的策略组「🌬️ 御风 | 断流」（REJECT 拦截 / PASS-RULE 放行 / 🏠 归檐直连三档），
 *       「屏蔽国外QUIC」开关只定初始默认档；sniffer 补 QUIC 端口嗅探，放行档也能按域名分流
 *
 * ── 命名体系 ──
 *
 * 【卷首 · 桃印起卷】总入口与选路
 *   🍑 桃印 | 总卷      万流归卷，一切由此起笔
 *   🖐️ 拾印 | 手动      按心而择，一枚印鉴亲手盖下
 *   🌸 寻花 | 自动      循花瓣最轻的落处，自动择路
 *   🍃 分花 | 均衡      分花同承，负荷不偏倚
 *
 * 【卷二 · 行止】三条去路 + 一道闸
 *   🏠 归檐 | 直连      乡音不远行，家门之内直去直回
 *   🚫 掩扉 | 拦截      帘外不迎，广告与骚扰止于门前
 *   🌙 拾遗 | 兜底      漏尽处皆有所归，未有遗落
 *   🌬️ 御风 | 断流      QUIC 急流一道闸，或截或放一目了然（御风栈唯一可见组，紧跟总卷）
 *
 * 【卷三 · 山河】五灵守卷，各镇一方
 *   🏮 灯 | 香江　📜 卷 | 宝岛　🖌️ 砚 | 东瀛
 *   ☁️ 羽 | 花旗　🧣 绫 | 狮城　🗺️ 濠镜
 *   ⚖️ 轻羽·低倍　🔥 重岳·高倍　🪶 散修·散点
 *   🌉 合道·中转 / 落地　🪶 本命·自建
 *
 * 【卷四 · 分卷】十余项服务各归其卷
 *   💬 灵鸽·传讯　🎬 映画·油管　🗺️ 星图·谷歌　🤖 天工·灵智
 *   🪟 云笈·微软　🍎 玉果·苹果　✈️ 飞书·电报　🎮 雾阁·蒸汽
 *   🎵 幻音·短影　🕊️ 栖鸾·推特　📘 墨册·脸书　💚 青笺·连线　🎞️ 映雪·奈飞
 *   📚 藏经阁·影库　🎒 行囊·网盘　🎧 韶音·声乐　🪙 通宝·加密
 *   🔖 秘阁·E站　🚫 掩扉 | 拦截
 *
 * 命名对照（上游原名 → 桃白簪花）：
 *   默认代理→🍑 桃印 | 总卷　手动选择→🖐️ 拾印 | 手动　自动选择→🌸 寻花 | 自动
 *   负载均衡→🍃 分花 | 均衡　直连→🏠 归檐 | 直连　漏网之鱼→🌙 拾遗 | 兜底
 *   GLOBAL→保持不变（兼容面板全局模式）
 *   中国香港→🏮 灯 | 香江　中国澳门→🗺️ 濠镜　日本→🖌️ 砚 | 东瀛
 *   美国→☁️ 羽 | 花旗　新加坡→🧣 绫 | 狮城　中国台湾→📜 卷 | 宝岛
 *   低倍率节点→⚖️ 轻羽·低倍　高倍率节点→🔥 重岳·高倍　其他节点→🪶 散修·散点
 *   自建节点→🪶 本命·自建　链式中转→🌉 合道·中转　链式落地→🌉 合道·落地
 *   FCM→💬 灵鸽·传讯　YouTube→🎬 映画·油管　Google→🗺️ 星图·谷歌　AI→🤖 天工·灵智
 *   Microsoft→🪟 云笈·微软　Apple→🍎 玉果·苹果　Telegram→✈️ 飞书·电报　Steam→🎮 雾阁·蒸汽
 *   TikTok→🎵 幻音·短影　Twitter→🕊️ 栖鸾·推特　Meta→📘 墨册·脸书　Line→💚 青笺·连线　Netflix→🎞️ 映雪·奈飞
 *   Emby→📚 藏经阁·影库　PikPak→🎒 行囊·网盘　Spotify→🎧 韶音·声乐　Crypto→🪙 通宝·加密
 *   EHentai→🔖 秘阁·E站　AdBlock→🚫 掩扉 | 拦截
 *
 * 图标约定：意象 emoji + 空格 + 名称，简约不喧哗；不与订阅节点自带的旗帜冲突。
 * 友情推荐，非常好用、省电且内存占用低的代理软件：https://github.com/appshubcc/Bettbox
 */

// --- 静态配置区域 ---

// 适配 Bettbox 自定义配置参数
const Compatible_With_Bettbox = { ruleOptionsEnable: true };

/**
 * 自定义配置选项
 * true = 启用
 * false = 禁用
 */
const ruleOptionsEnable = {
  // 基础策略组
  '🖐️ 拾印 | 手动': true, // 是否启用🖐️ 拾印 | 手动策略组（原：手动选择）
  '🌸 寻花 | 自动': true, // 是否启用🌸 寻花 | 自动策略组（原：自动选择）
  '🍃 分花 | 均衡': true, // 是否启用🍃 分花 | 均衡策略组（原：负载均衡）

  // 以下为分流策略配置
  '💬 灵鸽·传讯': true, // Google FCM 推送（💬 灵鸽·传讯）
  '🎬 映画·油管': true, // YouTube 视频（🎬 映画·油管）
  '🗺️ 星图·谷歌': true, // Google 服务（🗺️ 星图·谷歌）
  '🤖 天工·灵智': true, // 国外 AI 服务（🤖 天工·灵智）
  '🪟 云笈·微软': true, // Microsoft 服务（🪟 云笈·微软）
  '🍎 玉果·苹果': true, // Apple 服务（🍎 玉果·苹果）
  '✈️ 飞书·电报': true, // Telegram 通讯（✈️ 飞书·电报）
  '🎮 雾阁·蒸汽': true, // Steam 游戏（🎮 雾阁·蒸汽）
  '🎵 幻音·短影': true, // TikTok 短视频（🎵 幻音·短影）
  '🕊️ 栖鸾·推特': true, // Twitter 社交（🕊️ 栖鸾·推特）
  '📘 墨册·脸书': true, // Meta 服务（📘 墨册·脸书）
  '💚 青笺·连线': true, // Line 通讯（💚 青笺·连线）
  '🎞️ 映雪·奈飞': true, // Netflix 影视（🎞️ 映雪·奈飞）
  '📚 藏经阁·影库': true, // Emby 媒体库（📚 藏经阁·影库）
  '🎒 行囊·网盘': true, // PikPak 网盘（🎒 行囊·网盘）
  '🎧 韶音·声乐': true, // Spotify 音乐（🎧 韶音·声乐）
  '🪙 通宝·加密': true, // 加密货币（🪙 通宝·加密）
  '🔖 秘阁·E站': true, // E-Hentai（🔖 秘阁·E站）
  '🚫 掩扉 | 拦截': true, // 广告拦截（🚫 掩扉 | 拦截）

  // 以下为非分流策略配置
  极简模式: false, // 是否启用极简模式（同步自上游：不生成地区组/倍率组/分流组，仅保留「🍑 桃印 | 总卷」出口，兜底 MATCH 走总卷）
  生成地区自动选择组: true, // 是否生成地区自动选择策略组
  隐藏地区手动选择组: false, // 是否隐藏地区手动选择策略组
  生成倍率组: true, // 是否生成低倍率/高倍率策略组
  分流组添加所有节点: false, // 是否为分流策略组添加所有节点
  过滤低倍率节点: false, // 是否过滤低倍率节点
  过滤高倍率节点: false, // 是否过滤高倍率节点
  过滤非地区节点: true, // 是否过滤非地区节点
  屏蔽国外QUIC: true, // 国外 QUIC 断流闸「🌬️ 御风 | 断流」的初始默认档：true=REJECT 拦截（配合嗅探回落 TCP），false=PASS-RULE 放行；面板里可随时切档
  代理IPV4优先: false, // 是否将订阅节点统一为 IPv4 优先（与“代理IPV6优先”同时开启时不生效）
  代理IPV6优先: false, // 是否将订阅节点统一为 IPv6 优先（与“代理IPV4优先”同时开启时不生效）
  链式代理: false, // 是否启用链式代理（自定义节点作为落地节点，经「🌉 合道·中转」策略组中转）

  // 以下为 TUN「🌬️ 御风栈」mips 深度优化（2026-09 原创组合；udp-timeout/EIM/ICMP/fake-ip 规则化四式参考 echs-top/proxy）
  御风栈启用mips: true, // 御风之本：TUN 用 mihomo 自研 mips 栈；需较新内核（约 v1.19.31+），老内核 TUN 起不来时关闭回退 mixed
  御风栈整运: true, // 一式·整运：MTU 9000 + GSO 64K，大件整运摊薄每包开销（GSO 仅 Linux 系内核生效，Windows 自动忽略；如遇异常可关）
  御风栈让路: true, // 二式·让路：私网/链路本地/组播不进 TUN 栈（局域网互访更快、栈更轻），ICMP 本地即答
  御风栈纳新: false, // 三式·纳新：UDP 全锥 NAT（EIM），游戏/语音 P2P 穿透更顺；官方注明性能略降，非必要不启
  净泉真假分明: true, // 净泉：fake-ip 规则化——直连域名取真水（real-ip），代理域名皆镜花（fake-ip）；如遇老内核不识别可关
};

// 定义前置规则
const prefixRules = [
  // 私有网络 → 归檐直连
  'RULE-SET,private,🏠 归檐 | 直连',

  // 国内 → 归檐直连
  'RULE-SET,geolocation-cn,🏠 归檐 | 直连',
  'RULE-SET,games_cn,🏠 归檐 | 直连', // 已包含 steam 下载域名
  'RULE-SET,epicgames,🏠 归檐 | 直连',
  'RULE-SET,nvidia_cn,🏠 归檐 | 直连',
  'RULE-SET,apple_cn,🏠 归檐 | 直连',
  'RULE-SET,microsoft_cn,🏠 归檐 | 直连',
  'DOMAIN,fsend.cn,🏠 归檐 | 直连',
  'DOMAIN,international-gfe.download.nvidia.com,🏠 归檐 | 直连',
];

// 此处添加自定义节点，填入下方[]内（可选，留空则不生成「🪶 本命·自建」策略组）
// 自定义节点不参与节点过滤与 hosts 改写；与订阅节点（标准化后）重名时自动添加「🪶 本命-」前缀
// 示例：
// const customizeProxies = [
//   {
//     name: '自建-日本-01',
//     type: 'vmess',
//     server: '5.6.7.8',
//     port: 443,
//     uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
//     alterId: 0,
//     cipher: 'auto',
//     tls: true,
//     servername: 'example.com',
//     network: 'ws',
//     'ws-opts': {
//       path: '/path',
//       headers: { Host: 'example.com' },
//     },
//   },
// ];
const customizeProxies = [];

// 链式代理启用时，自定义节点的 dialer-proxy 引用目标
const dialerProxyName = '🌉 合道·中转';

// 定义全局排除节点的正则表达式，用于排除非地区节点
const excludeFilter =
  /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|电报|无法|说明|使用|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\.me\/\+|\bexpire\b|\bhttps?:\/\/|\.com|\btraffic\b/iu;

// 国外 QUIC 断流闸：目标指向可见策略组「🌬️ 御风 | 断流」（御风栈中唯一路由可控的件，面板可实时切档）
const foreignQuicGateRules = [
  'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,cn_additional),(RULE-SET,cn_ip,no-resolve)))))),🌬️ 御风 | 断流',
];

// 归檐·直连节点
const directProxies = [
  {
    name: '🇨🇳 归檐 | 双栈',
    type: 'direct',
  },
  {
    name: '🇨🇳 归檐 | IPv4优先',
    type: 'direct',
    'ip-version': 'ipv4-prefer',
  },
  {
    name: '🇨🇳 归檐 | IPv6优先',
    type: 'direct',
    'ip-version': 'ipv6-prefer',
  },
  {
    name: '🇨🇳 归檐 | 仅IPv4',
    type: 'direct',
    'ip-version': 'ipv4',
  },
  {
    name: '🇨🇳 归檐 | 仅IPv6',
    type: 'direct',
    'ip-version': 'ipv6',
  },
];

// 定义地区策略组（五灵守卷：灯·香江 / 卷·宝岛 / 砚·东瀛 / 羽·花旗 / 绫·狮城 / 濠镜）
const regionDefinitions = [
  {
    name: '🏮 灯 | 香江',
    flag: '🇭🇰',
    regex: /🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\s*kong/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/HongKong.svg',
  },
  {
    name: '🗺️ 濠镜',
    flag: '🇲🇴',
    regex: /🇲🇴|澳门|濠江|濠镜|(?<![A-Za-z])MACAU(?![A-Za-z])|(?<![A-Za-z])MO(?![A-Za-z])/i,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Macao.png',
  },
  {
    name: '🖌️ 砚 | 东瀛',
    flag: '🇯🇵',
    regex: /🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Japan.svg',
  },
  {
    name: '☁️ 羽 | 花旗',
    flag: '🇺🇸',
    regex:
      /🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|圣地亚哥|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\s*states/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/America.svg',
  },
  {
    name: '🧣 绫 | 狮城',
    flag: '🇸🇬',
    regex: /🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Singapore.svg',
  },
  {
    name: '📜 卷 | 宝岛',
    flag: '🇨🇳',
    regex: /🇨🇳|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/China.svg',
  },
];

// 定义倍率策略组
const lowRateRegionName = '⚖️ 轻羽·低倍';
const highRateRegionName = '🔥 重岳·高倍';

const rateRegionDefinitions = [
  {
    name: lowRateRegionName,
    regex:
      /^(?!.*(?:剩|期)).*(?:(?<!\d)0\.[0-5]|(?<=[ \[\(|｜丨∣┃\-‐–—−－﹣])0[*×✕✖⨯⨉x倍])|(?:(?<=[ \[\(|｜丨∣┃\-‐–—−－﹣])[*×✕✖⨯⨉x]0(?=[ \)\]]|倍|$))|^(?!.*(?:客户端|软件)).*下载|低倍|免费|(?<![A-Za-z])free(?![A-Za-z])/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Available.svg',
  },
  {
    name: highRateRegionName,
    regex:
      /(?<=[ \[\(|｜丨∣┃\-‐–—−－﹣])((?:[*×✕✖⨯⨉x]\s*(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?\s*(?:倍|[*×✕✖⨯⨉x])))/i,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Airport.svg',
  },
];

// 全部策略组定义（地区 + 倍率），统一用于节点匹配与归类
const allRegionDefinitions = [...regionDefinitions, ...rateRegionDefinitions];

// Rule Providers 通用配置
const ruleProviderCommonDomain = {
  type: 'http',
  format: 'mrs',
  interval: 86400,
  behavior: 'domain',
};
const ruleProviderCommonIpcidr = {
  type: 'http',
  format: 'mrs',
  interval: 86400,
  behavior: 'ipcidr',
};

// 定义基础 Rule Providers
const baseRuleProviders = {
  // --- 直连规则集 ---

  private: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/private.mrs',
    path: './ruleset/private.mrs',
    'path-in-bundle': 'geo/geosite/private.mrs',
  },
  private_ip: {
    ...ruleProviderCommonIpcidr,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/private.mrs',
    path: './ruleset/private_ip.mrs',
    'path-in-bundle': 'geo/geoip/private.mrs',
  },
  games_cn: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/category-games@cn.mrs',
    path: './ruleset/category-games@cn.mrs',
    'path-in-bundle': 'geo/geosite/category-games@cn.mrs',
  },
  epicgames: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/epicgames.mrs',
    path: './ruleset/epicgames.mrs',
    'path-in-bundle': 'geo/geosite/epicgames.mrs',
  },
  nvidia_cn: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/nvidia@cn.mrs',
    path: './ruleset/nvidia@cn.mrs',
    'path-in-bundle': 'geo/geosite/nvidia@cn.mrs',
  },
  apple_cn: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/apple@cn.mrs',
    path: './ruleset/apple@cn.mrs',
    'path-in-bundle': 'geo/geosite/apple@cn.mrs',
  },
  microsoft_cn: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/microsoft@cn.mrs',
    path: './ruleset/microsoft@cn.mrs',
    'path-in-bundle': 'geo/geosite/microsoft@cn.mrs',
  },
  'geolocation-cn': {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/geolocation-cn.mrs',
    path: './ruleset/geolocation-cn.mrs',
    'path-in-bundle': 'geo/geosite/geolocation-cn.mrs',
  },
  cn_ip: {
    ...ruleProviderCommonIpcidr,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/cn.mrs',
    path: './ruleset/cn_ip.mrs',
    'path-in-bundle': 'geo/geoip/cn.mrs',
  },

  // --- 代理规则集 ---

  'geolocation-!cn': {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/geolocation-!cn.mrs',
    path: './ruleset/geolocation-!cn.mrs',
    'path-in-bundle': 'geo/geosite/geolocation-!cn.mrs',
  },

  // --- 其他规则集 ---

  fakeip_filter: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/fakeip-filter.mrs',
    path: './ruleset/fakeip-filter.mrs',
    'path-in-bundle': 'geo/geosite/fakeip-filter.mrs',
  },
  cn_additional: {
    ...ruleProviderCommonDomain,
    url: 'https://static-file-global.353355.xyz/rules/cn-additional-list.mrs',
    path: './ruleset/cn-additional-list.mrs',
    'path-in-bundle': 'geo/geosite/cn.mrs',
  },
  cn: {
    ...ruleProviderCommonDomain,
    url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/cn.mrs',
    path: './ruleset/cn.mrs',
    'path-in-bundle': 'geo/geosite/cn.mrs',
  },
};

// 策略组公共配置
const groupBaseOption = {
  interval: 600,
  timeout: 3000,
  url: 'https://www.apple.com/library/test/success.html',
  lazy: true,
  'max-failed-times': 3,
  'empty-fallback': 'REJECT',
};

// select策略组通用配置
const selectBaseOption = {
  ...groupBaseOption,
  type: 'select',
};

// url-test策略组通用配置
const urlTestBaseOption = {
  ...groupBaseOption,
  type: 'url-test',
  tolerance: 50,
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Auto.svg',
  hidden: true,
};

// load-balance策略组通用配置
const loadBalanceBaseOption = {
  ...groupBaseOption,
  type: 'load-balance',
  strategy: 'sticky-sessions',
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/RoundRobin.svg',
  hidden: true,
};

// 定义基础策略组
const baseGroups = [
  {
    name: '🖐️ 拾印 | 手动',
    baseOption: selectBaseOption,
    includeAll: true,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Static.svg',
  },
  {
    name: '🌸 寻花 | 自动',
    baseOption: urlTestBaseOption,
    includeAll: true,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Auto.svg',
  },
  {
    name: '🍃 分花 | 均衡',
    baseOption: loadBalanceBaseOption,
    includeAll: true,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/RoundRobin.svg',
  },
];

// 定义分流策略组配置
const serviceConfigs = [
  ...baseGroups,
  {
    name: '💬 灵鸽·传讯',
    baseOption: selectBaseOption,
    direct: true,
    defaultSelected: '🏠 归檐 | 直连',
    providers: {
      googlefcm: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/googlefcm.mrs',
        path: './ruleset/googlefcm.mrs',
        'path-in-bundle': 'geo/geosite/googlefcm.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Fcm.svg',
    rules: ['RULE-SET,googlefcm,💬 灵鸽·传讯'],
  },
  {
    name: '🎬 映画·油管',
    baseOption: selectBaseOption,
    providers: {
      youtube: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/youtube.mrs',
        path: './ruleset/youtube.mrs',
        'path-in-bundle': 'geo/geosite/youtube.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/YouTube.svg',
    rules: ['RULE-SET,youtube,🎬 映画·油管'],
  },
  {
    name: '🗺️ 星图·谷歌',
    baseOption: selectBaseOption,
    providers: {
      google: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/google.mrs',
        path: './ruleset/google.mrs',
        'path-in-bundle': 'geo/geosite/google.mrs',
      },
      google_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/google.mrs',
        path: './ruleset/google_ip.mrs',
        'path-in-bundle': 'geo/geoip/google.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Google.svg',
    rules: ['RULE-SET,google,🗺️ 星图·谷歌', 'RULE-SET,google_ip,🗺️ 星图·谷歌,no-resolve'],
  },
  {
    name: '🤖 天工·灵智',
    baseOption: selectBaseOption,
    defaultSelected: '☁️ 羽 | 花旗',
    providers: {
      ai: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/category-ai-!cn.mrs',
        path: './ruleset/ai.mrs',
        'path-in-bundle': 'geo/geosite/category-ai-!cn.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/ChatGPT.svg',
    rules: ['RULE-SET,ai,🤖 天工·灵智'],
  },
  {
    name: '🪟 云笈·微软',
    baseOption: selectBaseOption,
    direct: true,
    providers: {
      github: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/github.mrs',
        path: './ruleset/github.mrs',
        'path-in-bundle': 'geo/geosite/github.mrs',
      },
      microsoft: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/microsoft.mrs',
        path: './ruleset/microsoft.mrs',
        'path-in-bundle': 'geo/geosite/microsoft.mrs',
      },
      microsoft_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/microsoft.mrs',
        path: './ruleset/microsoft_ip.mrs',
        'path-in-bundle': 'geo/geoip/microsoft.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Microsoft.svg',
    rules: ['RULE-SET,github,🍑 桃印 | 总卷', 'RULE-SET,microsoft,🪟 云笈·微软', 'RULE-SET,microsoft_ip,🪟 云笈·微软,no-resolve'],
  },
  {
    name: '🍎 玉果·苹果',
    baseOption: selectBaseOption,
    direct: true,
    providers: {
      apple: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/apple.mrs',
        path: './ruleset/apple.mrs',
        'path-in-bundle': 'geo/geosite/apple.mrs',
      },
      apple_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/apple.mrs',
        path: './ruleset/apple_ip.mrs',
        'path-in-bundle': 'geo/geoip/apple.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Apple.svg',
    rules: ['RULE-SET,apple,🍎 玉果·苹果', 'RULE-SET,apple_ip,🍎 玉果·苹果,no-resolve'],
  },
  {
    name: '✈️ 飞书·电报',
    baseOption: selectBaseOption,
    providers: {
      telegram: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/telegram.mrs',
        path: './ruleset/telegram.mrs',
        'path-in-bundle': 'geo/geosite/telegram.mrs',
      },
      telegram_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/telegram.mrs',
        path: './ruleset/telegram_ip.mrs',
        'path-in-bundle': 'geo/geoip/telegram.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Telegram.svg',
    rules: ['RULE-SET,telegram,✈️ 飞书·电报', 'RULE-SET,telegram_ip,✈️ 飞书·电报,no-resolve'],
  },
  {
    name: '🎮 雾阁·蒸汽',
    baseOption: selectBaseOption,
    direct: true,
    providers: {
      steam: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/steam.mrs',
        path: './ruleset/steam.mrs',
        'path-in-bundle': 'geo/geosite/steam.mrs',
      },
      steam_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/steam.mrs',
        path: './ruleset/steam_ip.mrs',
        'path-in-bundle': 'geo/geoip/steam.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Steam.svg',
    rules: ['RULE-SET,steam,🎮 雾阁·蒸汽', 'RULE-SET,steam_ip,🎮 雾阁·蒸汽,no-resolve'],
  },
  {
    name: '🎵 幻音·短影',
    baseOption: selectBaseOption,
    defaultSelected: '🖌️ 砚 | 东瀛',
    providers: {
      tiktok: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/tiktok.mrs',
        path: './ruleset/tiktok.mrs',
        'path-in-bundle': 'geo/geosite/tiktok.mrs',
      },
      tiktok_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/tiktok.mrs',
        path: './ruleset/tiktok_ip.mrs',
        'path-in-bundle': 'geo/geoip/tiktok.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Tiktok.svg',
    rules: ['RULE-SET,tiktok,🎵 幻音·短影', 'RULE-SET,tiktok_ip,🎵 幻音·短影,no-resolve'],
  },
  {
    name: '🕊️ 栖鸾·推特',
    baseOption: selectBaseOption,
    providers: {
      twitter: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/twitter.mrs',
        path: './ruleset/twitter.mrs',
        'path-in-bundle': 'geo/geosite/twitter.mrs',
      },
      twitter_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/twitter.mrs',
        path: './ruleset/twitter_ip.mrs',
        'path-in-bundle': 'geo/geoip/twitter.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Twitter.svg',
    rules: ['RULE-SET,twitter,🕊️ 栖鸾·推特', 'RULE-SET,twitter_ip,🕊️ 栖鸾·推特,no-resolve'],
  },
  {
    name: '📘 墨册·脸书',
    baseOption: selectBaseOption,
    providers: {
      meta: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/meta.mrs',
        path: './ruleset/meta.mrs',
        'path-in-bundle': 'geo/geosite/meta.mrs',
      },
      facebook_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/facebook.mrs',
        path: './ruleset/facebook_ip.mrs',
        'path-in-bundle': 'geo/geoip/facebook.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Meta.svg',
    rules: ['RULE-SET,meta,📘 墨册·脸书', 'RULE-SET,facebook_ip,📘 墨册·脸书,no-resolve'],
  },
  {
    name: '💚 青笺·连线',
    baseOption: selectBaseOption,
    providers: {
      line: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/line.mrs',
        path: './ruleset/line.mrs',
        'path-in-bundle': 'geo/geosite/line.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Line.svg',
    rules: ['RULE-SET,line,💚 青笺·连线'],
  },
  {
    name: '🎞️ 映雪·奈飞',
    baseOption: selectBaseOption,
    providers: {
      netflix: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/netflix.mrs',
        path: './ruleset/netflix.mrs',
        'path-in-bundle': 'geo/geosite/netflix.mrs',
      },
      netflix_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/netflix.mrs',
        path: './ruleset/netflix_ip.mrs',
        'path-in-bundle': 'geo/geoip/netflix.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Netflix.svg',
    rules: ['RULE-SET,netflix,🎞️ 映雪·奈飞', 'RULE-SET,netflix_ip,🎞️ 映雪·奈飞,no-resolve'],
  },
  {
    name: '📚 藏经阁·影库',
    baseOption: selectBaseOption,
    direct: true,
    providers: {
      emby: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/666OS/rules@release/mihomo/domain/Emby.mrs',
        path: './ruleset/emby.mrs',
        'path-in-bundle': 'geo/geosite/category-emby.mrs',
      },
      emos: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/binaryu/emos-proxy-rule@main/rules/emos-mihomo.mrs',
        path: './ruleset/emos.mrs',
        'path-in-bundle': 'geo/geosite/category-emby.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Emby.svg',
    rules: [
      'RULE-SET,emby,📚 藏经阁·影库',
      'RULE-SET,emos,📚 藏经阁·影库',
      'DOMAIN-SUFFIX,mb3admin.com,📚 藏经阁·影库',
      'DOMAIN-SUFFIX,nubebelle.com,📚 藏经阁·影库',
      'DOMAIN-KEYWORD,emby,📚 藏经阁·影库',
      'PROCESS-NAME,com.mb.android,📚 藏经阁·影库',
      'PROCESS-NAME,tv.emby.embyatv,📚 藏经阁·影库',
      'PROCESS-NAME,com.hush.yamby,📚 藏经阁·影库',
      'PROCESS-NAME,com.jellycine.app,📚 藏经阁·影库',
      'PROCESS-NAME,com.mountains.hills,📚 藏经阁·影库',
      'PROCESS-NAME,RodelPlayer.App.exe,📚 藏经阁·影库',
      'PROCESS-NAME,com.feifeiduck.capyplayer,📚 藏经阁·影库',
    ],
  },
  {
    name: '🎒 行囊·网盘',
    baseOption: selectBaseOption,
    direct: true,
    providers: {
      pikpak: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/pikpak.mrs',
        path: './ruleset/pikpak.mrs',
        'path-in-bundle': 'geo/geosite/pikpak.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Pikpak.svg',
    rules: ['RULE-SET,pikpak,🎒 行囊·网盘'],
  },
  {
    name: '🎧 韶音·声乐',
    baseOption: selectBaseOption,
    direct: true,
    providers: {
      spotify: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/spotify.mrs',
        path: './ruleset/spotify.mrs',
        'path-in-bundle': 'geo/geosite/spotify.mrs',
      },
      spotify_ip: {
        ...ruleProviderCommonIpcidr,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geoip/spotify.mrs',
        path: './ruleset/spotify_ip.mrs',
        'path-in-bundle': 'geo/geoip/spotify.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Spotify.svg',
    rules: ['RULE-SET,spotify,🎧 韶音·声乐', 'RULE-SET,spotify_ip,🎧 韶音·声乐,no-resolve'],
  },
  {
    name: '🪙 通宝·加密',
    baseOption: selectBaseOption,
    defaultSelected: '🖌️ 砚 | 东瀛',
    providers: {
      cryptocurrency: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/category-cryptocurrency.mrs',
        path: './ruleset/cryptocurrency.mrs',
        'path-in-bundle': 'geo/geosite/category-cryptocurrency.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Bitcoin.svg',
    rules: ['RULE-SET,cryptocurrency,🪙 通宝·加密'],
  },
  {
    name: '🔖 秘阁·E站',
    baseOption: selectBaseOption,
    direct: true,
    defaultSelected: '☁️ 羽 | 花旗',
    providers: {
      ehentai: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/ehentai.mrs',
        path: './ruleset/ehentai.mrs',
        'path-in-bundle': 'geo/geosite/ehentai.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Ehentai.svg',
    rules: ['RULE-SET,ehentai,🔖 秘阁·E站'],
  },
  {
    name: '🚫 掩扉 | 拦截',
    baseOption: selectBaseOption,
    reject: true,
    providers: {
      adblockmihomolite: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.mrs',
        path: './ruleset/adblockmihomolite.mrs',
        'path-in-bundle': 'geo/geosite/category-ads-all.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/AdBlock.svg',
    rules: ['RULE-SET,adblockmihomolite,🚫 掩扉 | 拦截'],
  },
];

// ---节点过滤、重命名及验证---

/**
 * 节点匹配缓存，避免重复执行正则
 */
const regionMatchCache = new Map();
function getMatchedRegions(proxyName) {
  if (regionMatchCache.has(proxyName)) {
    return regionMatchCache.get(proxyName);
  }

  const regions = allRegionDefinitions.filter((region) => region.regex.test(proxyName));
  regionMatchCache.set(proxyName, regions);

  return regions;
}

/**
 * 标准化节点名称：补全地区国旗、折叠多余空格，并预缓存匹配结果
 */
const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;
function normalizeProxyName(proxy) {
  const originalName = proxy.name;

  const flag = originalName.match(flagRegex)?.[0];

  const nameWithoutFlag = (flag ? originalName.replace(flag, '') : originalName).replace(/\s+/g, ' ').trim();

  const matchedRegions = getMatchedRegions(originalName);

  const regionFlag = flag || matchedRegions.find((region) => region.flag)?.flag;

  const normalizedName = regionFlag ? `${regionFlag} ${nameWithoutFlag}` : nameWithoutFlag;

  if (normalizedName !== originalName) {
    regionMatchCache.set(normalizedName, matchedRegions);
  }

  return normalizedName === originalName ? proxy : { ...proxy, name: normalizedName };
}

/**
 * 修复 dialer-proxy 引用：目标被重命名则更新，被移除或不存在则删除引用
 */
function fixDialerProxy(proxy, renameMap, normalizedProxyNames) {
  const target = proxy['dialer-proxy'];
  if (!target) return proxy;

  if (renameMap.has(target)) {
    return { ...proxy, 'dialer-proxy': renameMap.get(target) };
  }

  if (normalizedProxyNames.has(target)) {
    return proxy;
  }

  const copy = { ...proxy };
  delete copy['dialer-proxy'];
  return copy;
}

/**
 * 读取代理 IP 版本偏好：仅其中一个开关开启时返回对应偏好，
 * 同时开启或同时关闭时返回 null（不应用任何偏好，节点保持原样）
 */
function getIpVersionPreference() {
  const ipv4PreferEnabled = ruleOptionsEnable.代理IPV4优先;
  const ipv6PreferEnabled = ruleOptionsEnable.代理IPV6优先;

  if (ipv4PreferEnabled && !ipv6PreferEnabled) return 'ipv4-prefer';
  if (ipv6PreferEnabled && !ipv4PreferEnabled) return 'ipv6-prefer';
  return null;
}

/**
 * 过滤并标准化节点：剔除内置/信息节点、按配置过滤、去重、修复 dialer-proxy 引用，空列表时抛错
 */
function filterAndNormalizeProxies(config) {
  regionMatchCache.clear();

  const filterLowRateProxiesEnabled = ruleOptionsEnable.过滤低倍率节点;
  const filterHighRateProxiesEnabled = ruleOptionsEnable.过滤高倍率节点;
  const filterNonRegionProxiesEnabled = ruleOptionsEnable.过滤非地区节点;

  const lowRateRegex = filterLowRateProxiesEnabled
    ? rateRegionDefinitions.find((r) => r.name === lowRateRegionName)?.regex
    : null;
  const highRateRegex = filterHighRateProxiesEnabled
    ? rateRegionDefinitions.find((r) => r.name === highRateRegionName)?.regex
    : null;

  const originalProxies = config.proxies || [];

  const filteredRawProxies = originalProxies.filter((proxy) => {
    const type = String(proxy.type ?? '').toLowerCase();
    if (type === 'direct' || type === 'reject' || type === 'rematch') return false;

    if (lowRateRegex?.test(proxy.name) || highRateRegex?.test(proxy.name)) return false;

    if (!filterNonRegionProxiesEnabled) return true;

    const isRegionProxy = getMatchedRegions(proxy.name).some((region) => regionDefinitions.includes(region));

    return isRegionProxy || !excludeFilter.test(proxy.name);
  });

  const renameMap = new Map();
  const normalizedProxies = [];
  const uniqueNames = new Set();

  for (const rawProxy of filteredRawProxies) {
    const normalized = normalizeProxyName(rawProxy);
    if (normalized.name !== rawProxy.name) {
      renameMap.set(rawProxy.name, normalized.name);
    }
    if (!uniqueNames.has(normalized.name)) {
      uniqueNames.add(normalized.name);
      normalizedProxies.push(normalized);
    }
  }

  const normalizedProxyNames = new Set(normalizedProxies.map((p) => p.name));

  const filteredProxies = normalizedProxies.map((proxy) => fixDialerProxy(proxy, renameMap, normalizedProxyNames));

  if (!filteredProxies.length) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  const ipVersionPreference = getIpVersionPreference();
  if (ipVersionPreference) {
    return filteredProxies.map((proxy) =>
      proxy['ip-version'] === ipVersionPreference ? proxy : { ...proxy, 'ip-version': ipVersionPreference },
    );
  }

  return filteredProxies;
}

// ---构建地区组和倍率组---

/**
 * 构建地区策略组，可附带自动选择组
 */
function createRegionGroup(name, icon, proxies) {
  const generateRegionAutoSelectEnabled = ruleOptionsEnable.生成地区自动选择组;
  const hideManualSelectGroupEnabled = ruleOptionsEnable.隐藏地区手动选择组;

  if (generateRegionAutoSelectEnabled) {
    const urlTestName = `${name}·寻花`;
    return [
      {
        ...urlTestBaseOption,
        name: urlTestName,
        proxies,
      },
      {
        ...selectBaseOption,
        name,
        icon,
        proxies: [...proxies, urlTestName],
        hidden: hideManualSelectGroupEnabled,
      },
    ];
  }
  return [
    {
      ...selectBaseOption,
      name,
      icon,
      proxies,
      hidden: hideManualSelectGroupEnabled,
    },
  ];
}

/**
 * 将节点按地区/倍率归类，构建地区策略组、倍率策略组与“其他节点”组
 */
function buildRegionGroups(filteredProxies, customProxies) {
  const generateRateGroupEnabled = ruleOptionsEnable.生成倍率组;

  const regionGroups = Object.fromEntries(allRegionDefinitions.map(({ name }) => [name, []]));
  const otherProxies = [];

  for (const proxy of [...filteredProxies, ...customProxies]) {
    const matchedRegions = getMatchedRegions(proxy.name);
    const isRegionProxy = matchedRegions.some((region) => regionDefinitions.includes(region));

    for (const region of matchedRegions) {
      regionGroups[region.name].push(proxy.name);
    }

    if (!isRegionProxy) {
      otherProxies.push(proxy.name);
    }
  }

  const generatedRegionGroups = allRegionDefinitions
    .filter((r) => regionGroups[r.name].length > 0 && (generateRateGroupEnabled || !rateRegionDefinitions.includes(r)))
    .flatMap((r) => createRegionGroup(r.name, r.icon, regionGroups[r.name]));

  if (otherProxies.length > 0) {
    generatedRegionGroups.push(
      ...createRegionGroup(
        '🪶 散修·散点',
        'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/WorldMap.svg',
        otherProxies,
      ),
    );
  }

  return generatedRegionGroups;
}

// ---构建自定义节点组---

/**
 * 处理自定义节点：标准化名称、与订阅节点重名时添加「🪶 本命-」前缀、内部去重，
 * 并构建「🪶 本命·自建」策略组。
 * 自定义节点不参与订阅节点过滤，也不参与 hosts 改写及 DNS 域名处理。
 */
function buildCustomizeGroups(filteredProxies, customizeList = customizeProxies) {
  const chainEnabled = ruleOptionsEnable.链式代理;

  if (!customizeList.length) {
    if (chainEnabled) {
      throw new Error('启用失败，请在脚本中添加自定义节点后尝试');
    }
    return { customProxies: [], customProxyNames: [], customGroup: null };
  }

  const usedNames = new Set(filteredProxies.map((p) => p.name));
  const customPrefix = '本命-';
  const customProxies = [];

  for (const proxy of customizeList) {
    const normalized = normalizeProxyName(proxy);
    let name = normalized.name;
    while (usedNames.has(name)) {
      name = normalizeProxyName({ name: `${customPrefix}${name}` }).name.replace(`${customPrefix} `, customPrefix);
    }
    usedNames.add(name);

    let customProxy = name === normalized.name ? normalized : { ...normalized, name };
    if (chainEnabled && customProxy['dialer-proxy'] !== dialerProxyName) {
      customProxy = { ...customProxy, 'dialer-proxy': dialerProxyName };
    }
    customProxies.push(customProxy);
  }

  const customProxyNames = customProxies.map((p) => p.name);

  const customGroup = {
    ...selectBaseOption,
    name: chainEnabled ? '🌉 合道·落地' : '🪶 本命·自建',
    proxies: customProxyNames,
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Server.svg',
  };

  return {
    customProxies,
    customProxyNames,
    customGroup,
  };
}

// ---构建基础策略组和分流策略组---

/**
 * 构建基础/分流策略组/部分节点组、GLOBAL 组与规则集，并汇总分流规则
 */
function buildFunctionalGroups(filteredProxies, generatedRegionGroups, customizeInfo) {
  const minimalModeEnabled = ruleOptionsEnable.极简模式;
  const blockForeignQuicEnabled = ruleOptionsEnable.屏蔽国外QUIC;
  const addAllNodesToServiceGroupsEnabled = ruleOptionsEnable.分流组添加所有节点;
  const chainEnabled = ruleOptionsEnable.链式代理;
  const hideManualSelectGroupEnabled = ruleOptionsEnable.隐藏地区手动选择组;

  const functionalGroups = [];
  const functionalRules = [];
  // cn_additional 是断流闸规则的引用集：现在无论「屏蔽国外QUIC」开关如何都常驻（档位交给「🌬️ 御风 | 断流」组决定）
  const finalRuleProviders = { ...baseRuleProviders };

  const { customProxyNames = [], customGroup = null } = customizeInfo || {};
  const filteredProxyNames = filteredProxies.map((p) => p.name);
  const allProxiesNames = [...customProxyNames, ...filteredProxyNames];
  const groupNamesOfSelect = generatedRegionGroups.filter((g) => g.type === 'select').map((g) => g.name);
  const baseGroupNames = baseGroups.filter((g) => ruleOptionsEnable[g.name]).map((g) => g.name);
  const customGroupNames = customGroup ? [customGroup.name] : [];

  const chainGroup =
    chainEnabled && customGroup
      ? {
          ...selectBaseOption,
          name: dialerProxyName,
          proxies: filteredProxyNames,
          icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Bypass.svg',
        }
      : null;

  // 极简模式（同步自上游 AIsouler/MyClash）：不生成地区组/倍率组/分流组，仅保留「🍑 桃印 | 总卷」一个出口。
  // 「🌬️ 御风 | 断流」因断流闸规则常驻而必须保留（规则目标组不可缺失），GLOBAL 中同样排除它以免误选断网。
  if (minimalModeEnabled) {
    const defaultGroup = {
      ...selectBaseOption,
      name: '🍑 桃印 | 总卷',
      proxies: allProxiesNames,
      icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Proxy.svg',
    };
    const quicGateGroup = {
      ...selectBaseOption,
      name: '🌬️ 御风 | 断流',
      proxies: blockForeignQuicEnabled
        ? ['REJECT', 'PASS-RULE', '🏠 归檐 | 直连']
        : ['PASS-RULE', 'REJECT', '🏠 归檐 | 直连'],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Reject.png',
    };
    const directGroup = {
      ...selectBaseOption,
      name: '🏠 归檐 | 直连',
      proxies: [...directProxies.map((p) => p.name)],
      icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/China.svg',
      hidden: true,
    };
    const globalGroup = {
      ...selectBaseOption,
      name: 'GLOBAL',
      proxies: ['🍑 桃印 | 总卷', ...customGroupNames, ...(chainGroup ? [chainGroup.name] : []), '🏠 归檐 | 直连'],
      icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Global.svg',
    };
    return {
      globalGroup,
      functionalGroups: [defaultGroup, quicGateGroup],
      functionalRules: [],
      finalRuleProviders,
      chainGroup,
      directGroup,
    };
  }

  functionalGroups.push({
    ...selectBaseOption,
    name: '🍑 桃印 | 总卷',
    proxies: [...groupNamesOfSelect, ...baseGroupNames, ...customGroupNames],
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Proxy.svg',
  });

  // 🌬️ 御风 | 断流：国外 QUIC 断流闸——御风栈里唯一路由可控的件，做成看得见的组，紧跟总卷
  // 档位：REJECT 拦截（QUIC 被掐，配合嗅探回落 TCP）/ PASS-RULE 放行（交给后续规则正常分流）/ 🏠 归檐 | 直连（QUIC 直连）
  // 「屏蔽国外QUIC」开关只决定初始默认档，store-selected 会记住之后在面板里的选择
  functionalGroups.push({
    ...selectBaseOption,
    name: '🌬️ 御风 | 断流',
    proxies: blockForeignQuicEnabled
      ? ['REJECT', 'PASS-RULE', '🏠 归檐 | 直连']
      : ['PASS-RULE', 'REJECT', '🏠 归檐 | 直连'],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Reject.png',
  });

  const orderedServiceConfigs = [
    ...serviceConfigs.filter((svc) => svc.name === '🚫 掩扉 | 拦截'),
    ...serviceConfigs.filter((svc) => svc.name !== '🚫 掩扉 | 拦截'),
  ];
  for (const svc of orderedServiceConfigs) {
    if (!ruleOptionsEnable[svc.name]) continue;

    functionalRules.push(...(svc.rules || []));
    Object.assign(finalRuleProviders, svc.providers || {});
  }

  for (const svc of serviceConfigs) {
    if (!ruleOptionsEnable[svc.name]) continue;

    let groupProxies = [];
    if (svc.includeAll) {
      groupProxies = [...allProxiesNames];
    } else if (svc.reject) {
      groupProxies = ['REJECT', 'REJECT-DROP', 'PASS'];
    } else {
      groupProxies = !addAllNodesToServiceGroupsEnabled
        ? ['🍑 桃印 | 总卷', ...customGroupNames, ...baseGroupNames, ...groupNamesOfSelect, ...(svc.direct ? ['🏠 归檐 | 直连'] : [])]
        : [
            '🍑 桃印 | 总卷',
            ...customGroupNames,
            ...baseGroupNames,
            ...groupNamesOfSelect,
            ...allProxiesNames,
            ...(svc.direct ? ['🏠 归檐 | 直连'] : []),
          ];
    }

    functionalGroups.push({
      ...svc.baseOption,
      name: svc.name,
      icon: svc.icon,
      proxies: groupProxies,
      ...(svc.defaultSelected !== undefined && {
        'default-selected': svc.defaultSelected,
      }),
    });
  }

  functionalGroups.push({
    ...selectBaseOption,
    name: '🌙 拾遗 | 兜底',
    proxies: ['🍑 桃印 | 总卷', '🏠 归檐 | 直连', ...groupNamesOfSelect],
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Stack.svg',
  });

  const directGroup = {
    ...selectBaseOption,
    name: '🏠 归檐 | 直连',
    proxies: [...directProxies.map((p) => p.name)],
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/China.svg',
    hidden: hideManualSelectGroupEnabled,
  };

  const globalGroup = {
    ...selectBaseOption,
    name: 'GLOBAL',
    proxies: [
      // 「🌬️ 御风 | 断流」只是断流闸规则的目标组，不是通用出口——GLOBAL 模式下误选会全网中断，必须排除
      ...functionalGroups.filter((g) => g.name !== '🌬️ 御风 | 断流').map((g) => g.name),
      ...(chainGroup ? [chainGroup.name] : []),
      directGroup.name,
      ...generatedRegionGroups.map((g) => g.name),
    ],
    icon: 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/Global.svg',
  };

  return { globalGroup, functionalGroups, functionalRules, finalRuleProviders, chainGroup, directGroup };
}

// ---dns和hosts相关处理---

// 常见的公共 DNS，用于过滤订阅中的公共 DNS
const commonDnsList = [
  // IPv4（国内）
  '223.5.5.5',
  '223.6.6.6',
  '119.29.29.29',
  '1.12.12.12',
  '120.53.53.53',
  '114.114.114.114',
  '180.76.76.76',
  '1.2.4.8',
  '116.116.116.116',
  '101.226.4.6',
  '123.125.81.6',
  '180.184.1.1',
  '180.184.2.2',

  // IPv6（国内）
  '2400:3200::1',
  '2400:3200:baba::1',
  '2402:4e00::',
  '2400:da00::6666',

  // IPv4（国外）
  '1.1.1.1',
  '1.0.0.1',
  '8.8.8.8',
  '8.8.4.4',
  '9.9.9.9',
  '149.112.112.112',
  '208.67.222.222',
  '208.67.220.220',
  '94.140.14.14',
  '94.140.15.15',
  '76.76.2.0',
  '76.76.10.0',
  '185.228.168.9',
  '185.228.169.9',
  '77.88.8.8',
  '77.88.8.1',
  '156.154.70.1',
  '156.154.71.1',

  // IPv6（国外）
  '2606:4700:4700::1111',
  '2606:4700:4700::1001',
  '2001:4860:4860::8888',
  '2001:4860:4860::8844',
  '2620:fe::fe',
  '2620:fe::9',
  '2620:119:35::35',
  '2620:119:53::53',
  '2a10:50c0::bad1:ff',
  '2a10:50c0::bad2:ff',
  '2a10:50c0::ad1:ff',
  '2a10:50c0::ad2:ff',
  '2a0d:2a00:1::2',
  '2a0d:2a00:2::2',
  '2a02:6b8::feed:0ff',
  '2a02:6b8:0:1::feed:0ff',
  '2610:a1:1018::1',
  '2610:a1:1019::1',

  // 关键词（国内）
  'alidns',
  'doh.pub',
  'dot.pub',
  'dns.pub',
  'dnspod',
  'dns.baidu',

  // 关键词（国外）
  'dns.google',
  'dns.cloudflare',
  'dns.apple',
  'cloudflare-dns',
  'quad9',
  'opendns',
  'nextdns',
  'adguard',
  'one.one.one.one',
];

// 预编译公共 DNS 正则
const commonDnsRegex = new RegExp(
  commonDnsList.map((dns) => dns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i',
);

// 国内外 DNS 定义
const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
const foreignDNS = ['https://cloudflare-dns.com/dns-query#🍑 桃印 | 总卷', 'https://dns.google/dns-query#🍑 桃印 | 总卷'];
const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];

/**
 * hosts 匹配优先级：精确 > +. > . > *（同级按出现顺序）
 */
function hostSpecificity(pattern) {
  if (pattern.startsWith('+.')) return 2;
  if (pattern.startsWith('.')) return 1;
  if (pattern.includes('*')) return 0;
  return 3;
}

/**
 * 判断域名规则（精确/通配）是否匹配节点域名集合，忽略大小写
 */
function matchDomainPattern(pattern, domains) {
  pattern = pattern.toLowerCase();

  // 精确匹配
  if (!pattern.includes('*') && !pattern.startsWith('+.') && !pattern.startsWith('.')) {
    return typeof domains === 'string'
      ? domains.toLowerCase() === pattern
      : [...domains].some((d) => d.toLowerCase() === pattern);
  }

  const domainList = typeof domains === 'string' ? [domains.toLowerCase()] : [...domains].map((d) => d.toLowerCase());

  // +.example.com
  if (pattern.startsWith('+.')) {
    const suffix = pattern.slice(2);
    return domainList.some((domain) => domain === suffix || domain.endsWith(`.${suffix}`));
  }

  // .example.com
  if (pattern.startsWith('.')) {
    const suffix = pattern.slice(1);
    return domainList.some((domain) => domain !== suffix && domain.endsWith(`.${suffix}`));
  }

  // *.example.com、example.*.com 等
  const patternParts = pattern.split('.');
  return domainList.some((domain) => {
    const domainParts = domain.split('.');
    return (
      patternParts.length === domainParts.length &&
      patternParts.every((part, index) => part === '*' || part === domainParts[index])
    );
  });
}

/**
 * 根据订阅 hosts 映射改写节点 server，改写后无需再复制 hosts 进新配置。
 * 支持链式映射（如 a: b、b: c 时节点 a 改写为 c）；
 * 回环映射（a: b、b: a）由内核校验拒绝，此处仅以已访问集合防御性终止
 */
function applyHostsToProxies(proxies, hosts) {
  if (!hosts || typeof hosts !== 'object') return proxies;

  const hostEntries = Object.entries(hosts)
    .filter(
      ([, value]) => (typeof value === 'string' && value.length > 0) || (Array.isArray(value) && value.length > 0),
    )
    .sort((a, b) => hostSpecificity(b[0]) - hostSpecificity(a[0]));

  if (hostEntries.length === 0) return proxies;

  const targetOf = (value) => {
    if (Array.isArray(value)) value = value.find((v) => typeof v === 'string' && v.length > 0);
    return typeof value === 'string' && value.length > 0 ? value : null;
  };

  const resolveCache = new Map();
  const resolve = (server) => {
    const cached = resolveCache.get(server);
    if (cached !== undefined) return cached;

    const seen = new Set();
    let current = server.toLowerCase();
    let result = server;
    while (!seen.has(current)) {
      seen.add(current);
      const entry = hostEntries.find(([pattern]) => matchDomainPattern(pattern, current));
      const target = entry && targetOf(entry[1]);
      if (!target) break;
      result = target;
      current = target.toLowerCase();
    }
    resolveCache.set(server, result);
    return result;
  };

  return proxies.map((proxy) => {
    if (typeof proxy.server !== 'string') return proxy;
    const server = resolve(proxy.server);
    return server === proxy.server ? proxy : { ...proxy, server };
  });
}

/**
 * 剥离 DNS 地址的 # 策略组后缀；
 * 参数包含 direct 或 直连 时，强制改为 #DIRECT
 */
function stripDnsSuffix(dns) {
  const str = String(dns);
  const hashIndex = str.indexOf('#');
  if (hashIndex === -1) return str;

  const prefix = str.slice(0, hashIndex).trim();

  const suffix = str
    .slice(hashIndex + 1)
    .toLowerCase()
    .trim();

  if (suffix.includes('direct') || suffix.includes('直连')) return prefix + '#DIRECT';

  return prefix;
}

/**
 * 判断节点 server 是否为 IP 地址（IPv4 / IPv6），用于从节点域名集合中排除 IP 类型的 server
 */
function isIpAddress(server) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(server) || server.includes(':');
}

/**
 * 简化节点域名策略：将相同 DNS 的节点域名按后缀归类，至少三段的域名可合并为 +. 后缀形式
 */
function simplifyDomainPolicy(policy) {
  const groups = new Map();

  for (const [domain, dns] of Object.entries(policy)) {
    const dnsKey = JSON.stringify(Array.isArray(dns) ? [...dns].sort() : dns);

    if (domain.startsWith('+.') || domain.startsWith('.') || domain.includes('*')) {
      groups.set(`keep:${domain}`, [{ domain, dns, dnsKey }]);
      continue;
    }

    const parts = domain.split('.');

    if (parts.length < 3) {
      groups.set(`keep:${domain}`, [{ domain, dns, dnsKey }]);
      continue;
    }

    const suffix = parts.slice(-2).join('.');

    if (!groups.has(suffix)) {
      groups.set(suffix, []);
    }

    groups.get(suffix).push({ domain, dns, dnsKey });
  }

  const result = {};

  for (const [suffix, domains] of groups) {
    const firstDnsKey = domains[0].dnsKey;
    const sameDns = domains.every(({ dnsKey }) => dnsKey === firstDnsKey);

    if (domains.length >= 2 && sameDns) {
      result[`+.${suffix}`] = domains[0].dns;
    } else {
      for (const { domain, dns } of domains) {
        result[domain] = dns;
      }
    }
  }

  return result;
}

/**
 * 净泉·真假分明辅助：把订阅自带的 fake-ip-filter 旧黑名单条目，转换为规则模式的 real-ip 条目。
 * 旧语法只含域名模式；rule-set:/geosite: 引用的是订阅自己的规则集，在本配置中并不存在，须丢弃防悬空。
 */
function fakeIpPatternToRule(pattern) {
  if (pattern == null) return null;
  const p = String(pattern).trim().toLowerCase();
  if (!p) return null;
  if (p.startsWith('rule-set:') || p.startsWith('geosite:')) return null;
  if (p.startsWith('+.') || p.startsWith('*.')) {
    const suffix = p.slice(2);
    return suffix ? 'DOMAIN-SUFFIX,' + suffix + ',real-ip' : null;
  }
  if (p.includes('*')) return null; // 中段通配无对应规则类型，丢弃
  return 'DOMAIN,' + p + ',real-ip';
}

/**
 * 构建 DNS 与 hosts：保留私有 DNS、节点域名 policy/fake-ip-filter，并按 hosts 改写节点 server
 * hosts改写条件（满足任意一个条件即可）：
 * 1. proxy-server-nameserver 有且仅有一个 DNS 并且该 DNS 包含非空的 listen 值
 * 2. proxy-server-nameserver 有且仅有一个 DNS 并且该 DNS 包含 127.0.0.1 并且 listen 包含 0.0.0.0
 */
function buildDnsAndHostsConfig(config, filteredProxies) {
  const originalDnsConfig = config.dns || {};

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] || [];
  const listenValue = originalDnsConfig['listen'];

  const shouldRewriteByHosts =
    proxyServerNameservers.length === 1 &&
    typeof listenValue === 'string' &&
    listenValue.length > 0 &&
    (proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes(listenValue.toLowerCase())) ||
      (listenValue.includes('0.0.0.0') &&
        proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes('127.0.0.1'))));

  const mappedProxies = shouldRewriteByHosts ? applyHostsToProxies(filteredProxies, config.hosts) : filteredProxies;

  const proxyDomains = new Set(
    mappedProxies
      .filter((proxy) => typeof proxy.server === 'string')
      .map((proxy) => proxy.server.toLowerCase())
      .filter((server) => !isIpAddress(server)),
  );

  const privateProxyServerNameservers = shouldRewriteByHosts ? [] : proxyServerNameservers;

  const isCommonDns = (dns) => {
    const value = String(dns).trim().toLowerCase();
    if (value === 'system' || value === 'system://') return true;

    return commonDnsRegex.test(value);
  };

  const privateDNS = [
    ...new Set(
      [...(originalDnsConfig['nameserver'] || []), ...privateProxyServerNameservers]
        .map(stripDnsSuffix)
        .filter((dns) => dns.length > 0 && !isCommonDns(dns)),
    ),
  ];

  const matchedProxyPolicy = {};
  for (const [domain, dns] of Object.entries({
    ...originalDnsConfig['nameserver-policy'],
    ...originalDnsConfig['proxy-server-nameserver-policy'],
  })) {
    if (!matchDomainPattern(domain, proxyDomains)) continue;

    const stripedDns = Array.isArray(dns) ? dns.map(stripDnsSuffix).filter((d) => d.length > 0) : stripDnsSuffix(dns);
    if (Array.isArray(stripedDns) && stripedDns.length === 0) continue;

    matchedProxyPolicy[domain] = stripedDns;
  }

  if (privateDNS.length > 0 && Object.keys(matchedProxyPolicy).length === 0) {
    for (const domain of proxyDomains) {
      matchedProxyPolicy[domain] = privateDNS;
    }
  }

  const matchedPolicyDomains = Object.keys(matchedProxyPolicy);
  const proxyServerPolicy =
    proxyDomains.size === matchedPolicyDomains.length &&
    matchedPolicyDomains.every((domain) => proxyDomains.has(domain.toLowerCase()))
      ? simplifyDomainPolicy(matchedProxyPolicy)
      : matchedProxyPolicy;

  const originalFakeIpFilter = originalDnsConfig['fake-ip-filter'] || [];
  const proxyFakeIpFilter = originalFakeIpFilter.filter((pattern) => {
    const p = String(pattern);
    return matchDomainPattern(p, proxyDomains);
  });

  // 🌬️ 净泉 · 真假分明：fake-ip 规则化（fake-ip-filter-mode: rule）
  // 直连域名取真水（real-ip：真实解析、TTL 正常、CDN 就近），其余域名皆镜花（fake-ip：秒回、免 DNS 污染）
  const fakeIpRuleMode = {
    'fake-ip-filter-mode': 'rule',
    'fake-ip-filter': [
      'RULE-SET,private,real-ip',
      'RULE-SET,fakeip_filter,real-ip',
      'RULE-SET,geolocation-cn,real-ip',
      'RULE-SET,cn,real-ip',
      'RULE-SET,games_cn,real-ip',
      'RULE-SET,epicgames,real-ip',
      'RULE-SET,nvidia_cn,real-ip',
      'RULE-SET,apple_cn,real-ip',
      'RULE-SET,microsoft_cn,real-ip',
      ...(ruleOptionsEnable['💬 灵鸽·传讯'] ? ['RULE-SET,googlefcm,real-ip'] : []),
      ...[...new Set(proxyFakeIpFilter.map(fakeIpPatternToRule).filter(Boolean))],
      'MATCH,fake-ip',
    ],
  };
  const fakeIpLegacyMode = {
    'fake-ip-filter': [
      'rule-set:private',
      'rule-set:fakeip_filter',
      'rule-set:geolocation-cn',
      ...(ruleOptionsEnable['💬 灵鸽·传讯'] ? ['rule-set:googlefcm'] : []),
      ...proxyFakeIpFilter,
    ],
  };

  const dns = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    ...(ruleOptionsEnable.净泉真假分明 ? fakeIpRuleMode : fakeIpLegacyMode),
    'default-nameserver': defaultDNS,
    'proxy-server-nameserver': proxyServerDNS,
    ...(Object.keys(proxyServerPolicy).length > 0 && {
      'proxy-server-nameserver-policy': proxyServerPolicy,
    }),
    nameserver: foreignDNS,
    'nameserver-policy': {
      'rule-set:cn': chinaDNS,
    },
    'direct-nameserver': chinaDNS,
  };

  const hosts = {
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],

    // 解决谷歌商店无法下载的问题
    'services.googleapis.cn': 'services.googleapis.com',

    // 屏蔽哔哩哔哩PCDN，解决访问视频/直播卡顿问题
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
  };

  return { dns, hosts, proxies: mappedProxies };
}

// --- 主入口 ---

/**
 * 主入口：覆写机场订阅配置，生成完整 mihomo 配置
 */
function main(config) {
  if (config['proxy-providers'] && Object.keys(config['proxy-providers']).length > 0) {
    throw new Error('配置文件中包含 proxy-providers，请使用机场提供的配置文件进行覆写');
  }

  const newConfig = {};

  const filteredProxies = filterAndNormalizeProxies(config);

  const { customProxies, customProxyNames, customGroup } = buildCustomizeGroups(filteredProxies);

  // 极简模式下不生成地区组/倍率组
  const generatedRegionGroups = ruleOptionsEnable.极简模式 ? [] : buildRegionGroups(filteredProxies, customProxies);

  const { globalGroup, functionalGroups, functionalRules, finalRuleProviders, chainGroup, directGroup } =
    buildFunctionalGroups(filteredProxies, generatedRegionGroups, { customProxyNames, customGroup });

  const { dns, hosts, proxies: mappedProxies } = buildDnsAndHostsConfig(config, filteredProxies);

  newConfig['dns'] = dns;
  newConfig['hosts'] = hosts;
  newConfig['mixed-port'] = 7890;
  newConfig['allow-lan'] = true;
  newConfig['ipv6'] = true;
  newConfig['mode'] = 'rule';
  newConfig['log-level'] = 'info';
  newConfig['bind-address'] = '*';
  newConfig['unified-delay'] = true;
  newConfig['tcp-concurrent'] = true;
  newConfig['global-client-fingerprint'] = 'chrome'; // TLS 指纹统一，降低 CDN 风控拦截，连接更稳
  newConfig['keep-alive-interval'] = 30; // 30s 保活，NAT 映射不易失效，重连少、延迟稳
  newConfig['tcp-keep-alive-idle'] = 30; // TCP 空闲保活 30s，减少延迟抖动

  newConfig['external-controller'] = '127.0.0.1:9090';
  newConfig['external-ui'] = 'ui';
  newConfig['external-ui-url'] = 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip';

  newConfig['profile'] = {
    'store-selected': true,
    'store-fake-ip': true,
  };

  newConfig['ntp'] = {
    enable: true,
    'write-to-system': false,
    server: 'ntp.aliyun.com',
    port: 123,
    interval: 60,
  };

  // 🌬️ 御风栈 · mips 深度优化（2026-09 原创）
  // mips = mihomo 自研纯 Go 用户态 IP 栈（mipstack）：字节级 DRR 出站调度，短 UDP/ICMP 不被 TCP 大包堵。
  // 御风三式皆围绕「让用户态栈每包更值、进栈流量更少」展开：
  newConfig['tun'] = {
    enable: true,
    // 御风之本：mips 为 mihomo 自研栈（约 v1.19.31+ 才有）；老内核不识会致 TUN 启动失败，关开关即回退官方推荐的 mixed
    stack: ruleOptionsEnable.御风栈启用mips ? 'mips' : 'mixed',
    'auto-route': true,
    'strict-route': true,
    'auto-redirect': true,
    'auto-detect-interface': true,
    'dns-hijack': ['any:53', 'tcp://any:53'],
    'udp-timeout': 600, // UDP 会话保鲜 10 分钟（默认 300s），QUIC/语音长会话不易断流
    // 一式·整运：MTU 9000 + GSO 64K 大件整运——包越大、每字节穿越用户态栈的固定开销越低
    // （GSO 仅 Linux 系内核生效，Windows/macOS 下 mihomo 自动忽略；MTU 若遇个别 APP 异常可关闭本式）
    ...(ruleOptionsEnable.御风栈整运
      ? { mtu: 9000, gso: true, 'gso-max-size': 65536 }
      : {}),
    // 二式·让路：家门之内不入栈——私网/链路本地/组播直接绕行（/1 全局路由默认会把它们扫进栈），
    // 局域网互访（NAS/投屏/打印机/mDNS）不排队；ICMP 由栈本地即答，不再转发占位
    // （disable-icmp-forwarding 为较新字段，旧内核静默忽略、不报错）
    ...(ruleOptionsEnable.御风栈让路
      ? {
          'route-exclude-address': [
            '10.0.0.0/8', // 私网 A 类（落在 0.0.0.0/1 内，默认会进栈）
            '172.16.0.0/12', // 私网 B 类（落在 128.0.0.0/1 内）
            '192.168.0.0/16', // 私网 C 类（落在 128.0.0.0/1 内）
            '169.254.0.0/16', // 链路本地
            '224.0.0.0/4', // IPv4 组播（mDNS/SSDP 等局域网发现）
            'fc00::/7', // IPv6 ULA 私网
            'ff00::/8', // IPv6 组播
          ],
          'disable-icmp-forwarding': true,
        }
      : {}),
    // 三式·纳新：UDP 全锥 NAT（EIM）——WebRTC/游戏/语音 P2P 穿透成功率提升
    // （官方注明性能略降、非必要不启，故默认关，按需打开开关）
    ...(ruleOptionsEnable.御风栈纳新 ? { 'endpoint-independent-nat': true } : {}),
  };

  // 🏮 桃白簪花增强：TLS/HTTP 域名嗅探，各 APP 分流更精准；QUIC 被拦自动回落 TCP，视频/语音不断流
  newConfig['sniffer'] = {
    enable: true,
    'override-destination': false,
    sniff: {
      TLS: { ports: [443] },
      HTTP: { ports: [80, 8080, 8880] },
      QUIC: { ports: [443, 8443] }, // 断流闸放行档时，QUIC 也能按域名精准分流（参考 echs-top/proxy）
    },
    'skip-domain': ['+.push.apple.com', 'Mijia Cloud', 'dlg.io.mi.com'],
  };

  newConfig['proxies'] = [...customProxies, ...mappedProxies, ...directProxies];
  newConfig['proxy-groups'] = [
    globalGroup,
    ...functionalGroups,
    ...(customGroup ? [customGroup] : []),
    ...(chainGroup ? [chainGroup] : []),
    directGroup,
    ...generatedRegionGroups,
  ];
  newConfig['rule-providers'] = finalRuleProviders;

  newConfig['rules'] = [
    ...prefixRules,
    // 🌬️ 御风 | 断流：断流闸常驻（档位交给同名策略组，初始默认档由「屏蔽国外QUIC」开关决定）
    ...foreignQuicGateRules,
    ...functionalRules,

    // 拾遗·兜底规则
    'RULE-SET,geolocation-!cn,🍑 桃印 | 总卷',
    'RULE-SET,cn_ip,🏠 归檐 | 直连',
    'RULE-SET,private_ip,🏠 归檐 | 直连',
    `MATCH,${ruleOptionsEnable.极简模式 ? '🍑 桃印 | 总卷' : '🌙 拾遗 | 兜底'}`, // 极简模式无「🌙 拾遗 | 兜底」组，兜底走总卷
  ];

  return newConfig;
}
