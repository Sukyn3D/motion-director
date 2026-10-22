# 时序、物理与参数

`assets/motion-tokens.json` 是本 skill 自定起点，不是 Apple/Google/Disney 官方数值。优先使用项目与平台已有 token；仅在缺失或需调优时使用本组。

## token 用法

| 语义 | 起点 | 用法 |
|---|---|---|
| feedback | 100ms | 小效果、按下状态恢复；业务状态立即更新 |
| state | 180ms | 标签、颜色、简单显示/隐藏 |
| transition | 260ms | 小到中等容器过渡 |
| emphasis | 420ms | 低频表达；需验证不会拖慢下一步 |
| stagger gap | 24ms，累计延迟上限 120ms | 长列表只编排可见组；不要让最后一个元素等待 n×gap |

时长随尺寸、距离、输入方式及频率调整；无需让所有对象同速。入场/退出可以不同，但返回路径和层级应符合用户预期。大面积过渡首先考虑减幅与淡变，而非一味延长。

## 空间和效果分离

这是设计阶段核心合同，见[design-foundations.md](design-foundations.md)。Material体系本身有spatial和effects spring，并分fast/default/slow，不能将其误写为“Material只为空间提供弹簧”。下方Web起点的单调效果过渡是本包实现选择；在支持的目标框架可使用合法范围内无过冲的effects spring。自定productive/expressive/narrative与官方standard/expressive分别记录。

- spatial：位置、装饰缩放、旋转等可用弹簧；productive 起点 `omega=24, zeta=1`，expressive `omega=18, zeta=0.72`，narrative `omega=12, zeta=0.90`。
- effects：透明度、颜色使用 100–180ms 单调过渡，范围不越界；不复用 spatial 的带过冲输出。
- 跟随目标与手指之间不额外加长低通滤波。需要视觉拖尾时分开“真实控件位置”与“装饰追随层”。
- 即使 zeta≥1，在很大的初速度下也可能越过目标；约束控件需显式边界处理，不能只靠名为 no-bounce 的预设。

## 参数定义与转换

标量系统：`x'' + 2*zeta*omega*x' + omega²*(x-target) = 0`。omega 单位 1/s；zeta 无量纲。

物理质量 m、刚度 k、阻尼系数 c：`omega = sqrt(k/m)`，`zeta = c/(2*sqrt(k*m))`。反向：`k=m*omega²`，`c=2*zeta*m*omega`。

Compose 的 dampingRatio 是 zeta；在其单位质量模型中 stiffness 对应 omega²。其他库核查参数定义、坐标单位及版本后再转换。SwiftUI 的 duration/bounce 是感知参数，不能宣称与 omega/zeta 一一等同。GSAP elastic/back tween 是固定曲线，不等于可保留速度的物理弹簧。

## 帧率一致性

- 跟随滤波可用 `alpha = 1 - exp(-rate * dt)`，dt 用秒。`0.1` 每帧 lerp 与 `v *= 0.9` 每帧阻尼会随帧率改变。
- 改目标时延续当前 x/v。解析更新适用于一步内目标恒定的标量系统，目标持续移动时仍有采样误差；不是通用碰撞/布料求解器。
- 模拟可用本包 `scripts/spring.mjs`；复杂多体动力学使用已有求解器或固定步长，限制积压与计算量。
- 后台恢复由生命周期决定：产品过渡可直接进入当前业务状态，互动模拟可暂停恢复。不要把长时间 dt 静默夹短而让 UI 落后业务状态。
- 验证 30/60/120 Hz 相同真实时间的轨迹；也测试中途改变目标，不能只测静止端点。

## 有意义的静止

稳定信息层不做无目的循环。持续状态需要可见静态说明；自动循环有暂停/停止策略。停在末态时取消 rAF、清理监听/订阅，仅在下一次输入或状态变化时重新调度。

## 性能

优先 transform/opacity，但它们不是性能保证：图层尺寸、滤镜、纹理、DOM 数量和主线程压力同样重要。复杂布局可采用 FLIP 或框架 layout 动画；展开真实文本可能需要尺寸动画与性能测量，不能不加判断地用 scale 拉伸文字。批量读布局后批量写入，避免读写交错。按实际设备与刷新率记录帧时间；只在测量支持下说“流畅”。
