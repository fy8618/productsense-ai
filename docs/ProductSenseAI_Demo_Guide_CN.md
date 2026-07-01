# ProductSense AI｜Demo 演示指南

> 文档类型：AI Product Manager 作品集 Demo 指南  
> 适用场景：HR 初筛、产品面试、作品集讲解、项目复盘  
> Live Demo: https://productsense-ai.vercel.app  
> GitHub: https://github.com/fy8618/productsense-ai  

## 1. 文档用途

这份文档用于帮助你向 HR 或面试官演示 ProductSense AI。它不是产品需求文档，也不是技术说明书，而是一份面向作品集展示的 Demo 指南。

它主要说明：

- Demo 站点结构。
- 每个页面的功能和演示重点。
- 推荐的稳定演示路径。
- 演示时应该如何讲解产品价值。
- 如果实时 AI 接口失败，如何使用 Demo fallback 继续展示完整流程。

演示时要始终保持真实、克制的表达：ProductSense AI 是一个 AI Product Manager portfolio MVP，不是生产级 SaaS，也不是已经商业验证的产品。

## 2. 项目一句话介绍

ProductSense AI 是一个面向 AI 产品经理作品集的产品决策 Agent MVP，可将用户反馈转化为痛点、产品机会、PRD 草稿、实验方案、RICE 优先级评分和风险评估建议，并通过人在回路审核与证据追溯降低 AI 输出不可靠风险。

## 3. 在线访问方式

| 链接类型 | 地址 | 演示用途 |
| --- | --- | --- |
| Live Demo | https://productsense-ai.vercel.app | HR 和面试官优先打开这个链接，直接体验产品流程 |
| GitHub | https://github.com/fy8618/productsense-ai | 如果面试官希望查看源码、README 或实现方式，可以补充提供 |

Live Demo 是对外展示的主要入口。GitHub 是辅助材料，不需要在短时间 HR 演示中展开讲太多。

项目包含两条可展示路径：

- 真实 AI Analysis：通过服务端 API 调用配置的 AI provider，例如 Gemini、Groq 或 OpenAI-compatible endpoint。
- 稳定 Demo fallback workflow：当免费 API 出现额度、限流、billing 或服务波动时，仍然可以完整展示从用户反馈到 PRD、实验方案和风险评估的产品决策链路。

## 4. Demo 站点图 / 页面结构图

### 站点结构图

```text
ProductSense AI 首页
├── Upload：查看原始反馈输入与示例反馈
├── Dashboard：查看 Mock 分析看板与产品机会概览
│   ├── Opportunity Detail：查看具体机会、证据和 RICE 逻辑
│   ├── PRD Draft：查看 Mock PRD 草稿
│   └── Evaluation：查看 Mock 评估与风险
├── AI Analysis：输入反馈，进行真实 AI 分析或使用 Demo fallback
│   └── Use Opportunity：选择 AI 生成的产品机会
├── AI PRD：基于所选机会生成 PRD 草稿、PM Review 和实验方案
└── AI Evaluation：查看证据覆盖、风险、RICE 评分和决策历史
```

### 页面结构表

| 页面名称 | 页面路径 | 页面作用 | 演示重点 |
| --- | --- | --- | --- |
| 首页 | `/` | 快速说明 ProductSense AI 的定位和入口 | 强调这是 AI 产品决策 Agent 作品集 MVP，不是生产级 SaaS |
| Upload | `/upload` | 展示 mock 原始反馈和反馈输入概念 | 说明产品从真实 PM 工作中的分散反馈开始 |
| Dashboard | `/dashboard` | 展示 mock 痛点聚类、证据和机会列表 | 强调 raw feedback → pain point → evidence → opportunity 的链路 |
| Opportunity Detail | `/opportunities/[id]` | 查看具体机会、证据、RICE 和人工审核点 | 强调机会不是凭空生成，而是由证据支持 |
| PRD Draft | `/prd/[id]` | 展示 mock PRD 草稿和实验计划 | 说明 AI 可以辅助起草，但 PM 仍需审核 |
| Evaluation | `/evaluation/[id]` | 展示 mock 风险、指标和建议 | 强调风险意识和谨慎决策 |
| AI Analysis | `/ai-analysis` | 粘贴反馈，调用真实 AI 或使用 Demo fallback | 这是核心 AI workflow 入口 |
| AI PRD | `/ai-prd` | 基于所选 AI 机会生成 PRD，支持 PM Review 和 Markdown export | 展示人机协同和 PRD 产物化 |
| AI Evaluation | `/ai-evaluation` | 展示 PM-adjusted RICE、风险、证据和 Decision History | 展示 AI 产品经理的评估与风控能力 |

## 5. 每个页面功能说明

### 首页

页面作用：  
首页用于快速建立项目认知，让 HR 或面试官知道 ProductSense AI 是什么、解决什么问题，以及可以从哪里开始体验。

主要功能：

- 展示项目定位：AI Product Decision Agent。
- 展示 Portfolio MVP 说明。
- 提供进入 mock workflow 和 AI Analysis 的入口。
- 展示 mock 数据概览，例如 pain clusters、opportunities 和 sources。

演示时应该强调：

- 这是一个作品集 MVP，不是生产级 SaaS。
- 项目重点是展示 AI PM 工作流设计，而不是做一个通用 chatbot。
- 产品目标是把分散反馈变成可审核的产品决策材料。

体现的 AI 产品经理能力：

- 产品定位表达。
- 问题定义。
- MVP 范围控制。
- 面向非技术评审的清晰沟通。

### Upload

页面作用：  
Upload 页面展示原始反馈输入的概念，并通过 prepared mock feedback 让演示路径稳定可复现。

主要功能：

- 展示反馈来源，例如客服工单、销售通话、取消问卷、用户访谈。
- 展示 Raw feedback preview。
- 提供进入 Dashboard 的入口。

演示时应该强调：

- PM 的真实工作起点通常不是结构化需求，而是分散、混乱、带上下文缺失的反馈。
- Day 1 到后续迭代保留了 mock workflow，是为了保证即使没有 API 也能讲清产品逻辑。

体现的 AI 产品经理能力：

- 用户反馈理解。
- 产品发现流程设计。
- 用 mock data 控制 MVP 范围。

### Dashboard

页面作用：  
Dashboard 用于展示从原始反馈到痛点聚类、证据引用和产品机会的结构化过程。

主要功能：

- 展示 pain point clusters。
- 展示每个痛点的 evidence quote。
- 展示多个 prioritized opportunities。
- 点击机会进入 Opportunity Detail。

演示时应该强调：

- 产品不是直接让 AI 给一个答案，而是把判断拆成可检查步骤。
- 每个机会都需要能追溯到痛点和证据。
- RICE 是辅助排序工具，不是自动决策工具。

体现的 AI 产品经理能力：

- 产品发现。
- 信息结构化。
- 证据驱动的机会识别。
- 优先级框架设计。

### Opportunity Detail

页面作用：  
Opportunity Detail 用于查看单个产品机会的完整上下文，包括问题、目标用户、证据、RICE、假设和 PM 需要验证的问题。

主要功能：

- 展示 opportunity brief。
- 展示 RICE score 和计算逻辑。
- 展示 evidence quotes。
- 展示 human review、assumptions、open questions 和 PM verification。

演示时应该强调：

- AI 或 mock 分析只能提出候选机会，PM 需要判断是否值得进入 PRD。
- Opportunity 需要和用户证据、目标用户、实验假设绑定。

体现的 AI 产品经理能力：

- 机会评估。
- RICE 优先级理解。
- 假设识别。
- 人工审核意识。

### PRD Draft / AI PRD

页面作用：  
PRD 页面展示从机会到 PRD 草稿的转化。AI PRD 页面进一步支持 PM Review Inputs、approval status、Experiment Brief 和 Markdown Export。

主要功能：

- 展示 Problem Statement、Target User、User Stories、MVP Scope、Success Metrics、Non-goals、Edge Cases、Open Questions。
- 支持 PM 编辑关键假设、成功指标、非目标、风险和信心说明。
- 支持 Experiment Brief 编辑。
- 支持标记 Approved for prototype。
- 支持导出 PRD 为 Markdown。

演示时应该强调：

- AI 可以生成第一版结构，但 PM 必须补充业务判断。
- 项目只允许 Approved for prototype，而不是 Approved for roadmap 或 Approved for launch。
- Experiment Brief 说明 PM 不只是写需求，还要设计验证方式。

体现的 AI 产品经理能力：

- PRD 结构化能力。
- 人在回路设计。
- 实验设计。
- 负责任的 prototype approval。

### Evaluation / AI Evaluation

页面作用：  
Evaluation 页面用于展示风险、指标、RICE 调整和决策建议。AI Evaluation 页面展示更完整的 PM-adjusted RICE、Evidence Used、Decision History 和谨慎推荐。

主要功能：

- 展示 Evidence coverage。
- 展示 Unsupported claim risk。
- 展示 Confidence score。
- 支持 PM 调整 Reach、Impact、Confidence、Effort。
- 自动计算 PM-adjusted RICE score。
- 展示 Key risks、Assumptions、Open questions。
- 展示 Decision History。

演示时应该强调：

- AI 输出不是结论，而是待审核的决策材料。
- PM 需要结合业务影响、工程投入和证据强度调整 RICE。
- Evaluation 的最终建议是谨慎进入 prototype，而不是自动进入路线图。

体现的 AI 产品经理能力：

- 风险意识。
- 指标和优先级判断。
- 模型输出评估。
- 决策记录设计。

### AI Analysis

页面作用：  
AI Analysis 是真实 AI workflow 的入口，用户可以粘贴原始反馈，调用服务端 API 获得结构化产品发现结果。

主要功能：

- 输入 raw customer feedback。
- 点击 Use sample feedback 填充示例反馈。
- 点击 Analyze with AI 触发服务端 AI 分析。
- 显示 loading、error 和 result state。
- 显示 pain points、evidence quotes、opportunities、risk flags、human review notes 和 open questions。
- 支持 Use demo AI result。
- 支持选择一个 AI-generated opportunity。

演示时应该强调：

- API key 不暴露给浏览器，AI 调用发生在 server-side API route。
- 输出是 structured JSON，方便后续页面稳定复用。
- 如果免费 API 不稳定，可以使用 Demo fallback 完成展示。

体现的 AI 产品经理能力：

- AI workflow design。
- Structured output design。
- 异常兜底设计。
- 人机协同流程设计。

### Evidence Used

页面作用：  
Evidence Used 用来展示每条 quote 支持的 pain point 和 opportunity。

主要功能：

- 标记证据来源是 user-provided evidence 还是 demo fallback evidence。
- 展示 quote。
- 展示 quote 支持的 pain point。
- 展示 quote 支持的 opportunity。
- 如果没有直接证据，提示需要人工审核。

演示时应该强调：

- AI 产品不能只给结论，还要保留证据链。
- 证据追溯可以降低 AI hallucination 和 unsupported claim risk。

体现的 AI 产品经理能力：

- 证据意识。
- 风险控制。
- 可解释性设计。

### Decision History

页面作用：  
Decision History 用于展示 AI 建议如何被 PM 审核、修改和推进。

主要功能：

- 展示 AI suggested。
- 展示 PM changed。
- 展示 Current approval status。
- 展示 PM-adjusted RICE score。
- 展示 Key evidence used。
- 展示 Remaining open questions。

演示时应该强调：

- 这不是让 AI 自动决策，而是记录 AI 建议和 PM 判断之间的差异。
- Decision History 是后续做团队协作、审计日志和实验复盘的基础。

体现的 AI 产品经理能力：

- 决策透明度。
- 审核链路设计。
- 产品治理意识。

### Markdown Export

页面作用：  
Markdown Export 用于把当前 PRD、PM edits、Experiment Brief、Evidence Used 和 Human Review Reminder 转成可复制文本。

主要功能：

- 点击 Export PRD as Markdown。
- 在页面中生成 copyable Markdown。
- 可复制到 Notion、文档、作品集或产品评审材料。

演示时应该强调：

- AI 工作流最终要产生可交付产物，而不是只停留在聊天结果。
- Markdown Export 展示了从分析到文档产出的闭环。

体现的 AI 产品经理能力：

- 产物化思维。
- 产品工作流闭环。
- PM 文档能力。

### 中文 / English 切换

页面作用：  
语言切换用于展示 ProductSense AI 的轻量双语体验。

主要功能：

- 在顶部导航切换 EN / 中文。
- 选择结果保存在 localStorage。
- 刷新后保留选择。

演示时应该强调：

- 这是 lightweight localization，不是生产级 i18n。
- 双语能力体现了面向不同受众和市场的产品意识。

体现的 AI 产品经理能力：

- 国际化意识。
- 作品集表达能力。
- 产品体验细节意识。

## 6. 推荐演示路径：稳定版

这条路径适合 HR 初筛和大多数面试场景。它优先使用 Demo fallback，确保不受免费 API 额度或 provider 波动影响。

| 步骤 | 操作 | 我应该说什么 | 体现的产品能力 |
| --- | --- | --- | --- |
| 1 | 打开 Live Demo | “我先打开 ProductSense AI 的在线 Demo。这个项目是一个 AI 产品决策 Agent 作品集 MVP。” | 清晰开场和项目定位 |
| 2 | 简短介绍 ProductSense AI | “它帮助 PM 把分散客户反馈转化为痛点、机会、PRD、实验方案和风险评估。” | 产品价值表达 |
| 3 | 展示首页定位 | “首页强调这不是生产级 SaaS，而是展示 AI PM 工作流设计的 portfolio MVP。” | MVP 范围控制 |
| 4 | 切换中文模式 | “这里支持中文和 English，语言选择会保存在浏览器中。” | 双语产品体验意识 |
| 5 | 进入 AI Analysis | “AI Analysis 是真实 AI workflow 的入口，可以粘贴用户反馈并请求结构化分析。” | AI workflow 入口设计 |
| 6 | 点击 Use sample feedback | “为了节省演示时间，我使用准备好的示例反馈。” | 演示效率和场景控制 |
| 7 | 说明 Analyze with AI | “Analyze with AI 是真实 AI 分析入口，会走服务端 API，不会把 API key 暴露给浏览器。” | 技术理解和安全意识 |
| 8 | 如果 Gemini API 不可用，点击 Use demo AI result | “如果免费 API 当前不可用，我会使用 Demo fallback。它是明确标记的演示数据，不冒充真实 AI 输出。” | 异常兜底和可用性设计 |
| 9 | 选择一个产品机会 | “这里 AI 或 demo 数据给出多个机会，PM 需要选择一个进入 PRD，而不是自动进入路线图。” | 人在回路 |
| 10 | 进入 AI PRD | “AI PRD 会把选中的机会转成 PRD 草稿，但 PM 仍要补充假设、成功指标和风险。” | PRD 结构化和 PM Review |
| 11 | 展示 PM Review、PRD 草稿、Experiment Brief | “这里体现 PM 对 AI 输出的审核：可以编辑假设、实验指标、护栏指标和 rollout plan。” | 实验设计和风险意识 |
| 12 | 进入 AI Evaluation | “Evaluation 页面用于检查证据覆盖、风险、RICE 和决策历史。” | 评估体系设计 |
| 13 | 展示 RICE、风险、证据追溯、Decision History | “AI 给出的 RICE 只是方向性建议，PM 可以结合业务和工程上下文调整。” | 优先级判断和证据追溯 |
| 14 | 展示 Markdown Export | “最后可以导出 Markdown PRD，说明这个流程不只是分析，还能产出可复用文档。” | 产品闭环和产物化 |
| 15 | 总结项目亮点 | “这个项目展示的是 AI PM 如何设计可审核、可追溯、有风险控制的 AI 产品工作流。” | 作品集总结能力 |

## 7. 推荐演示路径：实时 AI 版

如果 Gemini API 或其他 provider 当前可用，可以展示实时 AI 分析路径。

推荐步骤：

1. 打开 `/ai-analysis`。
2. 点击 Use sample feedback。
3. 点击 Analyze with AI。
4. 等待 loading 完成。
5. 查看 AI-generated pain points、evidence quotes、opportunities、risk flags 和 human review notes。
6. 选择一个 opportunity。
7. 点击 Approve for PRD draft。
8. 进入 `/ai-prd` 查看 PRD 草稿、PM Review Inputs 和 Experiment Brief。
9. 进入 `/ai-evaluation` 查看 Evidence Used、PM-adjusted RICE、Decision History 和风险建议。
10. 说明 real AI output 会受到 provider、模型、quota 和 availability 影响，因此输出内容可能每次略有不同。

讲解重点：

- 实时 AI 分析证明项目不是只有静态 mock 页面。
- 结构化 JSON 输出让前端可以稳定渲染结果。
- 即使 AI 结果来自真实 provider，也必须经过 PM Review。
- 如果 live AI 输出不稳定，Demo fallback 仍能展示完整产品思路。

## 8. 如果 AI 接口失败怎么办

演示时可以这样解释：

免费 API 可能受到额度、限流、billing 或服务波动影响，这不代表页面坏了。ProductSense AI 保留 Demo fallback workflow，是为了保证作品集演示稳定，也体现 AI 产品设计中的异常处理和可用性意识。

推荐话术：

“真实 AI 分析支持 Gemini 等 provider，但为了避免免费 API 的限流、额度和服务波动影响演示，我设计了 Demo fallback，让评审仍然可以完整看到从用户反馈到 PRD、实验设计和风险评估的产品决策链路。”

演示时注意：

- 不要把 Demo fallback 说成真实 AI 输出。
- 不要打开 `.env.local`。
- 不要展示 Vercel 环境变量页面。
- 不要承诺 Gemini API 一定稳定。
- 可以强调这是负责任的演示设计，不是掩盖问题。

## 9. 面向 HR 的 2 分钟演示话术

“这个项目叫 ProductSense AI，是我为 AI 产品经理岗位准备的作品集 MVP。它解决的问题是：产品经理经常会收到很多分散的用户反馈，比如客服工单、销售通话、用户访谈和取消问卷，但这些反馈很难快速变成清晰的产品机会和 PRD。

ProductSense AI 的核心流程是：先输入原始反馈，然后通过 AI Analysis 生成痛点聚类、证据引用和产品机会。接着 PM 选择一个机会，进入 AI PRD 页面，查看 PRD 草稿、补充 PM Review 输入，并设计实验方案。最后在 AI Evaluation 页面查看 RICE、风险、证据覆盖和 Decision History。

我特别强调人在回路，因为 AI 不应该直接决定路线图。它可以帮助整理信息和生成初稿，但 PM 必须验证证据、假设和业务影响。所以这个项目里只允许 Approved for prototype，不会说 Approved for launch。

如果实时 AI 接口因为免费额度或限流暂时不可用，我也设计了 Demo fallback。它不是假装成真实 AI，而是明确标记的演示数据，保证 HR 或面试官仍然能完整看到产品决策链路。这个项目主要展示我的 AI 工作流设计、证据追溯、风险意识和 MVP 范围控制能力。”

## 10. 面向面试官的 5 分钟演示话术

“我做 ProductSense AI 的出发点是：AI 产品经理不只是会写 prompt，更重要的是能把 AI 放进真实的产品决策流程里。很多 PM 的工作起点是分散反馈，但真正有价值的是把反馈整理成可验证的痛点、可比较的机会、可执行的 PRD 和可评估的实验。

在这个项目里，我把流程拆成几个步骤。第一步是原始反馈输入，支持 sample feedback 和 mock feedback。第二步是 AI Analysis，它会请求结构化 JSON，返回 pain points、evidence quotes、opportunities、risks 和 human review notes。这里我没有做 chatbot，因为我希望用户看到的是产品工作台，而不是一段自由对话。

接下来，PM 需要选择一个 opportunity。这个选择很关键，因为 AI 只能提出候选方向，不能直接决定 roadmap。进入 AI PRD 后，系统会基于所选机会生成 PRD 草稿，但 PM 可以编辑 primary user segment、key assumption、success metric、non-goal、launch risk 和 confidence note。这里体现的是 human-in-the-loop：AI 起草，PM 审核和补充业务判断。

我还加入了 Experiment Brief，因为产品机会不应该只停留在需求描述上，还需要验证方式。PM 可以编辑 hypothesis、primary metric、secondary metrics、guardrail metric、test design、target segment、success criteria、rollout plan、risks 和 decision rule。这说明 PM 不只是写 PRD，还要设计如何判断这个机会是否值得继续投入。

在 AI Evaluation 页面，我设计了 PM-adjusted RICE。AI 给出的 RICE 只是方向性输入，PM 可以根据业务覆盖、影响、信心和工程投入重新调整。页面也会展示 Evidence Used、unsupported claim risk、key risks、open questions 和 Decision History。这样可以避免 AI 输出看起来很完整，但其实缺少证据或忽略风险。

我刻意没有做登录、数据库、支付和团队协作，因为这个项目的目标不是做生产级 SaaS，而是集中展示 AI PM 能力：工作流拆解、结构化输出、证据追溯、人机协同、风险控制、MVP scoping 和可演示的产品闭环。如果继续迭代，我会优先增加 evidence source management、模型评估数据集、团队 audit logs、实验结果追踪和成本 / rate-limit monitoring。”

## 11. 演示时重点强调的产品能力

### 产品发现能力

- 能从分散用户反馈中识别痛点。
- 能把痛点转化为产品机会。
- 能用证据和用户片段支持判断。
- 能把机会推进到 PRD 和实验设计。

### AI 工作流设计能力

- 将 AI 能力拆成分析、结构化输出、选择机会、生成 PRD、评估风险等步骤。
- 避免把 AI 做成泛用聊天窗口。
- 使用 structured JSON 支持稳定前端展示。
- 将 AI output 和后续 PM workflow 串联起来。

### 人在回路与风险控制

- AI 输出必须经过 PM Review。
- 只允许 Approved for prototype。
- 不自动做 roadmap 或 launch decision。
- 在风险和开放问题未验证前保持谨慎建议。

### 证据追溯与产品判断

- 每个 quote 都尽量关联 pain point 和 opportunity。
- Evidence Used 帮助面试官看到判断依据。
- 无直接证据时明确提示 human review required。
- 避免把 AI 生成内容当作事实。

### MVP 范围控制

- 不做登录、支付、数据库和复杂上传。
- 保留 mock workflow 和 Demo fallback，确保演示稳定。
- 将范围集中在 AI PM 核心能力上。

### 技术理解与跨职能沟通能力

- 理解 server-side API route 和 API key 安全。
- 理解 provider switching 和 Gemini / Groq / OpenAI-compatible endpoint。
- 理解 localStorage 适合 MVP 演示，但不适合生产级多用户协作。
- 能向非技术 HR 解释产品价值，也能向面试官解释实现取舍。

### 双语产品体验意识

- 支持中文 / English 切换。
- 语言选择保存在 localStorage。
- 双语体验展示 localization awareness。
- 同时诚实说明这不是生产级 i18n。

## 12. 演示时不要这样说

- 不要说这是生产级 SaaS。
- 不要说已经商业验证。
- 不要说 AI 可以自动决定路线图。
- 不要说评估指标是真实线上效果。
- 不要说 Demo fallback 是真实 AI 输出。
- 不要夸大 Gemini API 的稳定性。
- 不要说这个项目已经有真实团队协作、权限系统或数据库持久化。
- 不要把 mock data 或 demo data 描述成真实客户数据。
- 不要打开 `.env.local`、Vercel 环境变量页面或任何 API key 相关页面。

## 13. 常见问题与回答

### 为什么要做这个项目？

因为 AI 产品经理需要展示的不只是会使用 AI，而是能把 AI 放进真实产品流程里。ProductSense AI 展示了如何从分散反馈出发，形成痛点、机会、PRD、实验方案和风险评估。

### 它和普通 ChatGPT 有什么区别？

普通 ChatGPT 更像自由对话工具，而 ProductSense AI 是产品工作流工具。它把分析结果拆成 pain points、evidence quotes、opportunities、PRD、RICE、Evaluation 和 Decision History，让 PM 可以审核和推进。

### 为什么需要人在回路？

因为 AI 输出可能缺少上下文、夸大确定性或误解证据。PM 需要验证证据、业务假设、工程投入和风险后，才能决定是否进入 prototype。

### 为什么要做证据追溯？

产品决策不能只看总结，还要知道依据来自哪里。Evidence Used 可以把 quote、pain point 和 opportunity 连起来，降低 unsupported claim risk。

### 如果 AI 输出错了怎么办？

项目不会把 AI 输出直接当结论。PM 可以返回编辑反馈、选择不同机会、修改 PRD 输入、调整 RICE，并在 Evaluation 中查看风险和开放问题。

### 为什么有 Demo fallback？

因为免费 API 可能出现额度、限流、billing 或服务波动。Demo fallback 可以保证作品集演示稳定，同时明确标记为演示数据，不冒充真实 AI 输出。

### 这个项目为什么没有登录和数据库？

这是有意的 MVP 范围控制。当前目标是展示 AI PM 工作流，不是做生产级 SaaS。登录、数据库、团队权限和审计日志适合作为后续迭代。

### 这个项目如何体现 AI 产品经理能力？

它体现了问题定义、Agent workflow decomposition、structured output、human-in-the-loop、evidence traceability、risk-aware evaluation、RICE prioritization、MVP scoping 和 portfolio storytelling。

### 后续如果继续做，你会怎么迭代？

我会优先做 evidence source management、更多反馈来源、模型评估数据集、团队协作与 audit logs、实验结果追踪、cost / rate-limit monitoring 和 production observability。

## 14. 最终演示检查清单

- [ ] Live Demo 能打开。
- [ ] 中文模式正常。
- [ ] AI Analysis 页面正常。
- [ ] Use sample feedback 能填充示例反馈。
- [ ] Use demo AI result 能跑通。
- [ ] 可以选择一个 AI-generated opportunity。
- [ ] AI PRD 能展示。
- [ ] PM Review Inputs 能展示。
- [ ] Experiment Brief 能展示。
- [ ] AI Evaluation 能展示。
- [ ] RICE 调整区域能展示。
- [ ] Evidence Used 能展示。
- [ ] Decision History 能展示。
- [ ] Markdown Export 能展示。
- [ ] GitHub 链接可访问。
- [ ] 不展示 API key。
- [ ] 不打开 Vercel 环境变量页面。
- [ ] 不展示 `.env.local`。
- [ ] 不声称项目是生产级 SaaS。
- [ ] 不把 Demo fallback 说成真实 AI 输出。

