# ProductSense AI

ProductSense AI is an **AI Product Decision Agent** portfolio MVP. It turns raw customer feedback into evidence-backed product opportunities, human-reviewed PRD drafts, editable experiment briefs, PM-adjusted prioritization, and risk-aware recommendations.

It is designed to demonstrate AI Product Manager thinking. It is not a production SaaS product.

## Product workflow

1. Upload or paste customer feedback.
2. Analyze pain points and retain supporting evidence.
3. Select an AI-generated opportunity.
4. Require PM review before creating a PRD.
5. Edit assumptions, scope, metrics, risks, and the experiment brief.
6. Adjust RICE inputs using business and engineering context.
7. Review evidence, risks, open questions, and decision history.
8. Approve only for prototype and export the PRD as Markdown.

## Key capabilities

- Interactive mock discovery workflow with multiple opportunities
- Optional server-side analysis through OpenAI-compatible providers with structured JSON
- Demo fallback when API credits, quota, or billing prevent live generation
- Human-in-the-loop approval gate
- Traceable evidence linked to pain points and opportunities
- PM-editable assumptions and experiment brief
- PM-adjusted RICE calculation with effort validation
- Prototype approval status stored locally
- Copyable Markdown PRD export
- Decision history showing AI suggestions and PM changes
- Lightweight English / Chinese UI toggle

## Mock workflow

The original flow uses prepared data and remains available for reliable demonstrations:

- `/upload`
- `/dashboard`
- `/opportunities/[id]`
- `/prd/[id]`
- `/evaluation/[id]`

Mock data keeps the workflow testable without an API account and makes the product logic easy to inspect.

## Real AI workflow

The optional AI flow starts at `/ai-analysis`:

- `POST /api/analyze-feedback` sends pasted feedback to the configured provider from the server only.
- Structured JSON returns pain points, exact evidence quotes, opportunities, RICE-style inputs, risks, and human-review notes.
- The selected result is stored in the browser under `productsense-ai-workflow`.
- `/ai-prd` and `/ai-evaluation` reuse that stored result without additional model calls.

The `Use demo AI result` button loads clearly labeled fallback data. This lets recruiters complete the same flow when live API generation is unavailable.

## AI safety and human review

ProductSense AI does not make final roadmap, launch, or investment decisions. The workflow:

- warns that AI output requires PM validation;
- keeps evidence visible beside recommendations;
- flags unsupported-claim risk and confidence;
- resets PRD approval when PM or experiment inputs change;
- uses `Approved for prototype`, never approved for roadmap or launch;
- recommends prototype validation before commitment.

## Evidence traceability

Evidence quotes are labeled as user-provided or demo fallback evidence. Each quote identifies the pain point and opportunity it supports. Missing evidence produces an explicit human-review warning. AI-generated or demo output is never presented as verified customer truth.

## PM workbench

PMs can edit:

- Primary user segment
- Key assumption
- Success metric
- Non-goal
- Launch risk
- Confidence note
- Experiment hypothesis, metrics, design, rollout, risks, and decision rule
- Reach, Impact, Confidence, and Effort

The adjusted RICE formula is:

```text
Reach x Impact x (Confidence / 100) / Effort
```

Effort must be greater than zero. AI scores remain directional until a PM adds real business, engineering, and customer context.

## Bilingual UI

English is the default portfolio language. The subtle `EN / 中文` header control stores the selection under `productsense-language` in `localStorage` and restores it after refresh.

Day 7 localization was improved to avoid mixed-language demo screens:

- English mode uses English UI copy, mock data, demo AI results, deterministic PRD text, experiment defaults, evaluation content, decision history, and Markdown export.
- 中文模式 uses Chinese UI copy, mock data, demo AI results, deterministic PRD text, experiment defaults, evaluation content, decision history, and Markdown export.
- AI Analysis sends the selected language to the server and asks the configured provider to return generated field values in that language.
- Evidence quotes from a real provider remain verbatim in their original customer-feedback language so traceability is not damaged by translation.
- Stored AI workflows are tagged by language, preventing an English result from appearing inside the Chinese PRD or evaluation flow.

This remains lightweight MVP localization, not a production-grade i18n system. Real provider output may occasionally ignore language instructions, and user-entered or source evidence text is never automatically rewritten.

## Tech stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Browser `localStorage`
- OpenAI-compatible Chat Completions API with structured JSON output

No additional state-management, UI, or i18n libraries are used.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and configure one provider:

```bash
AI_PROVIDER=groq
AI_API_KEY=your_groq_key_here
AI_MODEL=llama-3.1-8b-instant
AI_BASE_URL=https://api.groq.com/openai/v1
```

Restart the development server after editing `.env.local`. Never commit `.env.local` or expose the API key in browser code.

### OpenAI-compatible providers

ProductSense AI can switch providers without code changes. Edit only `.env.local` and restart the development server.

Groq example:

```bash
AI_PROVIDER=groq
AI_API_KEY=your_groq_key_here
AI_MODEL=llama-3.1-8b-instant
AI_BASE_URL=https://api.groq.com/openai/v1
```

Gemini OpenAI-compatible example:

```bash
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_key_here
AI_MODEL=gemini-3.5-flash
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
```

OpenAI example:

```bash
AI_PROVIDER=openai
AI_API_KEY=your_openai_key_here
AI_MODEL=gpt-4.1-mini
AI_BASE_URL=https://api.openai.com/v1
```

Provider model availability and free-tier limits can change, so use a model available to your account. OpenAI uses strict JSON schema mode; compatible alternatives receive the same required ProductSense JSON shape in the prompt and are validated server-side. Quota or billing responses continue to offer the labeled demo fallback.

## Portfolio artifacts

- [Portfolio case study](PORTFOLIO_CASE_STUDY.md)
- [2-3 minute demo script](DEMO_SCRIPT.md)
- [Final QA checklist](FINAL_QA_CHECKLIST.md)

## Limitations

- Browser-only persistence; no accounts, team collaboration, or cross-device sync
- No database, authentication, payment, or authorization controls
- No production-grade file parsing, observability, rate limiting, moderation, or cost controls
- Small mock dataset and illustrative evaluation values
- AI outputs depend on model access and still require evidence validation
- Deterministic client-side PRD and experiment defaults rather than additional AI calls
- Partial UI translation rather than full localization of data and generated content
- No automatic roadmap, launch, or investment decisions

## Roadmap

- Source-level feedback ingestion with stable evidence IDs
- Editable evidence inclusion and exclusion controls
- Experiment result capture and learning history
- Team persistence, roles, and audit logs
- Production i18n with localized dynamic content
- Model evaluation datasets, quality monitoring, and cost controls
- Optional exports to product tools after explicit PM approval

## Portfolio note

This project demonstrates product framing, agent workflow design, structured AI output, human-in-the-loop controls, evidence traceability, prioritization judgment, localization awareness, and honest scoping. It should be evaluated as a polished portfolio MVP, not as a production-ready autonomous product system.
