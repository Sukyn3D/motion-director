# Dribbble / Pinterest 视觉参考候选

检索日期：2026-10-09。用户要求先找参考并发给其查看；已在创建时发送以下链接。状态区分很重要：本次可以读取部分 Dribbble 标题与作者，Pinterest 搜索索引有标题，但部分作品页返回403/抓取失败，浏览器预览未能启动。因此未完整观看视频，未做逐帧质量筛选，不能把这些候选称为已验证的优质动效或把网页标题推断成实际运动轨迹。库中30套代码为自主实现，未复制第三方媒体/代码，不逐帧复刻候选作品。

| 候选 / 作者 | 出处 | 可核对程度 | 希望进一步观察的关系；不是已观察结论 |
|---|---|---|---|
| Button Hover Effects / Aaron Iker | [Dribbble](https://dribbble.com/shots/7441241-Button-Hover-Effects) | 作品页文本：标题/作者；未完整观看 | 局部文字/图标响应如何保留稳定目标；是否适合高频按钮 |
| Button Hover Animation / Aaron Iker | [Dribbble](https://dribbble.com/shots/20982047--Button-Hover-Animation) | 作品页文本：标题/作者/灵感来源 | 品牌表达的强度、结束和重复行为 |
| Animated tab bar icons / Aaron Iker | [Dribbble](https://dribbble.com/shots/20651610-Animated-tab-bar-icons) | 作品页文本：标题/作者/灵感来源 | 导航与icon之间的编排；切换中反向输入 |
| Card hover effect / Aaron Iker | [Dribbble](https://dribbble.com/shots/19929862-Card-hover-effect) | 作品页文本：标题/作者 | 可点击性是否明确、图片与标题是否各有层次 |
| Dashboard Icon Animations / Aaron Iker | [Dribbble](https://dribbble.com/shots/18076128-Dashboard-Icon-Animations) | 作品页文本：标题/作者/项目 | 同一后台中icon的统一运动语言和频率 |
| Onboarding submit animation / Aaron Iker | [Dribbble](https://dribbble.com/shots/21075089-Onboarding-submit-animation) | 作品页文本：标题/作者/项目 | pending→success与真实异步结果是否一致 |
| Tab bar interaction with animated icons | [Pinterest](https://in.pinterest.com/pin/tab-bar-interaction-with-animated-icons--570690584036348214/) | 搜索索引，作品页403 | 进一步追溯原作者；不要把收藏者当作者 |
| Interactive Hover Animation for UI Design Navigation | [Pinterest](https://ph.pinterest.com/pin/interactive-hover-animation-for-ui-design-navigation--555209460293702857/) | 搜索索引，作品页抓取失败 | hover、focus、active三者如何分离 |
| Page transition in Flutter | [Pinterest](https://www.pinterest.com/pin/page-transition-in-flutter--863283822364776312/) | 搜索索引，未观看 | 前进与返回的空间关系；是否可取消 |
| Chart UI Animation by Jim Basio | [Pinterest](https://jp.pinterest.com/pin/377528381282946391/) | 搜索索引，作品页失败；作者仅由标题标示 | 共同尺度、数字真值与图形轨迹是否清楚 |

## 后续使用方式

当具体项目需要视觉参考，优先用户提供的作品；否则按所选意图从候选中筛选，能看到媒体才记录动作观察。记录来源、作者、触发、起止状态、时长/曲线估计（注明估计）、主次、频率、适用/不适用以及与项目布局/品牌的匹配。不可从静态封面推断弹簧、时序、可打断性或触屏质量。只提炼运动关系，依据当前产品状态原创实现。

本页的 Dribbble / Pinterest 媒体候选用于按需校准审美，不强制每次调用访问这两类网站或等待用户选样。React Bits / Vue Bits 代码案例库采用 [reference-libraries.md](reference-libraries.md) 的每次设计选型流程和访问降级；访问失败时继续已授权的设计与实现，说明证据边界。若用户要求精确复现特定媒体而无法看到媒体，则需要媒体内容后才能声称精确复现。
