# ProductSense AI｜AI 产品决策 Agent 作品集项目介绍

> 作品集定位：AI Product Manager Portfolio MVP  
> 项目形态：可点击的产品工作流原型 + 可选真实 AI Analysis 工作流  
> Live Demo: https://productsense-ai.vercel.app  
> GitHub: https://github.com/fy8618/productsense-ai  

## 1. 项目概览

| 项目项 | 说明 |
| --- | --- |
| 项目名称 | ProductSense AI |
| 项目类型 | AI 产品决策 Agent 作品集 MVP |
| 项目定位 | 帮助 PM 将分散的客户反馈转化为可审核的产品机会、PRD 草稿、实验方案和风险评估 |
| 目标用户 | AI Product Manager、Growth PM、Associate PM、需要处理大量反馈的早期产品团队 |
| 核心价值 | 把“原始反馈”转成“有证据、有优先级、有人审、可导出”的产品决策材料 |
| 在线体验 | https://productsense-ai.vercel.app |
| GitHub | https://github.com/fy8618/productsense-ai |

ProductSense AI 是一个面向 AI 产品经理岗位的作品集 MVP。它不是生产级 SaaS，也不声称能自动替代 PM 做路线图决策。项目重点展示的是：如何把 AI 能力拆解进真实产品发现流程，并通过 PM Review、证据追溯、RICE 调整、风险评估和 Markdown PRD 导出，让 AI 输出变得更可审核、更适合产品决策。

## 2. 项目背景

产品经理经常需要从客服工单、销售通话、用户访谈、取消问卷和仪表盘反馈中判断“用户真正的问题是什么”。这些信息通常分散、格式不统一，而且很难快速整理成可用于评审的产品机会。

在 AI 产品场景中，另一个关键问题是：AI 可以很快生成总结和建议，但它也可能缺少证据、夸大确定性，或者把还没有验证的假设说得像事实。因此，ProductSense AI 没有把 AI 设计成“自动拍板”的工具，而是设计成一个 AI Product Decision Agent：先整理反馈和机会，再把关键判断交回给 PM 审核。

这个项目也考虑了作品集展示中的现实问题：免费 API、模型额度、provider availability 和 rate limit 可能影响现场演示。因此项目保留了稳定的 Demo fallback workflow，确保即使没有可用 API credits，也能完整展示产品工作流。

## 3. 产品目标

ProductSense AI 的目标不是构建一个复杂平台，而是用清晰、可运行的 MVP 展示 AI PM 工作流设计能力：

- 从原始用户反馈中提取痛点和用户片段。
- 将痛点转化为可评估的产品机会。
- 保留 Evidence Used，让每个建议可以追溯到用户反馈。
- 生成初步 PRD 草稿，但要求 PM 补充业务背景和假设。
- 设计 Experiment Brief，帮助 PM 验证假设、指标和 rollout plan。
- 使用 RICE 进行优先级评估，并允许 PM 调整 Reach、Impact、Confidence、Effort。
- 输出风险、开放问题和谨慎的决策建议。
- 保留 human-in-the-loop，不自动做 roadmap、launch 或 investment decision。

## 4. 核心流程

ProductSense AI 的核心流程可以概括为：

1. 原始反馈输入  
   用户可以在 AI Analysis 页面粘贴客服工单、访谈记录、销售通话或问卷反馈；也可以使用 mock workflow 查看准备好的反馈样本。

2. AI Analysis  
   服务端 API 将反馈发送给配置的 OpenAI-compatible provider，请求结构化 JSON 输出，包括痛点、证据、机会、RICE-style 字段、风险和人工审核问题。

3. 痛点聚类  
   系统将反馈整理为 pain point clusters，并显示严重程度、频率信号、用户片段和证据引用。

4. 机会识别  
   系统展示多个产品机会，每个机会关联痛点、目标用户、证据和 RICE-style 优先级信息。

5. 证据追溯  
   Evidence Used 模块展示 quote 支持了哪个 pain point 和 opportunity，帮助 PM 避免脱离用户证据的判断。

6. PM Review  
   AI 输出不会直接进入路线图。PM 需要查看 assumptions、open questions 和 human review warning，并选择一个机会继续。

7. AI PRD  
   被选中的机会进入 AI PRD 页面。页面使用结构化结果和 deterministic templates 生成 PRD 草稿，不再额外调用 AI。

8. Experiment Brief  
   PM 可以编辑 Hypothesis、Primary metric、Guardrail metric、Test design、Target segment、Success criteria、Rollout plan、Risks 和 Decision rule。

9. RICE 调整  
   在 AI Evaluation 页面，PM 可以调整 Reach、Impact、Confidence、Effort，并看到 PM-adjusted RICE score。

10. AI Evaluation  
    页面汇总 Evidence coverage、Unsupported claim risk、Confidence score、Human review required、Key risks、Open questions 和谨慎的 prototype recommendation。

11. Markdown Export  
    在 AI PRD 页面，PM 可以导出当前 PRD、PM edits、Experiment Brief、Evidence Used 和 Human Review Reminder 为 Markdown。

12. Demo fallback workflow  
    如果 provider quota、billing 或 temporary availability 影响 live AI，用户可以使用清晰标记的 Demo AI result 完成同一条产品流程。

## 5. 核心功能模块

### 中文 / English 双语模式

项目支持轻量级中文 / English UI toggle。语言选择保存在浏览器 localStorage 中，刷新后仍会保留。中文模式和英文模式都有对应的 mock data、demo fallback data 和主要 UI 文案。这个实现用于展示 localization awareness，不是生产级 i18n 框架。

### AI Analysis

AI Analysis 页面允许用户粘贴原始反馈、使用 sample feedback、调用服务端 API，并查看结构化分析结果。页面包含 loading state、error state、human review warning 和 demo fallback 入口。

### Demo fallback result

由于作品集演示常受到 API credits、quota、billing 或 provider availability 影响，项目提供了 Demo fallback result。它被明确标记为 demo fallback data，不会冒充 live AI output。

### Mock dashboard

Mock workflow 保留了从上传反馈到 dashboard、opportunity detail、PRD 和 evaluation 的稳定演示路径。它适合没有 API 的场景，也方便 HR 或面试官快速理解产品逻辑。

### Opportunity detail

机会详情页展示 pain point、target segment、evidence quotes、RICE score、experiment plan、human review notes 和风险信息，强调产品机会不是从 AI 文案里凭空产生，而是由反馈链路支持。

### AI PRD

AI PRD 页面展示 selected opportunity 的 PRD 草稿，包括 Problem Statement、Target User、User Stories、MVP Scope、Success Metrics、Non-goals、Edge Cases 和 Open Questions。PM 可以编辑 review inputs，并控制 approval status。

### AI Evaluation

AI Evaluation 页面让 PM 调整 RICE 输入，并查看 evidence coverage、unsupported claim risk、confidence score、key risks、assumptions、open questions 和 cautious recommendation。

### Evidence Used

Evidence Used 模块在 AI Analysis、AI PRD 和 AI Evaluation 中重复出现，用来展示每条 quote 支持了哪个痛点和机会。如果没有直接证据，系统会提示 human review required。

### Decision History

Decision History 展示 AI suggested、PM changed、current approval status、PM-adjusted RICE score、key evidence used 和 remaining open questions，体现 AI 建议如何被 PM 审核和修改。

### Markdown export

PRD 可以导出为 Markdown，方便放入 Notion、文档、作品集或后续产品评审材料。

### Provider switching through environment variables

项目通过 `.env.local` 中的 `AI_PROVIDER`、`AI_API_KEY`、`AI_MODEL`、`AI_BASE_URL` 支持 OpenAI-compatible providers，例如 OpenAI、Groq 和 Gemini OpenAI-compatible endpoint。API key 只在服务端使用，不暴露给浏览器。

## 6. AI 产品设计亮点

### Agent workflow decomposition

ProductSense AI 把一个复杂的 PM 判断过程拆成多个可审核步骤：反馈输入、痛点聚类、机会识别、PRD 草稿、实验设计、RICE 调整、风险评估和导出。这比单一 chatbot 更接近真实产品工作流。

### Human-in-the-loop

系统不把 AI 输出当作最终答案。PM 必须选择机会、编辑假设、调整指标、查看风险，并只能标记为 “Approved for prototype”，而不是 “Approved for roadmap” 或 “Approved for launch”。

### Evidence traceability

每个机会都尽量保留 evidence quotes。用户可以看到 quote 支持的痛点和机会，降低 unsupported claim risk。

### Structured AI output

AI route 要求 provider 返回固定 JSON shape，使前端能够稳定展示 painPoints、opportunities、risks 和 humanReview。即使部分 provider 不支持 strict structured output，系统也会请求 valid JSON 并进行解析和校验。

### Risk-aware recommendation

项目把风险和开放问题放在决策流程中，而不是只展示“看起来正确”的建议。AI Evaluation 页面默认给出谨慎建议：只在 PM review 和 evidence validation 后进入 prototype。

### Fallback design

Demo fallback 是一个面向作品集展示的产品设计取舍。它保证现场演示不会因为 quota、billing 或 provider temporary failure 中断，同时明确标注数据来源。

### Bilingual product experience

项目支持中文和 English 两种 UI 模式，体现了面向不同市场和受众的 localization awareness。

### Responsible MVP scoping

项目没有添加登录、支付、数据库、复杂文件上传或团队协作，而是把范围集中在 AI PM 最关键的能力展示上：工作流设计、证据、风险、人审和可解释决策。

## 7. 产品决策与取舍

为了保持 MVP 聚焦，ProductSense AI 有意识地没有构建以下能力：

- Login system：当前目标是作品集演示，不需要用户账户。
- Database：AI workflow 数据保存在浏览器 localStorage 中，降低复杂度。
- Payment：项目不是商业 SaaS，不需要付费流程。
- Multi-user collaboration：团队权限和协作审计是后续阶段能力。
- Production-grade analytics：当前指标用于说明评估思路，不是生产 benchmark。
- Fully autonomous roadmap decisions：产品定位强调 PM 审核，不让 AI 自动决定 roadmap。
- Linear integration：第三方工作流集成会增加复杂度，暂不属于 MVP 重点。
- Complex file upload：当前使用粘贴文本和 mock feedback，优先验证核心分析流程。

这些取舍帮助项目更清晰地展示 AI Product Manager 的核心思路：先证明正确的产品流程，再考虑生产级基础设施。

## 8. 技术实现概览

| 技术/实现 | 作用 |
| --- | --- |
| Next.js / React | 构建页面路由和交互式工作流 |
| TypeScript | 让数据结构和组件输入更清晰 |
| Tailwind CSS | 快速实现简洁一致的 UI |
| Server-side AI API route | 在服务端调用 provider，避免 API key 暴露到浏览器 |
| OpenAI-compatible provider configuration | 通过环境变量切换 OpenAI、Groq、Gemini 等 provider |
| Gemini support | 可使用 Gemini 的 OpenAI-compatible endpoint 进行尝试 |
| Browser localStorage | 保存 selected AI workflow、PM edits、approval status、RICE inputs 和 language preference |
| Structured JSON parsing and validation | 保持 AI 输出形状稳定，便于前端渲染和错误处理 |
| Lightweight localization | 用简单 translation dictionary 和 localized data 支持中文 / English |
| Markdown export | 将 PRD 和 PM edits 转为可复制的 Markdown 文档 |

这部分实现强调“PM 需要理解 AI 产品如何落地”，而不是展示复杂工程架构。项目没有添加数据库、认证、支付或大型状态管理库。

## 9. 可展示能力

### 产品能力

- 将模糊的用户反馈问题定义为清晰的产品发现工作流。
- 设计从 pain point 到 opportunity、PRD、experiment 和 evaluation 的闭环。
- 使用 RICE、success metrics、guardrail metrics 和 open questions 辅助优先级判断。
- 明确 MVP scope，并避免不必要的复杂功能。

### AI 产品能力

- 设计结构化 AI output，而不是依赖自由文本回答。
- 将 AI 建议放入 human-in-the-loop 审核流程。
- 通过 evidence traceability 降低 AI hallucination 和 unsupported claim risk。
- 设计 provider fallback 和 demo fallback，提升演示稳定性。
- 让 AI workflow 支持中英文结果和用户体验。

### 技术理解能力

- 理解服务端 API route、环境变量、API key 安全和 provider configuration。
- 能用 TypeScript 描述 AI 分析结果的数据结构。
- 理解 localStorage 适合作品集 MVP，但不适合生产级多用户数据。
- 能把 PRD、RICE、evaluation、Markdown export 等 PM 概念转化为可点击产品原型。

### 沟通与作品集表达能力

- 能把项目定位清楚表达为 portfolio MVP，而不是夸大成生产级产品。
- 能解释 AI 为什么需要 PM 审核和证据验证。
- 能为 HR、面试官和产品团队讲清楚产品价值、范围和限制。
- 能准备 demo script、case study 和 QA checklist，提升展示完整度。

## 10. 项目限制

ProductSense AI 当前仍然是作品集 MVP，有以下限制：

- 不是生产级 SaaS，没有企业级认证、权限、审计和数据隔离。
- Live AI Analysis 依赖 provider availability、quota、billing、rate limit 和模型响应质量。
- Demo fallback 用于稳定演示，不代表真实用户数据或真实模型评估结果。
- Browser storage 仅保存在当前浏览器，不支持跨设备同步或团队协作。
- 目前没有真实商业用户验证，也没有真实 A/B test 结果。
- Evaluation metrics 是 illustrative，不是 production benchmark。
- AI PRD 和 Experiment Brief 使用 deterministic templates，没有额外 AI 生成步骤。
- Lightweight localization 能展示双语体验，但不是完整生产级 i18n 系统。
- 项目不会也不应该声称可以自动做 roadmap、launch 或 investment decision。

## 11. 后续规划

后续可以沿着“更真实的数据、更可靠的评估、更完整的协作”方向推进：

- 支持更多反馈来源，例如 CSV、客服系统导出、访谈记录和销售 CRM notes。
- 引入 evidence source management，为每条 quote 建立稳定 source ID。
- 允许 PM 手动 include / exclude evidence，形成更可控的分析样本。
- 建立 model evaluation dataset，比较不同 provider 和 prompt 的质量。
- 增加团队协作、角色权限和 audit logs。
- 追踪实验结果，把 prototype outcome 回写到 decision history。
- 增加 cost、quota、rate-limit monitoring 和 provider observability。
- 进一步完善生产级 i18n、错误处理、隐私和数据安全设计。
- 在 PM 明确批准后，才考虑 Linear、Notion 或 Jira 等工具集成。

## 12. 简历可用项目描述

### 中文简历项目描述

ProductSense AI 是一个 AI Product Manager 作品集 MVP，用于将分散客户反馈转化为可追溯的痛点聚类、产品机会、PRD 草稿、实验方案、RICE 优先级和风险评估，并保留 PM 审核机制。

### 中文简历 bullet points

- 设计 AI 产品决策 Agent 工作流，将原始反馈拆解为痛点聚类、证据引用、产品机会、PRD 草稿、实验方案和风险评估。
- 引入 human-in-the-loop 审核机制，要求 PM 验证假设、证据、RICE 输入和 prototype approval，避免 AI 自动做路线图决策。
- 建立 evidence traceability 体验，将用户 quote 与 pain point、opportunity 和 evaluation 关联，降低无依据主张风险。
- 规划 demo fallback 与 provider switching 方案，使作品集在 API quota、billing 或 provider availability 受限时仍可完整演示。
- 以轻量 MVP 范围完成双语 UI、Markdown PRD export、PM edits 和 Decision History，展示 AI PM 的产品判断与执行能力。

### English resume project description

Built ProductSense AI, an AI Product Manager portfolio MVP that turns fragmented customer feedback into traceable pain points, product opportunities, PRD drafts, experiment briefs, RICE prioritization, and risk-aware recommendations with human review.

### English resume bullet points

- Designed an AI Product Decision Agent workflow that converts raw feedback into pain clusters, evidence quotes, product opportunities, PRD drafts, experiment briefs, and evaluation outputs.
- Added human-in-the-loop review gates so PMs validate assumptions, evidence, RICE inputs, and prototype approval before acting on AI recommendations.
- Built evidence traceability across AI Analysis, PRD, and Evaluation views to connect user quotes with pain points and opportunities.
- Scoped a resilient portfolio MVP with mock workflow, demo fallback, and provider switching for OpenAI-compatible alternatives such as Gemini and Groq.
- Communicated AI product tradeoffs through bilingual UI, Markdown PRD export, decision history, risk controls, and honest MVP limitations.

Live Demo: https://productsense-ai.vercel.app  
GitHub: https://github.com/fy8618/productsense-ai

