# ProductSense AI Final QA Checklist

## Core experience

- [ ] Landing page loads
- [ ] English / Chinese toggle works
- [ ] Selected language persists after refresh
- [ ] Mock upload and dashboard workflow works
- [ ] AI Analysis page loads
- [ ] Empty feedback validation works
- [ ] Demo fallback works without an API call
- [ ] Opportunity selection enables PRD approval

## PRD workbench

- [ ] AI PRD loads the selected opportunity
- [ ] PM edits persist after refresh
- [ ] PM edits reset status to Needs PM review
- [ ] Approval status can be set to Approved for prototype
- [ ] Approval can be reset
- [ ] Experiment brief is editable
- [ ] Experiment edits persist after refresh
- [ ] Experiment edits reset approval status
- [ ] Markdown export includes PM edits, experiment brief, evidence, and status
- [ ] Copy Markdown works

## Evaluation

- [ ] AI Evaluation loads
- [ ] PM-adjusted RICE recalculates
- [ ] Confidence is treated as a percentage
- [ ] Effort zero validation works
- [ ] Evidence traceability appears
- [ ] Approval status appears
- [ ] Decision History appears
- [ ] Decision History shows PM changes
- [ ] Final recommendation remains prototype-only and cautious

## Portfolio package

- [ ] README is complete
- [ ] `PORTFOLIO_CASE_STUDY.md` exists
- [ ] `DEMO_SCRIPT.md` exists
- [ ] No real API key is committed
- [ ] `.env.example` contains placeholders only
- [ ] TypeScript check passes
- [ ] Key pages have no browser console errors
