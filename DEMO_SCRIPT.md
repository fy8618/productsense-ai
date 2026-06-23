# ProductSense AI Demo Script

## 2–3 minute walkthrough

### 0:00–0:20 — Landing page

“ProductSense AI is an AI Product Decision Agent. It turns messy customer feedback into evidence-backed opportunities, PRD drafts, experiments, and risk-aware recommendations. This is a portfolio MVP, so it keeps the workflow reviewable rather than pretending to be an autonomous roadmap system.”

Toggle `EN / 中文` and say: “The main workflow supports a lightweight bilingual UI, and the preference persists after refresh.”

### 0:20–0:40 — Mock feedback

Open **Upload** and show the prepared feedback preview. Then open the dashboard.

“The mock path is intentionally reliable for interviews. It shows the chain from raw feedback to pain clusters, exact evidence, and prioritized opportunities.”

### 0:40–1:05 — AI Analysis

Open **AI Analysis**. Paste feedback or use the sample.

“The live route calls OpenAI server-side and requests structured JSON. If credits or quota are unavailable, I use the clearly labeled demo result so the product workflow remains testable.”

Click **Use demo AI result** if needed. Point out pain points, evidence labels, opportunities, risks, and human-review notes.

### 1:05–1:25 — Opportunity and PM review

Select **Reduce checkout uncertainty before payment**.

“The AI proposes; the PM chooses. I cannot continue until an opportunity is selected, and the review gate reminds me to validate evidence and assumptions.”

Approve it for a PRD draft.

### 1:25–1:55 — AI PRD and experiment brief

“The PRD is a deterministic first draft, so this step makes no additional model call. I can edit the target segment, assumption, metric, non-goal, risk, and confidence note. Every edit is stored locally and resets approval to `Needs PM review`.”

Edit one PM field. Show the **Editable experiment brief** and change the hypothesis or rollout plan.

“AI can draft the experiment, but the PM owns the hypothesis, metrics, guardrail, rollout, and decision rule.”

Mark it **Approved for prototype**, then export and copy the Markdown.

### 1:55–2:25 — Evaluation and RICE

Open **AI Evaluation**.

“This page shows the AI score beside PM-adjusted Reach, Impact, Confidence, and Effort. The formula is transparent, and effort cannot be zero.”

Change one RICE input. Point out evidence coverage, unsupported-claim risk, key risks, and the cautious prototype recommendation.

### 2:25–2:50 — Decision history

Show **Decision History**.

“This closes the human-in-the-loop story: what AI suggested, what the PM changed, approval status, adjusted RICE, key evidence, and remaining questions are visible together.”

### 2:50–3:00 — Close

“The honest claim is that ProductSense AI demonstrates a reviewable AI product-decision workflow. It is not production-ready, and it does not make autonomous roadmap or launch decisions.”
