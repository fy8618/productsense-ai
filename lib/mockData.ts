export type PainCluster = {
  id: string;
  name: string;
  severity: "High" | "Medium" | "Low";
  mentions: number;
  trend: string;
  summary: string;
  segments: string[];
  evidence: string[];
};

export type Opportunity = {
  id: string;
  title: string;
  painPointId: string;
  relatedPainPoint: string;
  evidenceQuotes: string[];
  evidenceSummary: string;
  problem: string;
  targetSegment: string;
  rice: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    score: number;
  };
  expectedOutcome: string;
  prdDraft: {
    title: string;
    problemStatement: string;
    targetUser: string;
    objective: string;
    userStories: string[];
    mvpScope: string[];
    successMetrics: string[];
    nonGoals: string[];
    edgeCases: string[];
    openQuestions: string[];
  };
  experimentPlan: {
    hypothesis: string;
    audience: string;
    duration: string;
    variants: string[];
    guardrails: string[];
  };
  risks: { label: string; level: "High" | "Medium" | "Low"; detail: string }[];
  evaluation: {
    aiReview: { name: string; value: string; detail: string }[];
    metrics: { name: string; baseline: string; target: string; owner: string }[];
    recommendation: string;
    recommendationDetail: string;
  };
  humanReview: {
    riskLevel: "High" | "Medium" | "Low";
    assumptions: string[];
    openQuestions: string[];
    pmVerification: string[];
  };
};

export const rawFeedbackPreview = [
  {
    source: "Support ticket",
    segment: "New mobile buyer",
    quote: "I was ready to pay, but I could not tell if the item would arrive before my trip."
  },
  {
    source: "Cancellation survey",
    segment: "High-intent shopper",
    quote: "The total changed after shipping and taxes, so I decided to compare other stores first."
  },
  {
    source: "Sales call note",
    segment: "Team admin",
    quote: "The setup flow looked polished, but the buyer did not understand the value before inviting teammates."
  },
  {
    source: "User interview",
    segment: "Mobile shopper",
    quote: "The return policy opened in another tab and I lost my checkout progress."
  },
  {
    source: "Support ticket",
    segment: "Growth PM",
    quote: "The dashboard shows conversion dropped, but I still need to explain what likely caused it."
  },
  {
    source: "Cancellation survey",
    segment: "First-time admin",
    quote: "I stopped during onboarding because I was not sure which setup step mattered most."
  }
];

export const feedbackSources = [
  "128 support tickets from the last 30 days",
  "42 sales call notes from mid-market prospects",
  "89 cancellation survey responses",
  "24 user interview highlights"
];

export const painClusters: PainCluster[] = [
  {
    id: "checkout-friction",
    name: "Checkout confidence drops near payment",
    severity: "High",
    mentions: 86,
    trend: "+18% month over month",
    summary: "Users hesitate before submitting payment because shipping dates, return terms, and total cost feel scattered across the flow.",
    segments: ["New buyers", "Mobile shoppers", "High-intent trial users"],
    evidence: [
      "I wanted to buy, but I could not tell when it would arrive until the very end.",
      "The return policy link opened a new tab and I lost my place on mobile.",
      "The final price changed after shipping, so I paused and compared other options."
    ]
  },
  {
    id: "onboarding-friction",
    name: "Onboarding asks too much before value is clear",
    severity: "Medium",
    mentions: 54,
    trend: "+7% month over month",
    summary: "New users are asked to configure preferences and invite teammates before they understand the core product value.",
    segments: ["Self-serve teams", "First-time admins"],
    evidence: [
      "I was not sure why I had to invite people before seeing a useful workspace.",
      "The setup checklist looked professional, but I did not know which step mattered first."
    ]
  },
  {
    id: "reporting-context",
    name: "Reporting lacks decision-ready context",
    severity: "Medium",
    mentions: 39,
    trend: "Flat",
    summary: "PM and growth users can see metrics, but they struggle to connect changes in the chart to user behavior or recommended next steps.",
    segments: ["Growth PMs", "Customer success leads"],
    evidence: [
      "The dashboard tells me conversion is down, but not what changed in the journey.",
      "I still export data to explain the story to leadership."
    ]
  }
];

export const opportunities: Opportunity[] = [
  {
    id: "checkout-friction",
    title: "Opportunity: Reduce checkout uncertainty before payment",
    painPointId: "checkout-friction",
    relatedPainPoint: "Checkout confidence drops near payment",
    evidenceQuotes: [
      "I wanted to buy, but I could not tell when it would arrive until the very end.",
      "The return policy link opened a new tab and I lost my place on mobile.",
      "The final price changed after shipping, so I paused and compared other options."
    ],
    evidenceSummary: "86 related mentions, strongest signal from new mobile buyers near the payment step.",
    problem: "Customers need delivery timing, return terms, and final cost visible together before they feel ready to pay.",
    targetSegment: "New mobile buyers with items above $75 cart value",
    rice: { reach: 7200, impact: 3, confidence: 82, effort: 4, score: 443 },
    expectedOutcome: "Increase checkout completion by 4-6% and reduce pre-purchase support tickets.",
    prdDraft: {
      title: "Payment Confidence Panel",
      problemStatement: "New mobile buyers hesitate at the payment step because delivery date, return terms, and final cost are separated across checkout.",
      targetUser: "New mobile buyers with cart value above $75 who have not purchased before.",
      objective: "Help high-intent shoppers make a confident payment decision by showing delivery estimate, return policy, and final cost in one compact checkout panel.",
      userStories: [
        "As a new buyer, I want to see the estimated delivery date before paying so I know whether the order meets my timeline.",
        "As a mobile shopper, I want a plain-English return summary so I do not lose checkout progress.",
        "As a high-intent shopper, I want the final cost visible near the payment button so I can submit with confidence."
      ],
      mvpScope: [
        "Add one confidence panel above the payment button.",
        "Show delivery estimate, return summary, and final price breakdown.",
        "Track panel views, return-link clicks, and payment submissions."
      ],
      successMetrics: [
        "Checkout completion rate increases from 61% to 65% for new mobile buyers.",
        "Pre-purchase support tickets about shipping and returns decrease by 12%.",
        "No negative movement in average order value or refund rate."
      ],
      nonGoals: [
        "Do not redesign the full checkout flow in this prototype.",
        "Do not add personalized AI recommendations yet.",
        "Do not change payment processor logic."
      ],
      edgeCases: [
        "Delivery estimate is unavailable or delayed by fulfillment data.",
        "User has a discount, gift card, or split shipment.",
        "Return policy differs by item category."
      ],
      openQuestions: [
        "Which delivery estimate source is reliable enough for checkout?",
        "What return-policy language reduces uncertainty without increasing refunds?",
        "Should the panel be expanded by default on small mobile screens?"
      ]
    },
    experimentPlan: {
      hypothesis: "If checkout confidence information is visible at the moment of payment, more new mobile buyers will complete checkout without needing support.",
      audience: "50% of new mobile buyers with cart value above $75",
      duration: "Two weeks or until 12,000 eligible sessions",
      variants: ["Control: current checkout", "Treatment: payment confidence panel"],
      guardrails: ["Refund rate", "Payment error rate", "Page load time", "Support ticket sentiment"]
    },
    risks: [
      { label: "Metric risk", level: "Medium", detail: "A conversion lift may hide an increase in refunds if delivery expectations are too optimistic." },
      { label: "UX risk", level: "Low", detail: "The panel could crowd smaller screens unless the layout is compact and tested on mobile." },
      { label: "Operational risk", level: "Medium", detail: "Delivery estimates must stay synced with fulfillment data to avoid customer trust issues." }
    ],
    evaluation: {
      aiReview: [
        { name: "Evidence coverage", value: "Strong", detail: "Supported by tickets, surveys, interviews, and call notes." },
        { name: "Unsupported claim risk", value: "Medium", detail: "Causality still needs validation with funnel data." },
        { name: "Human review required", value: "Yes", detail: "PM should verify assumptions before roadmap commitment." },
        { name: "Confidence score", value: "82%", detail: "High confidence for discovery direction, not yet for launch impact." },
        { name: "Time saved estimate", value: "6-8 hours", detail: "Estimated reduction in manual clustering and first-draft PRD work." },
        { name: "Decision recommendation", value: "Proceed", detail: "Move to prototype and instrumented A/B test with guardrails." }
      ],
      metrics: [
        { name: "Checkout completion", baseline: "61%", target: "65%", owner: "Growth PM" },
        { name: "Shipping question tickets", baseline: "420 / month", target: "370 / month", owner: "Support Ops" },
        { name: "Refund rate", baseline: "5.1%", target: "No increase", owner: "Product Analytics" },
        { name: "Mobile checkout load time", baseline: "2.4s", target: "Under 2.6s", owner: "Engineering" }
      ],
      recommendation: "Proceed to prototype and instrumented A/B test.",
      recommendationDetail: "The opportunity is evidence-backed, narrow enough for a first iteration, and measurable with clear guardrails."
    },
    humanReview: {
      riskLevel: "Medium",
      assumptions: [
        "Checkout uncertainty is a major driver of abandonment for new mobile buyers.",
        "Delivery and return information can be shown accurately before payment.",
        "A compact panel will increase confidence without slowing checkout."
      ],
      openQuestions: [
        "Are the quoted users representative of the broader buyer population?",
        "Can fulfillment data provide reliable delivery dates at checkout?",
        "Could clearer return terms increase risky purchases or refunds?"
      ],
      pmVerification: [
        "Validate the pain point with checkout analytics and session recordings.",
        "Confirm support-ticket volume for shipping, returns, and total-cost confusion.",
        "Review legal and operations constraints before writing final copy."
      ]
    }
  },
  {
    id: "onboarding-friction",
    title: "Replace setup checklist with first-value onboarding",
    painPointId: "onboarding-friction",
    relatedPainPoint: "Onboarding asks too much before value is clear",
    evidenceQuotes: [
      "I was not sure why I had to invite people before seeing a useful workspace.",
      "The setup checklist looked professional, but I did not know which step mattered first.",
      "I wanted to understand the product before asking my team to join."
    ],
    evidenceSummary: "54 related mentions from self-serve teams who stalled before seeing product value.",
    problem: "New admins need to experience a useful workspace before completing team setup tasks.",
    targetSegment: "Self-serve teams during first session",
    rice: { reach: 3100, impact: 2, confidence: 74, effort: 3, score: 153 },
    expectedOutcome: "Increase activation by helping users reach their first useful dashboard faster.",
    prdDraft: {
      title: "First-Value Onboarding Path",
      problemStatement: "New admins are asked to configure settings and invite teammates before they understand the core value of the workspace.",
      targetUser: "First-time self-serve admins creating a workspace alone.",
      objective: "Reduce setup anxiety by guiding new admins to a useful sample workspace before asking for team setup actions.",
      userStories: [
        "As a new admin, I want to see a useful workspace before inviting teammates.",
        "As a trial user, I want the setup flow to tell me which step creates value first.",
        "As a busy evaluator, I want to skip non-critical setup tasks until later."
      ],
      mvpScope: [
        "Replace the initial checklist with a guided first-value path.",
        "Show a sample workspace populated with example data.",
        "Move invite prompts after the user completes one meaningful action."
      ],
      successMetrics: [
        "First-session activation increases from 38% to 45%.",
        "Invite-step drop-off decreases by 15%.",
        "Median time to first useful workspace decreases by 25%."
      ],
      nonGoals: [
        "Do not rebuild the full onboarding architecture.",
        "Do not add role-based personalization yet.",
        "Do not require real customer data import for the first-value moment."
      ],
      edgeCases: [
        "User already has teammates ready to invite.",
        "User chooses an empty workspace instead of sample data.",
        "Admin returns from an existing invite link."
      ],
      openQuestions: [
        "Which first action best predicts activation?",
        "Should sample data be industry-specific?",
        "When is the least disruptive moment to ask for teammate invites?"
      ]
    },
    experimentPlan: {
      hypothesis: "If new admins experience a useful workspace before setup tasks, more will activate during the first session.",
      audience: "50% of new self-serve workspaces",
      duration: "Two weeks or 5,000 new workspaces",
      variants: ["Control: current setup checklist", "Treatment: first-value guided path"],
      guardrails: ["Invite completion", "Workspace creation errors", "Trial-to-paid conversion", "Support tickets about setup"]
    },
    risks: [
      { label: "Activation definition risk", level: "Medium", detail: "A faster first-value moment may not translate into retained usage." },
      { label: "Sales handoff risk", level: "Low", detail: "Moving invites later could reduce early team expansion signals." },
      { label: "Learning risk", level: "Medium", detail: "Sample data may teach the wrong workflow if it does not match real use cases." }
    ],
    evaluation: {
      aiReview: [
        { name: "Evidence coverage", value: "Moderate", detail: "Supported by surveys and interviews, with fewer behavioral analytics signals." },
        { name: "Unsupported claim risk", value: "Medium", detail: "Activation lift needs validation beyond qualitative frustration." },
        { name: "Human review required", value: "Yes", detail: "PM should align on the activation event before testing." },
        { name: "Confidence score", value: "74%", detail: "Good discovery signal, moderate uncertainty about the best first-value action." },
        { name: "Time saved estimate", value: "4-5 hours", detail: "Mock workflow saves synthesis time for onboarding research." },
        { name: "Decision recommendation", value: "Explore", detail: "Prototype the first-value flow and validate activation definition." }
      ],
      metrics: [
        { name: "First-session activation", baseline: "38%", target: "45%", owner: "Activation PM" },
        { name: "Invite-step drop-off", baseline: "34%", target: "29%", owner: "Growth Analytics" },
        { name: "Time to first value", baseline: "9 min", target: "Under 7 min", owner: "Product Design" },
        { name: "Setup support tickets", baseline: "190 / month", target: "160 / month", owner: "Support Ops" }
      ],
      recommendation: "Explore with a lightweight prototype.",
      recommendationDetail: "The pain is clear, but the team should validate which first-value action best predicts durable activation."
    },
    humanReview: {
      riskLevel: "Medium",
      assumptions: [
        "First-value clarity matters more than completing all setup tasks immediately.",
        "Sample data will help users learn without creating confusion.",
        "Moving invite prompts later will not hurt team expansion materially."
      ],
      openQuestions: [
        "Which activation event should own the experiment goal?",
        "Do self-serve users trust sample data in onboarding?",
        "Which segments still need an invite-first path?"
      ],
      pmVerification: [
        "Review onboarding funnel drop-off by step.",
        "Interview recent trial users who abandoned setup.",
        "Confirm success and sales teams agree with invite timing changes."
      ]
    }
  },
  {
    id: "reporting-context",
    title: "Add insight annotations to conversion reports",
    painPointId: "reporting-context",
    relatedPainPoint: "Reporting lacks decision-ready context",
    evidenceQuotes: [
      "The dashboard tells me conversion is down, but not what changed in the journey.",
      "I still export data to explain the story to leadership.",
      "I need suggested follow-up questions, not just another chart."
    ],
    evidenceSummary: "39 related mentions from PMs who need decision context, not just charts.",
    problem: "PMs need metric changes explained with likely user-behavior drivers and suggested follow-up questions.",
    targetSegment: "Growth PMs reviewing weekly funnel performance",
    rice: { reach: 1800, impact: 2, confidence: 68, effort: 5, score: 49 },
    expectedOutcome: "Reduce manual analysis time and improve confidence in weekly product decisions.",
    prdDraft: {
      title: "Insight Annotations for Conversion Reports",
      problemStatement: "Growth PMs can see funnel changes, but they spend too much time connecting metric movement to likely user behavior and next actions.",
      targetUser: "Growth PMs and customer success leads reviewing weekly conversion reports.",
      objective: "Add concise annotations that explain possible drivers, cite evidence, and suggest follow-up analysis.",
      userStories: [
        "As a Growth PM, I want metric changes summarized in plain language so I can decide where to investigate.",
        "As a PM presenting to leadership, I want evidence attached to each insight so I can defend recommendations.",
        "As a customer success lead, I want suggested follow-up questions so I know which accounts to inspect."
      ],
      mvpScope: [
        "Add three insight annotations to the conversion report.",
        "Show linked evidence snippets for each annotation.",
        "Include suggested follow-up questions for PM review."
      ],
      successMetrics: [
        "Weekly reporting prep time decreases by 30%.",
        "Insight usefulness rating reaches 4 out of 5 in PM review.",
        "At least 60% of annotations are marked evidence-backed by reviewers."
      ],
      nonGoals: [
        "Do not replace analytics dashboards.",
        "Do not auto-create roadmap items from annotations.",
        "Do not make causal claims without human review."
      ],
      edgeCases: [
        "Metric movement is caused by tracking changes.",
        "Data volume is too low for a reliable interpretation.",
        "Multiple funnel changes happen at the same time."
      ],
      openQuestions: [
        "How should unsupported or low-confidence annotations be labeled?",
        "Which evidence sources should be considered valid?",
        "Should annotations be visible to executives or PM-only at first?"
      ]
    },
    experimentPlan: {
      hypothesis: "If conversion reports include evidence-linked annotations, PMs will make faster and more confident weekly decisions.",
      audience: "Growth PMs reviewing weekly funnel reports",
      duration: "Four weekly reporting cycles",
      variants: ["Control: current conversion report", "Treatment: report with insight annotations"],
      guardrails: ["Incorrect insight reports", "Analyst escalation volume", "Dashboard load time", "Reviewer trust rating"]
    },
    risks: [
      { label: "Trust risk", level: "High", detail: "Users may over-trust annotations that sound confident but are not causal." },
      { label: "Data quality risk", level: "Medium", detail: "Tracking changes or sparse data can make annotations misleading." },
      { label: "Workflow risk", level: "Low", detail: "Annotations could add noise if PMs only need a quick metric scan." }
    ],
    evaluation: {
      aiReview: [
        { name: "Evidence coverage", value: "Moderate", detail: "Qualitative demand is clear, but metric interpretation needs real analytics validation." },
        { name: "Unsupported claim risk", value: "High", detail: "Annotations can sound causal without enough evidence." },
        { name: "Human review required", value: "Yes", detail: "Every recommendation should expose evidence and confidence." },
        { name: "Confidence score", value: "68%", detail: "Useful workflow direction, higher risk around accuracy and trust." },
        { name: "Time saved estimate", value: "3-6 hours", detail: "Could reduce weekly reporting prep and manual synthesis." },
        { name: "Decision recommendation", value: "Prototype carefully", detail: "Proceed only with strong confidence labels and reviewer controls." }
      ],
      metrics: [
        { name: "Reporting prep time", baseline: "4.5 hrs / week", target: "3 hrs / week", owner: "Growth PM" },
        { name: "Reviewer trust rating", baseline: "N/A", target: "4 / 5", owner: "Product Analytics" },
        { name: "Evidence-backed annotations", baseline: "N/A", target: "60%+", owner: "Data Science" },
        { name: "Incorrect insight reports", baseline: "N/A", target: "Under 5%", owner: "AI PM" }
      ],
      recommendation: "Prototype carefully with human review.",
      recommendationDetail: "This is a strong AI PM portfolio concept, but it needs explicit confidence labels to avoid unsupported claims."
    },
    humanReview: {
      riskLevel: "High",
      assumptions: [
        "PMs want interpretation in the dashboard rather than only raw metrics.",
        "Evidence-linked annotations can reduce reporting time without reducing trust.",
        "Low-confidence insights can be labeled clearly enough to prevent overreach."
      ],
      openQuestions: [
        "What evidence threshold is required before showing an annotation?",
        "Who approves annotations before leadership-facing reporting?",
        "How should the product handle conflicting signals?"
      ],
      pmVerification: [
        "Review recent weekly business reports to identify repeated manual work.",
        "Test annotation language with PMs and analysts.",
        "Define confidence labels and unsupported-claim warnings before launch."
      ]
    }
  }
];

export const selectedOpportunity = opportunities[0];

export const prdDraft = {
  title: "Payment Confidence Panel",
  problemStatement: "New mobile buyers hesitate at the payment step because delivery date, return terms, and final cost are separated across the checkout experience.",
  targetUser: "New mobile buyers with cart value above $75 who have not purchased before.",
  objective: "Help high-intent shoppers make a confident payment decision by showing delivery estimate, return policy, and final cost in one compact checkout panel.",
  userStories: [
    "As a new buyer, I want to see the estimated delivery date before paying so I know whether the order meets my timeline.",
    "As a mobile shopper, I want a plain-English return summary so I do not lose my checkout progress.",
    "As a high-intent shopper, I want the final cost visible near the payment button so I can submit with confidence."
  ],
  mvpScope: [
    "Add one confidence panel above the payment button.",
    "Show delivery estimate, return summary, and final price breakdown.",
    "Track panel views, return-link clicks, and payment submissions."
  ],
  successMetrics: [
    "Checkout completion rate increases from 61% to 65% for new mobile buyers.",
    "Pre-purchase support tickets about shipping and returns decrease by 12%.",
    "No negative movement in average order value or refund rate."
  ],
  nonGoals: [
    "Do not redesign the full checkout flow in this prototype.",
    "Do not add personalized AI recommendations yet.",
    "Do not change payment processor logic."
  ],
  edgeCases: [
    "Delivery estimate is unavailable or delayed by fulfillment data.",
    "User has a discount, gift card, or split shipment.",
    "Return policy differs by item category."
  ],
  openQuestions: [
    "Which delivery estimate source is reliable enough for checkout?",
    "What return-policy language reduces uncertainty without increasing refunds?",
    "Should the panel be expanded by default on small mobile screens?"
  ]
};

export const experimentPlan = {
  hypothesis: "If checkout confidence information is visible at the moment of payment, more new mobile buyers will complete checkout without needing support.",
  audience: "50% of new mobile buyers with cart value above $75",
  duration: "Two weeks or until 12,000 eligible sessions",
  variants: ["Control: current checkout", "Treatment: payment confidence panel"],
  guardrails: ["Refund rate", "Payment error rate", "Page load time", "Support ticket sentiment"]
};

export const riskFlags = [
  { label: "Metric risk", level: "Medium", detail: "A conversion lift may hide an increase in refunds if delivery expectations are too optimistic." },
  { label: "UX risk", level: "Low", detail: "The panel could crowd smaller screens unless the layout is compact and tested on mobile." },
  { label: "Operational risk", level: "Medium", detail: "Delivery estimates must stay synced with fulfillment data to avoid customer trust issues." }
];

export const humanReview = {
  riskLevel: "Medium",
  assumptions: [
    "Checkout uncertainty is a major driver of abandonment for new mobile buyers.",
    "Delivery and return information can be shown accurately before payment.",
    "A compact panel will increase confidence without slowing checkout."
  ],
  openQuestions: [
    "Are the quoted users representative of the broader buyer population?",
    "Can fulfillment data provide reliable delivery dates at checkout?",
    "Could clearer return terms increase risky purchases or refunds?"
  ],
  pmVerification: [
    "Validate the pain point with checkout analytics and session recordings.",
    "Confirm support-ticket volume for shipping, returns, and total-cost confusion.",
    "Review legal and operations constraints before writing final copy."
  ]
};

export const aiEvaluation = [
  { name: "Evidence coverage", value: "Strong", detail: "Top opportunity is supported by tickets, surveys, interviews, and call notes." },
  { name: "Unsupported claim risk", value: "Medium", detail: "Mock analysis suggests causality, but real funnel data is still needed." },
  { name: "Human review required", value: "Yes", detail: "PM should verify assumptions before roadmap commitment." },
  { name: "Confidence score", value: "82%", detail: "High confidence for discovery direction, not yet for launch impact." },
  { name: "Time saved estimate", value: "6-8 hours", detail: "Estimated reduction in manual clustering, quote review, and first-draft PRD work." },
  { name: "Decision recommendation", value: "Proceed", detail: "Move to prototype and instrumented A/B test with clear guardrails." }
];

export const evaluationMetrics = [
  { name: "Checkout completion", baseline: "61%", target: "65%", owner: "Growth PM" },
  { name: "Shipping question tickets", baseline: "420 / month", target: "370 / month", owner: "Support Ops" },
  { name: "Refund rate", baseline: "5.1%", target: "No increase", owner: "Product Analytics" },
  { name: "Mobile checkout load time", baseline: "2.4s", target: "Under 2.6s", owner: "Engineering" }
];

const rawFeedbackPreviewZh = [
  { source: "客服工单", segment: "首次移动端买家", quote: "我已经准备付款，但看不出商品能否在旅行前送达。" },
  { source: "取消问卷", segment: "高意向购物者", quote: "加上运费和税费后总价变了，所以我先去比较了其他商店。" },
  { source: "销售通话记录", segment: "团队管理员", quote: "设置流程看起来不错，但在邀请队友前，我还不清楚产品价值。" },
  { source: "用户访谈", segment: "移动端购物者", quote: "退货政策在新标签页打开，我因此丢失了结账进度。" },
  { source: "客服工单", segment: "增长产品经理", quote: "仪表盘显示转化下降，但我仍要自己解释可能的原因。" },
  { source: "取消问卷", segment: "首次管理员", quote: "我在引导过程中停下了，因为不知道哪个设置步骤最重要。" }
];

const feedbackSourcesZh = [
  "过去 30 天的 128 条客服工单",
  "42 条中型客户销售通话记录",
  "89 条取消问卷回复",
  "24 条用户访谈要点"
];

const painClustersZh: PainCluster[] = [
  {
    id: "checkout-friction", name: "付款前的结账信心下降", severity: "High", mentions: 86, trend: "环比上升 18%",
    summary: "用户在付款前犹豫，因为送达日期、退货条款和最终费用分散在不同位置。",
    segments: ["首次购买者", "移动端购物者", "高意向试用用户"],
    evidence: ["我想购买，但直到最后一步都不知道什么时候送达。", "退货政策链接打开了新页面，我在手机上丢失了当前位置。", "加上运费后最终价格变了，所以我暂停并比较了其他选择。"]
  },
  {
    id: "onboarding-friction", name: "用户理解价值前，引导要求过多", severity: "Medium", mentions: 54, trend: "环比上升 7%",
    summary: "新用户在理解核心价值前，就被要求配置偏好并邀请队友。",
    segments: ["自助式团队", "首次管理员"],
    evidence: ["我还没看到有用的工作区，不明白为什么要先邀请别人。", "设置清单看起来很专业，但我不知道哪一步应该先做。"]
  },
  {
    id: "reporting-context", name: "报告缺少可直接用于决策的背景", severity: "Medium", mentions: 39, trend: "趋势持平",
    summary: "产品和增长用户能看到指标，但难以把图表变化与用户行为和后续行动联系起来。",
    segments: ["增长产品经理", "客户成功负责人"],
    evidence: ["仪表盘告诉我转化下降，却没有说明用户旅程中哪里发生了变化。", "我仍然需要导出数据，才能向管理层解释完整故事。"]
  }
];

const opportunitiesZh: Opportunity[] = [
  {
    id: "checkout-friction", title: "机会：减少付款前的结账不确定性", painPointId: "checkout-friction", relatedPainPoint: "付款前的结账信心下降",
    evidenceQuotes: painClustersZh[0].evidence, evidenceSummary: "共有 86 条相关反馈，最强信号来自付款步骤附近的首次移动端买家。",
    problem: "客户需要在付款前同时看到送达时间、退货条款和最终费用。", targetSegment: "购物车金额超过 75 美元的首次移动端买家",
    rice: { reach: 7200, impact: 3, confidence: 82, effort: 4, score: 443 }, expectedOutcome: "将结账完成率提高 4%–6%，并减少购买前客服咨询。",
    prdDraft: {
      title: "付款信心信息面板", problemStatement: "首次移动端买家在付款时犹豫，因为送达日期、退货条款和最终费用分散在结账流程中。",
      targetUser: "购物车金额超过 75 美元且尚未购买过的首次移动端买家。", objective: "在一个紧凑面板中展示送达时间、退货政策和最终费用，帮助高意向用户放心付款。",
      userStories: ["作为首次购买者，我希望付款前看到预计送达日期，以确认订单符合时间安排。", "作为移动端用户，我希望看到简明的退货说明，同时保留当前结账进度。", "作为高意向购物者，我希望付款按钮附近显示最终费用，以便放心提交订单。"],
      mvpScope: ["在付款按钮上方增加一个信心信息面板。", "展示预计送达时间、退货摘要和最终费用明细。", "跟踪面板浏览、退货链接点击和付款提交。"],
      successMetrics: ["首次移动端买家的结账完成率从 61% 提高到 65%。", "运输和退货相关的购买前工单减少 12%。", "平均订单金额和退款率不出现负向变化。"],
      nonGoals: ["本次原型不重新设计完整结账流程。", "暂不增加个性化 AI 推荐。", "不修改支付处理逻辑。"],
      edgeCases: ["履约数据无法提供或延迟提供预计送达时间。", "用户使用折扣、礼品卡或存在拆分发货。", "不同商品类别适用不同退货政策。"],
      openQuestions: ["哪种送达时间数据源足够可靠？", "怎样的退货政策文案能减少不确定性而不增加退款？", "小屏幕上是否应默认展开该面板？"]
    },
    experimentPlan: {
      hypothesis: "如果在付款时展示关键信心信息，更多首次移动端买家会完成结账。", audience: "购物车金额超过 75 美元的首次移动端买家中的 50%", duration: "两周或达到 12,000 个合格会话",
      variants: ["对照组：当前结账流程", "实验组：付款信心信息面板"], guardrails: ["退款率", "支付错误率", "页面加载时间", "客服工单情绪"]
    },
    risks: [
      { label: "指标风险", level: "Medium", detail: "如果送达预期过于乐观，转化提升可能掩盖退款上升。" },
      { label: "体验风险", level: "Low", detail: "如果布局不够紧凑，面板可能挤占小屏幕空间。" },
      { label: "运营风险", level: "Medium", detail: "送达时间必须与履约数据同步，否则会损害客户信任。" }
    ],
    evaluation: {
      aiReview: [
        { name: "证据覆盖", value: "强", detail: "得到客服工单、问卷、访谈和通话记录支持。" }, { name: "无依据主张风险", value: "中", detail: "因果关系仍需通过漏斗数据验证。" },
        { name: "需要人工审核", value: "是", detail: "PM 应在产品承诺前验证假设。" }, { name: "信心分数", value: "82%", detail: "对发现方向信心较高，但尚不足以判断发布影响。" },
        { name: "预计节省时间", value: "6–8 小时", detail: "减少人工聚类和 PRD 初稿工作。" }, { name: "决策建议", value: "进入原型", detail: "开展带护栏指标的原型和 A/B 测试。" }
      ],
      metrics: [
        { name: "结账完成率", baseline: "61%", target: "65%", owner: "增长 PM" }, { name: "运输问题工单", baseline: "每月 420 条", target: "每月 370 条", owner: "客服运营" },
        { name: "退款率", baseline: "5.1%", target: "不增加", owner: "产品分析" }, { name: "移动端结账加载时间", baseline: "2.4 秒", target: "低于 2.6 秒", owner: "工程团队" }
      ],
      recommendation: "进入原型和带监测的 A/B 测试。", recommendationDetail: "该机会有证据支持、范围清晰，并可通过明确护栏指标衡量。"
    },
    humanReview: {
      riskLevel: "Medium", assumptions: ["结账不确定性是首次移动端买家放弃的重要原因。", "付款前可以准确展示送达和退货信息。", "紧凑面板能提升信心而不拖慢结账。"],
      openQuestions: ["引用反馈是否能代表更广泛的买家？", "履约数据能否在结账时提供可靠送达日期？", "更清晰的退货条款是否会增加高风险购买或退款？"],
      pmVerification: ["结合结账分析和会话回放验证痛点。", "确认运输、退货和总价问题的工单数量。", "在最终文案前审核法律和运营限制。"]
    }
  },
  {
    id: "onboarding-friction", title: "用首次价值引导替代设置清单", painPointId: "onboarding-friction", relatedPainPoint: "用户理解价值前，引导要求过多",
    evidenceQuotes: painClustersZh[1].evidence, evidenceSummary: "54 条相关反馈来自在感受到产品价值前停滞的自助式团队。",
    problem: "新管理员需要先体验有价值的工作区，再完成团队设置任务。", targetSegment: "首次会话中的自助式团队",
    rice: { reach: 3100, impact: 2, confidence: 74, effort: 3, score: 153 }, expectedOutcome: "帮助用户更快看到首个有用仪表盘，从而提高激活率。",
    prdDraft: {
      title: "首次价值引导路径", problemStatement: "新管理员在理解工作区核心价值前，就被要求配置设置并邀请队友。", targetUser: "独自创建工作区的首次自助式管理员。",
      objective: "先引导新管理员体验有用的示例工作区，再要求完成团队设置。",
      userStories: ["作为新管理员，我希望邀请队友前先看到有用的工作区。", "作为试用用户，我希望引导流程说明哪一步最先产生价值。", "作为忙碌的评估者，我希望暂时跳过非关键设置。"],
      mvpScope: ["用首次价值路径替代初始设置清单。", "展示带示例数据的工作区。", "在用户完成一次有意义的操作后再提示邀请队友。"],
      successMetrics: ["首次会话激活率从 38% 提高到 45%。", "邀请步骤流失率降低 15%。", "到达首次价值的中位时间缩短 25%。"],
      nonGoals: ["不重建完整引导架构。", "暂不增加基于角色的个性化。", "首次价值体验不要求导入真实客户数据。"],
      edgeCases: ["用户已经准备好邀请队友。", "用户选择空白工作区而非示例数据。", "管理员从已有邀请链接进入。"],
      openQuestions: ["哪个首次操作最能预测激活？", "示例数据是否需要按行业定制？", "何时请求邀请队友最不打扰用户？"]
    },
    experimentPlan: { hypothesis: "如果新管理员先体验有用工作区，更多用户会在首次会话中激活。", audience: "50% 的新自助式工作区", duration: "两周或 5,000 个新工作区", variants: ["对照组：当前设置清单", "实验组：首次价值引导"], guardrails: ["邀请完成率", "工作区创建错误", "试用转付费", "设置相关工单"] },
    risks: [{ label: "激活定义风险", level: "Medium", detail: "更快的首次价值不一定带来持续使用。" }, { label: "销售交接风险", level: "Low", detail: "延后邀请可能减少早期团队扩张信号。" }, { label: "学习风险", level: "Medium", detail: "示例数据若与真实场景不符，可能教给用户错误流程。" }],
    evaluation: {
      aiReview: [{ name: "证据覆盖", value: "中", detail: "得到问卷和访谈支持，但行为数据较少。" }, { name: "无依据主张风险", value: "中", detail: "激活提升仍需验证。" }, { name: "需要人工审核", value: "是", detail: "测试前应统一激活事件定义。" }, { name: "信心分数", value: "74%", detail: "发现信号良好，但首次价值动作仍不确定。" }, { name: "预计节省时间", value: "4–5 小时", detail: "减少引导研究的综合分析时间。" }, { name: "决策建议", value: "继续探索", detail: "用原型验证首次价值路径和激活定义。" }],
      metrics: [{ name: "首次会话激活率", baseline: "38%", target: "45%", owner: "激活 PM" }, { name: "邀请步骤流失率", baseline: "34%", target: "29%", owner: "增长分析" }, { name: "首次价值时间", baseline: "9 分钟", target: "低于 7 分钟", owner: "产品设计" }, { name: "设置相关工单", baseline: "每月 190 条", target: "每月 160 条", owner: "客服运营" }],
      recommendation: "使用轻量原型继续探索。", recommendationDetail: "痛点清晰，但团队应先验证哪个首次价值动作最能预测持续激活。"
    },
    humanReview: { riskLevel: "Medium", assumptions: ["首次价值清晰度比立即完成所有设置更重要。", "示例数据能帮助学习而不会造成困惑。", "延后邀请不会显著影响团队扩张。"], openQuestions: ["实验应以哪个激活事件为目标？", "自助式用户是否信任引导中的示例数据？", "哪些用户仍需要邀请优先路径？"], pmVerification: ["按步骤检查引导漏斗流失。", "访谈近期放弃设置的试用用户。", "确认成功和销售团队同意调整邀请时机。"] }
  },
  {
    id: "reporting-context", title: "为转化报告增加洞察注释", painPointId: "reporting-context", relatedPainPoint: "报告缺少可直接用于决策的背景",
    evidenceQuotes: painClustersZh[2].evidence, evidenceSummary: "39 条相关反馈来自需要决策背景而非更多图表的 PM。",
    problem: "PM 需要用可能的用户行为驱动因素和后续问题解释指标变化。", targetSegment: "每周查看漏斗表现的增长 PM",
    rice: { reach: 1800, impact: 2, confidence: 68, effort: 5, score: 49 }, expectedOutcome: "减少人工分析时间，提高每周产品决策信心。",
    prdDraft: {
      title: "转化报告洞察注释", problemStatement: "增长 PM 能看到漏斗变化，但需要大量时间把指标变化与用户行为和后续行动联系起来。", targetUser: "查看每周转化报告的增长 PM 和客户成功负责人。", objective: "增加简洁注释，解释可能原因、引用证据并建议后续分析。",
      userStories: ["作为增长 PM，我希望用简明语言总结指标变化，以决定调查方向。", "作为向管理层汇报的 PM，我希望每条洞察都附带证据。", "作为客户成功负责人，我希望看到后续问题，以确定要检查哪些客户。"],
      mvpScope: ["在转化报告中增加三条洞察注释。", "为每条注释展示关联证据片段。", "加入供 PM 审核的后续问题。"],
      successMetrics: ["每周报告准备时间减少 30%。", "PM 对洞察有用性的评分达到 4/5。", "至少 60% 的注释被审核者标记为有证据支持。"],
      nonGoals: ["不替代分析仪表盘。", "不根据注释自动创建路线图事项。", "未经人工审核不作因果判断。"],
      edgeCases: ["指标变化由埋点调整造成。", "数据量不足以支持可靠解释。", "多个漏斗环节同时变化。"],
      openQuestions: ["如何标记证据不足或低信心的注释？", "哪些证据来源可以被视为有效？", "注释应先仅对 PM 可见还是直接面向管理层？"]
    },
    experimentPlan: { hypothesis: "如果转化报告包含与证据关联的注释，PM 将更快、更有信心地完成每周决策。", audience: "查看每周漏斗报告的增长 PM", duration: "四个周报周期", variants: ["对照组：当前转化报告", "实验组：带洞察注释的报告"], guardrails: ["错误洞察报告", "分析师升级请求量", "仪表盘加载时间", "审核者信任评分"] },
    risks: [{ label: "信任风险", level: "High", detail: "用户可能过度信任语气自信但缺少因果证据的注释。" }, { label: "数据质量风险", level: "Medium", detail: "埋点变化或稀疏数据可能导致误导性注释。" }, { label: "流程风险", level: "Low", detail: "如果 PM 只想快速查看指标，注释可能增加噪音。" }],
    evaluation: {
      aiReview: [{ name: "证据覆盖", value: "中", detail: "定性需求清晰，但指标解释需要真实分析数据验证。" }, { name: "无依据主张风险", value: "高", detail: "证据不足时注释可能看起来像因果结论。" }, { name: "需要人工审核", value: "是", detail: "每条建议都应显示证据和信心。" }, { name: "信心分数", value: "68%", detail: "工作流方向有价值，但准确性和信任风险较高。" }, { name: "预计节省时间", value: "3–6 小时", detail: "可减少每周报告准备和人工综合时间。" }, { name: "决策建议", value: "谨慎原型", detail: "仅在有清晰信心标签和审核控制时推进。" }],
      metrics: [{ name: "报告准备时间", baseline: "每周 4.5 小时", target: "每周 3 小时", owner: "增长 PM" }, { name: "审核者信任评分", baseline: "暂无", target: "4/5", owner: "产品分析" }, { name: "有证据支持的注释", baseline: "暂无", target: "60% 以上", owner: "数据科学" }, { name: "错误洞察报告", baseline: "暂无", target: "低于 5%", owner: "AI PM" }],
      recommendation: "在人工审核下谨慎制作原型。", recommendationDetail: "该方向适合 AI PM 场景，但必须使用明确的信心标签避免无依据主张。"
    },
    humanReview: { riskLevel: "High", assumptions: ["PM 希望在仪表盘中获得解释，而不只是原始指标。", "证据关联注释能减少报告时间且不降低信任。", "低信心洞察可以被清晰标记。"], openQuestions: ["展示注释前需要达到怎样的证据门槛？", "面向管理层的报告中，谁负责批准注释？", "产品应如何处理相互冲突的信号？"], pmVerification: ["检查近期周报中的重复人工工作。", "与 PM 和分析师测试注释文案。", "发布前定义信心标签和无依据主张警告。"] }
  }
];

export function getMockData(language: "en" | "zh") {
  return language === "zh"
    ? { rawFeedbackPreview: rawFeedbackPreviewZh, feedbackSources: feedbackSourcesZh, painClusters: painClustersZh, opportunities: opportunitiesZh }
    : { rawFeedbackPreview, feedbackSources, painClusters, opportunities };
}

export function getLocalizedLevel(language: "en" | "zh", level: "High" | "Medium" | "Low") {
  if (language === "en") return level;
  return level === "High" ? "高" : level === "Medium" ? "中" : "低";
}
