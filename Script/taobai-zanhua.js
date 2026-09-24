/**
 * 🌸 桃白簪花 · 执子之手 —— mihomo 配置覆写脚本
 *
 *   「以中国桃花与白桃为印，收存山河、人物与相守心事。」
 *
 * 原作者：AIsouler（https://github.com/AIsouler/MyClash）
 * 原脚本：https://raw.githubusercontent.com/AIsouler/MyClash/main/Script/mihomoScript.js
 * 本版：基于原脚本微改 + 「桃白簪花」意象重塑
 *   · 2026-09 命名重做：策略组一律采用标准功能名/服务名，一眼可懂；不再用生僻意象猜谜
 *     「桃白簪花」主题不再靠堆砌意象，而落在三处：主控组名、三卷分类、自研图标
 *   · 面向「超稳定、超低延迟访问各个 APP」的四项增强：
 *     1) sniffer 域名嗅探：QUIC 被拦截自动回落 TCP，视频/语音不断流
 *     2) global-client-fingerprint=chrome：统一 TLS 指纹，降低 CDN 风控拦截概率
 *     3) keep-alive-interval 30s + tcp-keep-alive-idle 30s：空闲保活，减少重连与延迟抖动
 *     4) 自动选择组以 50ms 容差 url-test 实时测速，始终走最轻的落处
 *   · 2026-09「御风栈」：对 mihomo 自研 mips 栈（纯 Go 用户态 IP 栈，字节级 DRR 调度）的深度优化组合
 *     御风之本：stack=mips 开关化，老内核可一键回退 mixed
 *     一式·整运：MTU 9000 + GSO 64K 大件整运，摊薄用户态栈每包开销（GSO 仅 Linux 系生效）—— 原创
 *     二式·让路：私网/链路本地/组播不进 TUN 栈，ICMP 本地即答 —— 路由绕行为原创，ICMP 参考 echs-top/proxy
 *     三式·纳新：全锥 NAT（EIM）按开关启用，游戏/语音 P2P 穿透更顺 —— 参考 echs-top/proxy 并开关化
 *       （另有常备 UDP 会话保鲜 udp-timeout=600，默认 300s 易断流，同参考 echs-top/proxy）
 *     净泉·真假分明：fake-ip 规则化——直连域名取真水（real-ip 真实解析、CDN 就近），余者皆镜花（fake-ip 秒回）
 *       —— 思路参考 echs-top/proxy，规则集映射与订阅条目自动转换为原创
 *     断流闸：国外 QUIC 做成看得见的策略组「QUIC 断流闸」（REJECT 拦截 / PASS-RULE 放行 / 直连 三档），
 *       「屏蔽国外QUIC」开关只定初始默认档；sniffer 补 QUIC 端口嗅探，放行档也能按域名分流
 *
 * ── 命名体系（2026-09 重做）──
 *
 * 命名原则：组名 = 标准功能名 / 标准服务名，不猜谜；
 *          Emoji 只在地区组保留国旗（信息量大、面板一眼可辨），其余组一律不带。
 *
 * 【主控】桃白簪花 · 主控      全局唯一出口，万流归卷（品牌锚点）
 * 【基础】手动选择 / 自动选择 / 负载均衡
 * 【去路】直连 / 广告拦截 / 兜底 / QUIC 断流闸
 * 【地区】🇨🇳 中国香港　🇨🇳 中国澳门　🇨🇳 中国台湾　🇯🇵 日本　🇺🇸 美国　🇸🇬 新加坡
 *         低倍率节点 / 高倍率节点 / 其他节点
 * 【自建】自建节点 / 链式中转 / 链式落地
 * 【服务】Google FCM / YouTube / Google / AI 服务 / Microsoft / Apple / Telegram / Steam
 *         TikTok / Twitter / Meta / LINE / Netflix / Emby / PikPak / Spotify / 加密货币 / E-Hentai
 *
 * 「桃白簪花」主题落点（主题不丢，但不再谜语人）：
 *   1) 主控组名沿用工作室品牌「桃白簪花」（网页：http://fanxiaofei.ccwu.cc/ ，标语「写字，做工具，也存几张图」）
 *   2) 服务分卷沿用站点三栏目分类——桃花笺 / 拾遗录 / 观照集：
 *      【桃花笺】文字与社交：Google FCM / Google / Twitter / Meta / Telegram / LINE
 *      【拾遗录】工具与服务：Microsoft / Apple / AI 服务 / PikPak / 加密货币 / E-Hentai / 广告拦截
 *      【观照集】影音与图像：YouTube / Netflix / Emby / Spotify / TikTok / Steam
 *   3) 图标为自研「簪花印」体系：桃粉渐变底 #F0A8C0 → #E58BA8 + 白色简笔符号，
 *      取自站点主色（桃粉 #E58BA8 / #F0A8C0 / #CE93AA，枝干 #6B574E），
 *      全部存放于本仓库 Icons/ 目录，不再引用上游 AIsouler/MyClash 图标。
 *
 * 港澳台命名：中国香港 / 中国澳门 / 中国台湾，统一带「中国」前缀。
 * 图标约定：桃粉印章底 + 白色符号；48×48，圆角 13。
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
  '手动选择': true, // 是否启用手动选择策略组
  '自动选择': true, // 是否启用自动选择策略组
  '负载均衡': true, // 是否启用负载均衡策略组

  // 以下为分流策略配置
  'Google FCM': true, // Google FCM 推送
  'YouTube': true, // YouTube 视频
  'Google': true, // Google 服务
  'AI 服务': true, // 国外 AI 服务
  'Microsoft': true, // Microsoft 服务
  'Apple': true, // Apple 服务
  'Telegram': true, // Telegram 通讯
  'Steam': true, // Steam 游戏
  'TikTok': true, // TikTok 短视频
  'Twitter': true, // Twitter 社交
  'Meta': true, // Meta 服务
  'LINE': true, // LINE 通讯
  'Netflix': true, // Netflix 影视
  'Emby': true, // Emby 媒体库
  'PikPak': true, // PikPak 网盘
  'Spotify': true, // Spotify 音乐
  '加密货币': true, // 加密货币
  'PayPal': true, // PayPal 支付
  'E-Hentai': true, // E-Hentai
  '广告拦截': true, // 广告拦截

  // 以下为非分流策略配置
  极简模式: false, // 是否启用极简模式（不生成地区组/倍率组/分流组，仅保留「桃白簪花 · 主控」出口，兜底 MATCH 走主控）
  生成地区自动选择组: true, // 是否生成地区自动选择策略组
  隐藏地区手动选择组: false, // 是否隐藏地区手动选择策略组
  生成倍率组: true, // 是否生成低倍率/高倍率策略组
  分流组添加所有节点: false, // 是否为分流策略组添加所有节点
  过滤低倍率节点: false, // 是否过滤低倍率节点
  过滤高倍率节点: false, // 是否过滤高倍率节点
  过滤非地区节点: true, // 是否过滤非地区节点
  屏蔽国外QUIC: true, // 「QUIC 断流闸」初始默认档：true=REJECT 拦截（配合嗅探回落 TCP），false=PASS-RULE 放行；面板里可随时切档
  代理IPV4优先: false, // 是否将订阅节点统一为 IPv4 优先（与"代理IPV6优先"同时开启时不生效）
  代理IPV6优先: false, // 是否将订阅节点统一为 IPv6 优先（与"代理IPV4优先"同时开启时不生效）
  链式代理: false, // 是否启用链式代理（自定义节点作为落地节点，经「链式中转」策略组中转）

  // 以下为 TUN「御风栈」mips 深度优化（2026-09 原创组合；udp-timeout/EIM/ICMP/fake-ip 规则化四式参考 echs-top/proxy）
  御风栈启用mips: true, // 御风之本：TUN 用 mihomo 自研 mips 栈；需较新内核（约 v1.19.31+），老内核 TUN 起不来时关闭回退 mixed
  御风栈整运: true, // 一式·整运：MTU 9000 + GSO 64K，大件整运摊薄每包开销（GSO 仅 Linux 系内核生效，Windows 自动忽略；如遇异常可关）
  御风栈让路: true, // 二式·让路：私网/链路本地/组播不进 TUN 栈（局域网互访更快、栈更轻），ICMP 本地即答
  御风栈纳新: false, // 三式·纳新：UDP 全锥 NAT（EIM），游戏/语音 P2P 穿透更顺；官方注明性能略降，非必要不启
  净泉真假分明: true, // 净泉：fake-ip 规则化——直连域名取真水（real-ip），代理域名皆镜花（fake-ip）；如遇老内核不识别可关
};

// 定义前置规则
const prefixRules = [
  // 私有网络 → 直连
  'RULE-SET,private,直连',

  // 国内 → 直连
  'RULE-SET,geolocation-cn,直连',
  'RULE-SET,games_cn,直连', // 已包含 steam 下载域名
  'RULE-SET,epicgames,直连',
  'RULE-SET,nvidia_cn,直连',
  'RULE-SET,apple_cn,直连',
  'RULE-SET,microsoft_cn,直连',
  'DOMAIN,fsend.cn,直连',
  'DOMAIN,international-gfe.download.nvidia.com,直连',
];

// 此处添加自定义节点，填入下方[]内（可选，留空则不生成「自建节点」策略组）
// 自定义节点不参与节点过滤与 hosts 改写；与订阅节点（标准化后）重名时自动添加「自建-」前缀
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
const dialerProxyName = '链式中转';

// 定义全局排除节点的正则表达式，用于排除非地区节点
const excludeFilter =
  /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|电报|无法|说明|使用|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\.me\/\+|\bexpire\b|\bhttps?:\/\/|\.com|\btraffic\b/iu;

// 国外 QUIC 断流闸：目标指向可见策略组「QUIC 断流闸」（御风栈中唯一路由可控的件，面板可实时切档）
const foreignQuicGateRules = [
  'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,cn_additional),(RULE-SET,cn_ip,no-resolve)))))),QUIC 断流闸',
];

// 直连·直连节点
const directProxies = [
  {
    name: '🇨🇳 直连 | 双栈',
    type: 'direct',
  },
  {
    name: '🇨🇳 直连 | IPv4优先',
    type: 'direct',
    'ip-version': 'ipv4-prefer',
  },
  {
    name: '🇨🇳 直连 | IPv6优先',
    type: 'direct',
    'ip-version': 'ipv6-prefer',
  },
  {
    name: '🇨🇳 直连 | 仅IPv4',
    type: 'direct',
    'ip-version': 'ipv4',
  },
  {
    name: '🇨🇳 直连 | 仅IPv6',
    type: 'direct',
    'ip-version': 'ipv6',
  },
];

// 定义地区策略组（中国香港 / 中国澳门 / 中国台湾 / 日本 / 美国 / 新加坡）
const regionDefinitions = [
  {
    name: '🇨🇳 中国香港',
    flag: '🇭🇰',
    regex: /🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\s*kong/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/hk.svg',
  },
  {
    name: '🇨🇳 中国澳门',
    flag: '🇲🇴',
    regex: /🇲🇴|澳门|濠江|濠镜|(?<![A-Za-z])MACAU(?![A-Za-z])|(?<![A-Za-z])MO(?![A-Za-z])/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/mo.svg',
  },
  {
    name: '🇯🇵 日本',
    flag: '🇯🇵',
    regex: /🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/jp.svg',
  },
  {
    name: '🇺🇸 美国',
    flag: '🇺🇸',
    regex:
      /🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|圣地亚哥|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\s*states/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/us.svg',
  },
  {
    name: '🇸🇬 新加坡',
    flag: '🇸🇬',
    regex: /🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/sg.svg',
  },
  {
    name: '🇨🇳 中国台湾',
    flag: '🇨🇳',
    regex: /🇨🇳|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/tw.svg',
  },
];

// 定义倍率策略组
const lowRateRegionName = '低倍率节点';
const highRateRegionName = '高倍率节点';

const rateRegionDefinitions = [
  {
    name: lowRateRegionName,
    regex:
      /^(?!.*(?:剩|期)).*(?:(?<!\d)0\.[0-5]|(?<=[ \[\(|｜丨∣┃\-‐–—−－﹣])0[*×✕✖⨯⨉x倍])|(?:(?<=[ \[\(|｜丨∣┃\-‐–—−－﹣])[*×✕✖⨯⨉x]0(?=[ \)\]]|倍|$))|^(?!.*(?:客户端|软件)).*下载|低倍|免费|(?<![A-Za-z])free(?![A-Za-z])/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/low-rate.svg',
  },
  {
    name: highRateRegionName,
    regex:
      /(?<=[ \[\(|｜丨∣┃\-‐–—−－﹣])((?:[*×✕✖⨯⨉x]\s*(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?\s*(?:倍|[*×✕✖⨯⨉x])))/i,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/high-rate.svg',
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
  icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/auto.svg',
  hidden: true,
};

// load-balance策略组通用配置
const loadBalanceBaseOption = {
  ...groupBaseOption,
  type: 'load-balance',
  strategy: 'sticky-sessions',
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/balance.svg',
  hidden: true,
};

// 定义基础策略组
const baseGroups = [
  {
    name: '手动选择',
    baseOption: selectBaseOption,
    includeAll: true,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/manual.svg',
  },
  {
    name: '自动选择',
    baseOption: urlTestBaseOption,
    includeAll: true,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/auto.svg',
  },
  {
    name: '负载均衡',
    baseOption: loadBalanceBaseOption,
    includeAll: true,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/balance.svg',
  },
];

// 定义分流策略组配置
const serviceConfigs = [
  ...baseGroups,
  {
    name: 'Google FCM',
    baseOption: selectBaseOption,
    direct: true,
    defaultSelected: '直连',
    providers: {
      googlefcm: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/googlefcm.mrs',
        path: './ruleset/googlefcm.mrs',
        'path-in-bundle': 'geo/geosite/googlefcm.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/fcm.svg',
    rules: ['RULE-SET,googlefcm,Google FCM'],
  },
  {
    name: 'YouTube',
    baseOption: selectBaseOption,
    providers: {
      youtube: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/youtube.mrs',
        path: './ruleset/youtube.mrs',
        'path-in-bundle': 'geo/geosite/youtube.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/youtube.svg',
    rules: ['RULE-SET,youtube,YouTube'],
  },
  {
    name: 'Google',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/google.svg',
    rules: ['RULE-SET,google,Google', 'RULE-SET,google_ip,Google,no-resolve'],
  },
  {
    name: 'AI 服务',
    baseOption: selectBaseOption,
    defaultSelected: '🇺🇸 美国',
    providers: {
      ai: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/category-ai-!cn.mrs',
        path: './ruleset/ai.mrs',
        'path-in-bundle': 'geo/geosite/category-ai-!cn.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/ai.svg',
    rules: ['RULE-SET,ai,AI 服务'],
  },
  {
    name: 'Microsoft',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/microsoft.svg',
    rules: ['RULE-SET,github,桃白簪花 · 主控', 'RULE-SET,microsoft,Microsoft', 'RULE-SET,microsoft_ip,Microsoft,no-resolve'],
  },
  {
    name: 'Apple',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/apple.svg',
    rules: ['RULE-SET,apple,Apple', 'RULE-SET,apple_ip,Apple,no-resolve'],
  },
  {
    name: 'Telegram',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/telegram.svg',
    rules: ['RULE-SET,telegram,Telegram', 'RULE-SET,telegram_ip,Telegram,no-resolve'],
  },
  {
    name: 'Steam',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/steam.svg',
    rules: ['RULE-SET,steam,Steam', 'RULE-SET,steam_ip,Steam,no-resolve'],
  },
  {
    name: 'TikTok',
    baseOption: selectBaseOption,
    defaultSelected: '🇯🇵 日本',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/tiktok.svg',
    rules: ['RULE-SET,tiktok,TikTok', 'RULE-SET,tiktok_ip,TikTok,no-resolve'],
  },
  {
    name: 'Twitter',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/twitter.svg',
    rules: ['RULE-SET,twitter,Twitter', 'RULE-SET,twitter_ip,Twitter,no-resolve'],
  },
  {
    name: 'Meta',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/meta.svg',
    rules: ['RULE-SET,meta,Meta', 'RULE-SET,facebook_ip,Meta,no-resolve'],
  },
  {
    name: 'LINE',
    baseOption: selectBaseOption,
    providers: {
      line: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/line.mrs',
        path: './ruleset/line.mrs',
        'path-in-bundle': 'geo/geosite/line.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/line.svg',
    rules: ['RULE-SET,line,LINE'],
  },
  {
    name: 'Netflix',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/netflix.svg',
    rules: ['RULE-SET,netflix,Netflix', 'RULE-SET,netflix_ip,Netflix,no-resolve'],
  },
  {
    name: 'Emby',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/emby.svg',
    rules: [
      'RULE-SET,emby,Emby',
      'RULE-SET,emos,Emby',
      'DOMAIN-SUFFIX,mb3admin.com,Emby',
      'DOMAIN-SUFFIX,nubebelle.com,Emby',
      'DOMAIN-KEYWORD,emby,Emby',
      'PROCESS-NAME,com.mb.android,Emby',
      'PROCESS-NAME,tv.emby.embyatv,Emby',
      'PROCESS-NAME,com.hush.yamby,Emby',
      'PROCESS-NAME,com.jellycine.app,Emby',
      'PROCESS-NAME,com.mountains.hills,Emby',
      'PROCESS-NAME,RodelPlayer.App.exe,Emby',
      'PROCESS-NAME,com.feifeiduck.capyplayer,Emby',
    ],
  },
  {
    name: 'PikPak',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/pikpak.svg',
    rules: ['RULE-SET,pikpak,PikPak'],
  },
  {
    name: 'Spotify',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/spotify.svg',
    rules: ['RULE-SET,spotify,Spotify', 'RULE-SET,spotify_ip,Spotify,no-resolve'],
  },
  {
    name: '加密货币',
    baseOption: selectBaseOption,
    defaultSelected: '🇯🇵 日本',
    providers: {
      cryptocurrency: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/category-cryptocurrency.mrs',
        path: './ruleset/cryptocurrency.mrs',
        'path-in-bundle': 'geo/geosite/category-cryptocurrency.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/crypto.svg',
    rules: ['RULE-SET,cryptocurrency,加密货币'],
  },
  {
    name: 'PayPal',
    baseOption: selectBaseOption,
    providers: {
      paypal: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/paypal.mrs',
        path: './ruleset/paypal.mrs',
        'path-in-bundle': 'geo/geosite/paypal.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/paypal.svg',
    rules: ['RULE-SET,paypal,PayPal'],
  },
  {
    name: 'E-Hentai',
    baseOption: selectBaseOption,
    direct: true,
    defaultSelected: '🇺🇸 美国',
    providers: {
      ehentai: {
        ...ruleProviderCommonDomain,
        url: 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/geosite/ehentai.mrs',
        path: './ruleset/ehentai.mrs',
        'path-in-bundle': 'geo/geosite/ehentai.mrs',
      },
    },
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/ehentai.svg',
    rules: ['RULE-SET,ehentai,E-Hentai'],
  },
  {
    name: '广告拦截',
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
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/adblock.svg',
    rules: ['RULE-SET,adblockmihomolite,广告拦截'],
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
    const urlTestName = `${name} · 自动`;
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
        '其他节点',
        'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/other.svg',
        otherProxies,
      ),
    );
  }

  return generatedRegionGroups;
}

// ---构建自定义节点组---

/**
 * 处理自定义节点：标准化名称、与订阅节点重名时添加「自建-」前缀、内部去重，
 * 并构建「自建节点」策略组。
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
  const customPrefix = '自建-';
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
    name: chainEnabled ? '链式落地' : '自建节点',
    proxies: customProxyNames,
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/self-hosted.svg',
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
  // cn_additional 是断流闸规则的引用集：现在无论「屏蔽国外QUIC」开关如何都常驻（档位交给「QUIC 断流闸」组决定）
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
          icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/chain.svg',
        }
      : null;

  // 极简模式（同步自上游 AIsouler/MyClash）：不生成地区组/倍率组/分流组，仅保留「桃白簪花 · 主控」一个出口。
  // 「QUIC 断流闸」因断流闸规则常驻而必须保留（规则目标组不可缺失），GLOBAL 中同样排除它以免误选断网。
  if (minimalModeEnabled) {
    const defaultGroup = {
      ...selectBaseOption,
      name: '桃白簪花 · 主控',
      proxies: allProxiesNames,
      icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/taobai.svg',
    };
    const quicGateGroup = {
      ...selectBaseOption,
      name: 'QUIC 断流闸',
      proxies: blockForeignQuicEnabled
        ? ['REJECT', 'PASS-RULE', '直连']
        : ['PASS-RULE', 'REJECT', '直连'],
      icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/quic-gate.svg',
    };
    const directGroup = {
      ...selectBaseOption,
      name: '直连',
      proxies: [...directProxies.map((p) => p.name)],
      icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/direct.svg',
      hidden: true,
    };
    const globalGroup = {
      ...selectBaseOption,
      name: 'GLOBAL',
      proxies: ['桃白簪花 · 主控', ...customGroupNames, ...(chainGroup ? [chainGroup.name] : []), '直连'],
      icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/global.svg',
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
    name: '桃白簪花 · 主控',
    proxies: [...groupNamesOfSelect, ...baseGroupNames, ...customGroupNames],
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/taobai.svg',
  });

  // QUIC 断流闸：国外 QUIC 断流闸——御风栈里唯一路由可控的件，做成看得见的组，紧跟总卷
  // 档位：REJECT 拦截（QUIC 被掐，配合嗅探回落 TCP）/ PASS-RULE 放行（交给后续规则正常分流）/ 直连（QUIC 直连）
  // 「屏蔽国外QUIC」开关只决定初始默认档，store-selected 会记住之后在面板里的选择
  functionalGroups.push({
    ...selectBaseOption,
    name: 'QUIC 断流闸',
    proxies: blockForeignQuicEnabled
      ? ['REJECT', 'PASS-RULE', '直连']
      : ['PASS-RULE', 'REJECT', '直连'],
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/quic-gate.svg',
  });

  const orderedServiceConfigs = [
    ...serviceConfigs.filter((svc) => svc.name === '广告拦截'),
    ...serviceConfigs.filter((svc) => svc.name !== '广告拦截'),
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
        ? ['桃白簪花 · 主控', ...customGroupNames, ...baseGroupNames, ...groupNamesOfSelect, ...(svc.direct ? ['直连'] : [])]
        : [
            '桃白簪花 · 主控',
            ...customGroupNames,
            ...baseGroupNames,
            ...groupNamesOfSelect,
            ...allProxiesNames,
            ...(svc.direct ? ['直连'] : []),
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
    name: '兜底',
    proxies: ['桃白簪花 · 主控', '直连', ...groupNamesOfSelect],
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/fallback.svg',
  });

  const directGroup = {
    ...selectBaseOption,
    name: '直连',
    proxies: [...directProxies.map((p) => p.name)],
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/direct.svg',
    hidden: hideManualSelectGroupEnabled,
  };

  const globalGroup = {
    ...selectBaseOption,
    name: 'GLOBAL',
    proxies: [
      // 「QUIC 断流闸」只是断流闸规则的目标组，不是通用出口——GLOBAL 模式下误选会全网中断，必须排除
      ...functionalGroups.filter((g) => g.name !== 'QUIC 断流闸').map((g) => g.name),
      // 自建节点/链式落地不进 functionalGroups（main 里单独拼装），GLOBAL 需按名补入
      ...customGroupNames,
      ...(chainGroup ? [chainGroup.name] : []),
      directGroup.name,
      ...generatedRegionGroups.map((g) => g.name),
    ],
    icon: 'https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/global.svg',
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
const foreignDNS = ['https://cloudflare-dns.com/dns-query#桃白簪花 · 主控', 'https://dns.google/dns-query#桃白簪花 · 主控'];
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
  const minimalModeEnabled = ruleOptionsEnable.极简模式;

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

  // 净泉 · 真假分明：fake-ip 规则化（fake-ip-filter-mode: rule）
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
      // 极简模式不生成分流组，googlefcm 规则集不会注册，DNS 里不能再引用（否则内核报规则集缺失）
      ...(!minimalModeEnabled && ruleOptionsEnable['Google FCM'] ? ['RULE-SET,googlefcm,real-ip'] : []),
      ...[...new Set(proxyFakeIpFilter.map(fakeIpPatternToRule).filter(Boolean))],
      'MATCH,fake-ip',
    ],
  };
  const fakeIpLegacyMode = {
    'fake-ip-filter': [
      'rule-set:private',
      'rule-set:fakeip_filter',
      'rule-set:geolocation-cn',
      ...(!minimalModeEnabled && ruleOptionsEnable['Google FCM'] ? ['rule-set:googlefcm'] : []),
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

  // 御风栈 · mips 深度优化（2026-09 原创）
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

  // 桃白簪花增强：TLS/HTTP 域名嗅探，各 APP 分流更精准；QUIC 被拦自动回落 TCP，视频/语音不断流
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
    // QUIC 断流闸：断流闸常驻（档位交给同名策略组，初始默认档由「屏蔽国外QUIC」开关决定）
    ...foreignQuicGateRules,
    ...functionalRules,

    // 兜底规则
    'RULE-SET,geolocation-!cn,桃白簪花 · 主控',
    'RULE-SET,cn_ip,直连',
    'RULE-SET,private_ip,直连',
    `MATCH,${ruleOptionsEnable.极简模式 ? '桃白簪花 · 主控' : '兜底'}`, // 极简模式无「兜底」组，兜底走总卷
  ];

  return newConfig;
}
