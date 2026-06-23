# ProductSense AI — AI Product Decision Agent

## Overview

ProductSense AI is a portfolio MVP that converts fragmented customer feedback into reviewable product decisions. It combines structured AI analysis with explicit PM judgment rather than treating model output as a roadmap answer.

## Problem

Product managers receive support tickets, interviews, surveys, and sales notes in different formats. Turning those inputs into traceable pain points, prioritized opportunities, PRDs, experiments, and risk-aware recommendations is slow and inconsistent.

## Target users

- AI Product Managers working with feedback-heavy decisions
- Associate PMs learning disciplined discovery
- Growth PMs planning evidence-backed experiments
- Startup teams without dedicated research operations

## Why this should be an Agent

The work is a multi-step decision process, not a single prompt. The system must organize evidence, propose opportunities, carry context into a PRD, expose assumptions, support prioritization, and stop for human review before commitment.

## Core workflow

Raw feedback → AI analysis → PM review → selected opportunity → PRD draft → experiment brief → RICE adjustment → risk evaluation → Markdown export.

## AI workflow design

The server sends only pasted feedback to OpenAI and requests strict structured JSON. The model is instructed not to invent evidence, to lower confidence when support is weak, and to avoid final roadmap decisions. Downstream pages reuse the structured result without additional model calls.

## Human-in-the-loop design

The PM selects the opportunity, edits assumptions and experiment inputs, adjusts RICE, validates risks, and controls prototype approval. Editing core inputs resets the PRD to `Needs PM review`.

## Evidence traceability

Quotes remain visible and are linked to the pain point and opportunity they support. The UI distinguishes user-provided evidence from demo fallback evidence and explicitly flags missing evidence.

## Evaluation and risk controls

The evaluation view compares AI and PM RICE scores, checks evidence coverage, surfaces unsupported-claim risk, preserves open questions, and recommends prototyping only after validation.

## Bilingual UI support

The main workflow supports English and Chinese through a small local translation dictionary. English remains the default, and the preference persists in the browser. This demonstrates localization awareness without presenting the MVP as a full i18n system.

## MVP scope

- Mock and optional real AI feedback analysis
- Structured opportunities and evidence
- PM-edited PRD and experiment brief
- Local RICE adjustment and prototype approval
- Risk review, decision history, and Markdown export

## What I intentionally did not build

- Authentication, payments, database persistence, or team permissions
- Complex uploads or third-party integrations
- Autonomous roadmap decisions
- Additional AI calls for PRD or experiment generation
- Chatbot interaction

## Limitations

Data is stored only in one browser. Mock evidence is small, live analysis depends on API access, AI quality is not backed by a production evaluation suite, and dynamic generated content is not fully localized.

## Future roadmap

Add stable source IDs, editable evidence selection, experiment-result learning, team audit logs, production model evaluations, cost controls, and full localization before considering integrations.

## What this project demonstrates for an AI Product Manager role

ProductSense AI demonstrates product problem framing, agent decomposition, structured-output design, human oversight, evidence-based prioritization, risk controls, experiment thinking, localization awareness, and disciplined MVP scoping.
