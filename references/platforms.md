# 平台实现指导

下列 API 选择依据官方文档；示例是适配模板。先查看项目目标版本和现有调用方式。本包未编译 Swift/Kotlin，不把片段称为已验证 App。

## Web

简单状态用 CSS transition；可取消时间动画可用 WAAPI；复杂时间轴用项目现有 GSAP/Motion；连续手势交接用现有弹簧或本包解析 helper。共享元素优先框架机制/受支持的 View Transitions，并提供普通导航 fallback。

用 `matchMedia('(prefers-reduced-motion: reduce)')` 同时处理初始值和 change。CSS 只影响 CSS 动画；rAF、Canvas、视频与库动画还需主动停止或进入终态。使用实质状态驱动动画，避免把按钮禁用绑定到 onComplete。

```css
.press-visual { transition: scale 100ms cubic-bezier(.2,0,.2,1); }
button:active .press-visual { scale: .98; }
@media (prefers-reduced-motion: reduce) {
  .press-visual { transition: none; scale: 1 !important; }
}
```

减少动效时保留按钮 active/focus 的颜色或边框反馈。结构、内容和点击区域不随 press 缩放。

自定义拖拽：pointer capture、pointercancel、键盘等价操作、touch-action 仅限制控件真实需要的轴；不要在 body 全局禁用触控滚动。已动画的对象重定向时先读取/保留呈现状态，不直接跳回初始 keyframe。WAAPI cancel 前处理当前样式与状态，避免清掉 fill 后闪回。

不要凭记忆硬编码新 CSS 动效 API 的浏览器支持版本。对 `animation-timeline`、`linear()`、View Transitions 用能力检测、fallback 和目标浏览器检查。

## SwiftUI / iOS

优先系统 Button、Toggle、Sheet 与 Navigation，保留平台交互。按目标系统版本选择 `.smooth` / `.snappy` / `.spring(duration:bounce:)` 等，读取 `accessibilityReduceMotion`；项目需要兼容旧版时用对应旧 API。

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
@State private var expanded = false

// iOS 17+ 示例；duration/bounce 是本项目起点，不是 HIG 固定数值。
private func toggleExpanded() {
    withAnimation(reduceMotion ? nil : .spring(duration: 0.28, bounce: 0)) {
        expanded.toggle()
    }
}
```

手势中采用直接位移，松手后进入动画状态；不要每帧创建完整导航/业务树。验证中途再拖、系统返回、动态字体、VoiceOver 焦点、旋转与后台恢复。颜色/透明度单独受控，真实数据变更立即传播。多个 `.animation(value:)` 作用域要清楚，避免整个子树无意参与动画。

UIKit 自定义场景按项目使用 `UIViewPropertyAnimator` 或物理动画；不是把 SwiftUI snippet 直接移植。保留系统 Reduce Motion 和导航惯例。

## Compose / Android

若项目版本支持 Material 3 MotionScheme，优先使用该版本的 standard/expressive scheme 与 spatial/effects tokens；不绕过组件原有动效。需要自定时用 Compose spring 的 dampingRatio/stiffness 定义，不能把 Web damping 系数直接传入。

```kotlin
// 依赖现有 Compose animation-core；reduceMotion 由产品动效偏好层提供。
val offset by animateFloatAsState(
    targetValue = if (expanded) 1f else 0f,
    animationSpec = if (reduceMotion) snap() else spring(
        dampingRatio = 1f,
        stiffness = 576f // omega=24 的单位质量起点
    ),
    label = "panel-progress"
)
```

`animate*AsState` 适用于状态重定向；需要显式停止、控制手势速度和 suspend 生命周期时选择 `Animatable`，并核查当前 API 的取消/速度行为。分开空间、透明度与布局轨道。

减少动效来自可测试的偏好层，结合 Android/Compose 当前版本的系统动画时长策略及产品设置，核验零时长和运行时变更；不要声称 Android 有与 iOS 完全相同的通用 Reduce Motion API。TalkBack、键盘焦点、系统返回/预测返回、列表稳定 key 都进入验收。

## 跨平台一致性

一致的是用途、主次和状态结果，具体曲线和原生手势可遵循各平台。建立语义 token → 平台实现映射；不要为了三端逐像素相同替换掉优秀原生组件。App 真机验收至少包含一台实际目标设备及系统动效偏好设置，未测则标记未测。

## 本版跨端覆盖与连续复合合同

Web的pagehide须区分persisted：进入浏览器往返缓存时暂停资源，不能当成永久卸载后留下失效监听器；pageshow恢复控制器/测量或采用保留并恢复策略。单独测真正卸载和返回恢复；模拟事件只证明处理分支，实际往返缓存命中须另外记录。原生App同样区分后台暂停、恢复与最终销毁。

Web、SwiftUI、Compose都按coverage.md覆盖出现/离开、可支持的hover、focus、press/cancel、状态/icon以及滚动进退；强度遵循平台，不把桌面悬停搬到触屏。原生按下/选中反馈可以native-verified，但也查组出现和子图标变化；缺失部分在现有组件上补齐而非替换其语义。

输入跟手与释放交接分开；Compose需要手势速度和显式取消时使用工程现有Animatable路径，SwiftUI/ UIKit按目标版本用可打断系统机制。滚动可见进退和复合子层应与Lazy/复用身份、焦点、系统返回共存；Web范例不能证明原生实现已经可编译。
