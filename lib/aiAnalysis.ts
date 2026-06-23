export type AiAnalysisResult = {
  summary: string;
  painPoints: {
    id: string;
    title: string;
    severity: "High" | "Medium" | "Low";
    frequencySignal: string;
    description: string;
    evidenceQuotes: string[];
    userSegments: string[];
  }[];
  opportunities: {
    id: string;
    title: string;
    relatedPainPoint: string;
    targetSegment: string;
    reach: string;
    impact: string;
    confidence: string;
    effort: string;
    riceScore: string;
    recommendation: string;
  }[];
  risks: {
    title: string;
    level: "High" | "Medium" | "Low";
    description: string;
  }[];
  humanReview: {
    required: true;
    why: string;
    assumptionsToVerify: string[];
    openQuestions: string[];
  };
};

export const sampleFeedback = `Support ticket: I wanted to buy the annual plan, but I could not tell whether billing starts today or after the trial.
Sales call note: The buyer liked the dashboard but asked three times how to prove value to their manager before inviting the team.
Cancellation survey: I canceled because setup took too long and I was not sure which step would actually help me.
User interview: The report had useful numbers, but I still had to write my own summary for leadership.
Support ticket: I uploaded feedback notes, but the themes were hard to compare because quotes were scattered everywhere.
Sales call note: Prospect said they would try the product if it could turn customer feedback into a clear PRD draft with risks.`;

const sampleFeedbackZh = `客服工单：我想购买年度套餐，但不清楚是今天开始计费，还是试用结束后才开始。
销售通话记录：买家喜欢仪表盘，但在邀请团队前，连续问了三次如何向经理证明产品价值。
取消问卷：我取消了，因为设置耗时太长，而且不知道哪一步真正有帮助。
用户访谈：报告中的数字有用，但我仍然需要自己为管理层撰写总结。
客服工单：我上传了反馈记录，但引用分散在各处，很难比较主题。
销售通话记录：潜在客户表示，如果产品能把客户反馈转成包含风险的清晰 PRD 草稿，他们愿意尝试。`;

export function getSampleFeedback(language: "en" | "zh") {
  return language === "zh" ? sampleFeedbackZh : sampleFeedback;
}

export const demoAiAnalysisResult: AiAnalysisResult = {
  summary:
    "The prepared feedback suggests two evidence-backed themes: buyers are uncertain about billing before checkout, and teams struggle to communicate decision-ready value from reports. The checkout theme is the stronger prototype candidate, but both require PM validation.",
  painPoints: [
    {
      id: "billing-clarity",
      title: "Billing terms are unclear before purchase",
      severity: "High",
      frequencySignal: "Mentioned directly in 2 of 6 prepared feedback items",
      description:
        "Prospective customers cannot confidently understand when billing starts or what happens after a trial, increasing hesitation near payment.",
      evidenceQuotes: [
        "I could not tell whether billing starts today or after the trial.",
        "I was nervous about clicking confirm without seeing the final billing date."
      ],
      userSegments: ["Trial users", "Small-team buyers"]
    },
    {
      id: "reporting-context",
      title: "Reports lack decision-ready context",
      severity: "Medium",
      frequencySignal: "Mentioned directly in 2 of 6 prepared feedback items",
      description:
        "Users can see metrics but still need manual work to explain findings, implications, and next steps to stakeholders.",
      evidenceQuotes: [
        "I still had to write my own summary for leadership.",
        "The numbers are useful, but they do not tell my team what decision to make."
      ],
      userSegments: ["Product managers", "Team leads"]
    }
  ],
  opportunities: [
    {
      id: "checkout-clarity",
      title: "Reduce checkout uncertainty before payment",
      relatedPainPoint: "Billing terms are unclear before purchase",
      targetSegment: "Trial users and small-team buyers",
      reach: "Medium",
      impact: "High",
      confidence: "72% - moderate",
      effort: "Low",
      riceScore: "7.8",
      recommendation:
        "Prototype a concise pre-payment billing summary and validate whether it improves buyer comprehension before measuring conversion impact."
    },
    {
      id: "decision-ready-reporting",
      title: "Add decision context to product reports",
      relatedPainPoint: "Reports lack decision-ready context",
      targetSegment: "Product managers and team leads",
      reach: "Medium",
      impact: "Medium",
      confidence: "61% - moderate",
      effort: "Medium",
      riceScore: "4.1",
      recommendation:
        "Test a structured summary with evidence, implications, and suggested follow-up questions before expanding report generation."
    }
  ],
  risks: [
    {
      title: "Small evidence sample",
      level: "High",
      description: "The prepared dataset is too small to estimate broad customer frequency or roadmap value."
    },
    {
      title: "Conversion impact is unproven",
      level: "Medium",
      description: "Clearer billing information may improve trust without materially changing purchase conversion."
    }
  ],
  humanReview: {
    required: true,
    why: "The analysis organizes limited qualitative evidence; a PM must validate the interpretation, scoring assumptions, and business context.",
    assumptionsToVerify: [
      "Checkout uncertainty is common enough to influence purchase behavior.",
      "A billing summary can improve clarity without adding checkout friction.",
      "The estimated effort is realistic for the current product architecture."
    ],
    openQuestions: [
      "How often do users abandon after viewing billing terms?",
      "Which billing details cause the most confusion?",
      "What legal or finance review is required for new checkout copy?"
    ]
  }
};

const demoAiAnalysisResultZh: AiAnalysisResult = {
  summary: "准备好的反馈显示两个有证据支持的主题：买家在付款前不清楚计费信息，团队也难以从报告中获得可直接用于决策的背景。结账主题更适合优先制作原型，但两者都需要 PM 验证。",
  painPoints: [
    {
      id: "billing-clarity", title: "购买前的计费条款不清晰", severity: "High", frequencySignal: "在 6 条准备好的反馈中有 2 条直接提及",
      description: "潜在客户无法确认何时开始计费以及试用结束后会发生什么，因此在付款前产生犹豫。",
      evidenceQuotes: ["我不清楚是今天开始计费，还是试用结束后才开始。", "在看不到最终计费日期的情况下点击确认让我很不安。"],
      userSegments: ["试用用户", "小团队购买者"]
    },
    {
      id: "reporting-context", title: "报告缺少可直接用于决策的背景", severity: "Medium", frequencySignal: "在 6 条准备好的反馈中有 2 条直接提及",
      description: "用户能看到指标，但仍需手动解释发现、影响和后续行动。",
      evidenceQuotes: ["我仍然需要自己为管理层撰写总结。", "这些数字很有用，但没有告诉团队应该做什么决定。"],
      userSegments: ["产品经理", "团队负责人"]
    }
  ],
  opportunities: [
    {
      id: "checkout-clarity", title: "减少付款前的结账不确定性", relatedPainPoint: "购买前的计费条款不清晰", targetSegment: "试用用户和小团队购买者",
      reach: "中", impact: "高", confidence: "72% - 中等", effort: "低", riceScore: "7.8",
      recommendation: "制作简洁的付款前计费摘要原型，先验证它是否提升买家理解，再衡量转化影响。"
    },
    {
      id: "decision-ready-reporting", title: "为产品报告增加决策背景", relatedPainPoint: "报告缺少可直接用于决策的背景", targetSegment: "产品经理和团队负责人",
      reach: "中", impact: "中", confidence: "61% - 中等", effort: "中", riceScore: "4.1",
      recommendation: "先测试包含证据、影响和后续问题的结构化摘要，再扩展报告生成功能。"
    }
  ],
  risks: [
    { title: "证据样本较小", level: "High", description: "准备好的数据集太小，无法估算更广泛客户群中的问题频率或路线图价值。" },
    { title: "转化影响尚未验证", level: "Medium", description: "更清晰的计费信息可能提升信任，但不一定显著改变购买转化。" }
  ],
  humanReview: {
    required: true,
    why: "该分析只是整理了有限的定性证据；PM 必须验证解释、评分假设和业务背景。",
    assumptionsToVerify: ["结账不确定性足够普遍，并会影响购买行为。", "计费摘要能提高清晰度且不会增加结账摩擦。", "当前产品架构下的投入估算是合理的。"],
    openQuestions: ["用户查看计费条款后放弃的频率是多少？", "哪些计费信息最容易造成困惑？", "新的结账文案需要哪些法律或财务审核？"]
  }
};

export function getDemoAiAnalysisResult(language: "en" | "zh") {
  return language === "zh" ? demoAiAnalysisResultZh : demoAiAnalysisResult;
}

export const aiAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "painPoints", "opportunities", "risks", "humanReview"],
  properties: {
    summary: { type: "string" },
    painPoints: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "severity", "frequencySignal", "description", "evidenceQuotes", "userSegments"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          severity: { type: "string", enum: ["High", "Medium", "Low"] },
          frequencySignal: { type: "string" },
          description: { type: "string" },
          evidenceQuotes: { type: "array", items: { type: "string" } },
          userSegments: { type: "array", items: { type: "string" } }
        }
      }
    },
    opportunities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "relatedPainPoint", "targetSegment", "reach", "impact", "confidence", "effort", "riceScore", "recommendation"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          relatedPainPoint: { type: "string" },
          targetSegment: { type: "string" },
          reach: { type: "string" },
          impact: { type: "string" },
          confidence: { type: "string" },
          effort: { type: "string" },
          riceScore: { type: "string" },
          recommendation: { type: "string" }
        }
      }
    },
    risks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "level", "description"],
        properties: {
          title: { type: "string" },
          level: { type: "string", enum: ["High", "Medium", "Low"] },
          description: { type: "string" }
        }
      }
    },
    humanReview: {
      type: "object",
      additionalProperties: false,
      required: ["required", "why", "assumptionsToVerify", "openQuestions"],
      properties: {
        required: { type: "boolean", const: true },
        why: { type: "string" },
        assumptionsToVerify: { type: "array", items: { type: "string" } },
        openQuestions: { type: "array", items: { type: "string" } }
      }
    }
  }
};
