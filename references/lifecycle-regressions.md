# 状态、蒙层与布局的回归闭环（1.0）

本规则适用于按钮/链接/滑块、模态窗口、过滤重排和新增呈现层。它补强原有合同的实施与验收，不改变产品框架、布局端点或默认动效强度。Skill 不会自动运行或修复任意网站；使用它的实现者须将通用机制接到真实家族、确认所有变体并复测。

## 1. 焦点来源与探索状态

逻辑焦点、键盘定位反馈、精确指针探索、按压和真实业务选中是独立状态。不得用 `activeElement === control`、普通 `focus` 或 `hover || focused` 持续驱动探索底色、扫光、表面抬升或滑块拇指放大。点击/触屏可能保留逻辑焦点，指针离开后探索须耗散到 idle；selected/expanded 等真实状态依然保留。不要通过每次点击后 `blur()`、移除 tabindex 或取消焦点描边来“修复”。

按项目/平台区分输入来源并结合 `:focus-visible` 或等价键盘焦点 API。range/输入控件的原生 focus-visible 启发式不一定与动作控件相同，须实测 pointer click、drag/release 和 keyboard 路径；输入框的编辑焦点不因此被禁止。程序恢复焦点继承相应工作流来源，不能凭逻辑焦点制造 hover。共享状态快照统辖相关轨道；失焦、取消、隐藏、覆盖层和卸载清理真实控制器状态。返回后根据真实命中校准，未知指针位置不恢复旧 hover。

可复用 Web 原料：`assets/runtime/input-state.mjs`。它管理输入来源与接触状态，保留原生 focus，不规定所有控件使用相同材质。不同语义可配置激活键，业务 selected 状态由产品继续管理。

验收：精确指针 hover→click→移出（不再点击任何地方）；range drag→release→移出；检查当前 logical focus 仍在但探索归零。再用 Tab/方向键与 Escape 返回确认键盘反馈存在；选中 tab 不因 pointerleave 失去选中。至少采样接触、按压与对应子图形。

## 2. 蒙层是退出完成条件

面板/媒体/正文退出与黑色遮罩分别有 effect owner。原生 `dialog::backdrop` 的消失由 `close()` 控制，不能仅给 dialog 内容加退场便宣称蒙层已动画。应动画实际 backdrop 元素、原生伪元素的受控属性或可插值背景参数；不支持时使用真实独立蒙层，不模拟一个看不见的占位。

关闭意图即时生效，关闭入口始终可靠；视觉 exit 保留蒙层与模态/滚动锁，直到本次所有可见退出轨道达到透明/不可见端点。使用 completion barrier 或共享生命周期；不能只等面板位移，不能用和曲线无关的 timeout 提前 close/unmount/display:none。空间 spring 与透明度分轨，透明度保持合法范围；重开从当前面板/alpha接续，最新 generation 取消旧销毁回调。减少动效直接完成可用终态；卸载/嵌套锁保持幂等。

可复用 Web 原料：`assets/runtime/dialog-motion.mjs`，内容进度与 backdrop alpha 分别拥有，原生 dialog 在两者完成后关闭。使用者明确适配蒙层 CSS 与业务焦点/锁，不仅复制函数名。

验收：关闭第一帧、alpha 中间值、alpha≈0 后实际 close；采样蒙层本身而非内容 opacity。半开关闭、半关重开、Esc、backdrop click、系统偏好改变，逐帧确认最后可见遮罩帧到移除帧无暗色瞬切，背景不提前可点击。

## 3. 无闪帧的布局事务

捕获当前呈现（包含已有 layout/reveal）→准备语义与出场→提交目标 DOM/约束→测自然终态→写入 inverse/入场初态→启动，是一次不可分割的可见提交。中间不能 await、requestAnimationFrame、异步 effect 或 passive effect 暴露新的自然布局；框架采用 paint 前的 layout 机制。首个可见帧必须是接续当前呈现的状态，不能先到终点再反向。整批读/写须避免一边读旧 geometry 一边让其它节点受新布局影响。

区分 survivor、new/reintroduced、outgoing。survivor 保持 key/DOM 与运动 owner，不重新出生；new/reintroduced 在显示前建立自己的正确初态；outgoing 立即从业务结果退出，但视觉只保留准确、隔离、不可点击的旧呈现。不得用近似字号/图片宽高临时拼出“替身卡片”，或加原本不存在的实色背景遮挡 survivor。快照来源几何/样式/crop 与当前帧相符，临时层不能污染业务查询、语义和事件；旧事务清理不能移除新事务的层。

视觉副本固定当前 paint，不重启 CSS 动画，也不继承真实对象的 view-transition-name / anchor-name 等运动身份；共享元素导航只认主体，不能因出场副本造成重复命名或抢锚点。

capture 中的视口像素不能直接作为在缩放祖先内的 CSS 像素；明确坐标转换。源在屏外而目标可见时用新可见呈现交接，避免从屏外远距扫过阅读区。实际容器尺寸与邻接 flow 仍连续；动画 owner 不被滚动 reveal、自动类重置或 resize抢写。正确中间态应在同一同步事务建立，rAF只是推进已建立的动画。

容器高度连续不能把子项的自然排版一起拉长：CSS Grid 的默认 align-content 会在临时大高度中拉伸 auto tracks，Flex 也可能按临时高度重新 shrink/grow。测量目标自然内容后隔离轨道分配，保持卡片/媒体自然尺寸，再让外围 flow 让位；完成后恢复原约束，恢复前后无跳动。不得仅断言容器高度平滑而漏查首帧每张卡片高度。`createNaturalHeightMotion` 只适配普通 block/simple intrinsic grid；百分比/fr 高度、stretch/flex、祖先 scale 等需要项目布局适配器，不盲套。

可复用 Web 原料：`assets/runtime/layout-transaction.mjs`（无 async 提交、真实快照、owned translate 的稳定几何）。框架采用其原生布局机制时遵守同一可见原子性，不强换成此 helper。

验收：数量减少/增加、grid↔index、半途反向，逐帧采样全部可见 survivor 的标识/geometry/alpha与真实 outgoing，不只记录最终数量或animation类。首帧不得出现错误项目、终点闪现、整区空白或跳回起点。新增正确出现不算错误闪动；计划中的旧项目 fade 必须保有真实身份和当前呈现。

## 4. 动效层几何透明

Enhancement 中，无业务 layout change 时几何端点是硬约束。新增 wrapper 会改变 direct-child 选择器、grid/flex 子项、min-content、aspect-ratio、百分比高度、margin collapse、定位上下文和 max-height 继承。先审计实际级联；默认复用现有层，不为“每个对象必须套 wrapper”破坏排版。

滚动锁补偿也须几何透明：有些平台的根 scrollbar-gutter 会改变 vw/vh 的可用计算尺寸，造成字号、间距和媒体宽度一起偏移。不要未经基线比较全站新增它；沿既有滚动锁适配器记录真实 scrollbar gap，仅在持锁时补偿并按 owner 恢复。嵌套窗口仍遵守原锁计数，不叠加两种补偿。

媒体以父约束下的真实自然尺寸、auto/max 尺寸、object-fit/crop 为准；不得把插入前 bbox 冻结成永久 aspect-ratio/height，也不得用含父 padding 的宽度推导图片比例。迟到的字体/图片、断点及中英文变化后仍遵守原约束。通过 viewport bbox 测量时明确被动效的 transform/translate 与坐标变换，避免动画反过来影响 measurement。

当无可用内层、插入层会改变布局而当前 owned transform 可隔离时，可以直接动画原媒体，并在同一同步测量阶段中中和/恢复自身 owned translate；这不是固定尺寸占位。位移的视觉范围需受原图像槽约束，不能画到邻接文字/按钮；使用现有裁切层或只裁切媒体自身的表现层，不能裁切必要内容。API/材质有冲突时改用适合的层或合法短效果，并记录原因，不偷偷重排。

验收在原版/增强版同 viewport、同数据、同字体资源状态下比较全部相关媒体和相邻caption/导航的文档框；允许明确的业务变化和受控视觉运动，不允许终态占位差异或图像绘制侵入。测试宽屏、窄屏、目标断点两侧、长文、不同图片比例、首次加载与返回；滚到详情最底部，不能只看首页卡片。恢复自然布局前后比较，异常先查级联/约束而非加全局裁切补丁。

## 交付判定

更新规则之外同时修正被采用的通用实现/样例；按更新后的 skill 重新应用到真实家族。将问题→通用约束→实现入口→复测证据记入既有合同。规则覆盖与 observed/inferred/unknown 分开：helper 单测不等于项目实测；没有实体设备/浏览器验证时明示边界。完成后保留有效反馈强度、技术栈、品牌与正确布局，提供用户可复用的调用话术。
