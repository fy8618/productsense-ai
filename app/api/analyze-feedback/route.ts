import { NextResponse } from "next/server";
import { AiAnalysisResult, aiAnalysisJsonSchema } from "@/lib/aiAnalysis";

export const runtime = "nodejs";

const systemPrompt = `You are an AI Product Manager assistant. Analyze only the customer feedback provided by the user. Do not invent evidence quotes. Mark low confidence when evidence is weak. Prefer evidence-backed product opportunities. Avoid final roadmap decisions. Always recommend human PM review before roadmap commitment.

Return only valid JSON matching this exact structure:
{
  "summary": "string",
  "painPoints": [{ "id": "string", "title": "string", "severity": "High | Medium | Low", "frequencySignal": "string", "description": "string", "evidenceQuotes": ["string"], "userSegments": ["string"] }],
  "opportunities": [{ "id": "string", "title": "string", "relatedPainPoint": "string", "targetSegment": "string", "reach": "string", "impact": "string", "confidence": "string", "effort": "string", "riceScore": "string", "recommendation": "string" }],
  "risks": [{ "title": "string", "level": "High | Medium | Low", "description": "string" }],
  "humanReview": { "required": true, "why": "string", "assumptionsToVerify": ["string"], "openQuestions": ["string"] }
}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";
    const language = body.language === "zh" ? "zh" : "en";

    if (!feedback) {
      return NextResponse.json({ error: "Please paste customer feedback before running AI analysis." }, { status: 400 });
    }

    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL;
    const baseUrl = process.env.AI_BASE_URL;

    const missing = [
      !apiKey ? "AI_API_KEY is missing. Add it to D:\\ProductSenseAI\\.env.local." : "",
      !model ? "AI_MODEL is missing. Add it to D:\\ProductSenseAI\\.env.local." : "",
      !baseUrl ? "AI_BASE_URL is missing. Add it to D:\\ProductSenseAI\\.env.local." : ""
    ].filter(Boolean);

    if (missing.length > 0) {
      return NextResponse.json({ error: missing.join(" ") }, { status: 500 });
    }

    const requestBody: Record<string, unknown> = {
      model,
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nWrite all generated field values in ${language === "zh" ? "Simplified Chinese" : "English"}. Keep evidenceQuotes verbatim in their original source language; do not translate or rewrite customer quotes.`
        },
        { role: "user", content: `Analyze this raw customer feedback into structured product discovery output:\n\n${feedback}` }
      ]
    };

    // OpenAI supports the existing strict schema. Other compatible providers receive
    // the same shape through the JSON-only prompt because model support varies.
    if (provider === "openai") {
      requestBody.response_format = {
        type: "json_schema",
        json_schema: {
          name: "product_feedback_analysis",
          strict: true,
          schema: aiAnalysisJsonSchema
        }
      };
    }

    const endpoint = `${baseUrl!.replace(/\/+$/, "")}/chat/completions`;
    const providerResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await providerResponse.text();
    const providerData = parseProviderEnvelope(responseText);

    if (!providerData.ok) {
      return NextResponse.json(
        { error: `${provider} returned invalid JSON. Check AI_BASE_URL and provider compatibility.` },
        { status: 502 }
      );
    }

    if (!providerResponse.ok) {
      const errorMessage = getProviderErrorMessage(providerData.value, provider);
      const errorCode = getProviderErrorCode(providerData.value);
      const isQuotaOrBillingError =
        providerResponse.status === 402 ||
        providerResponse.status === 429 ||
        /quota|billing|credit|insufficient|resource_exhausted/i.test(`${errorCode} ${errorMessage}`);

      return NextResponse.json(
        {
          error: errorMessage,
          errorType: isQuotaOrBillingError ? "quota_or_billing" : "provider_error"
        },
        { status: providerResponse.status }
      );
    }

    const content = getAssistantContent(providerData.value);

    if (!content) {
      return NextResponse.json(
        { error: `${provider} returned an unexpected Chat Completions response shape.` },
        { status: 502 }
      );
    }

    const analysis = parseAnalysisJson(content);

    if (!analysis) {
      return NextResponse.json(
        { error: `${provider} returned invalid JSON for the ProductSense AI analysis shape.` },
        { status: 502 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error while analyzing feedback." },
      { status: 500 }
    );
  }
}

function parseProviderEnvelope(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

function getAssistantContent(data: unknown) {
  if (!isRecord(data) || !Array.isArray(data.choices)) return null;
  const firstChoice = data.choices[0];
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) return null;
  return typeof firstChoice.message.content === "string" ? firstChoice.message.content : null;
}

function getProviderErrorMessage(data: unknown, provider: string) {
  if (isRecord(data) && isRecord(data.error) && typeof data.error.message === "string") {
    return data.error.message;
  }
  return `${provider} analysis failed. Check AI_API_KEY, AI_MODEL, AI_BASE_URL, and account access.`;
}

function getProviderErrorCode(data: unknown) {
  if (!isRecord(data) || !isRecord(data.error)) return "";
  if (typeof data.error.code === "string") return data.error.code;
  if (typeof data.error.type === "string") return data.error.type;
  if (typeof data.error.status === "string") return data.error.status;
  return "";
}

function parseAnalysisJson(content: string): AiAnalysisResult | null {
  const normalized = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  const firstBrace = normalized.indexOf("{");
  const lastBrace = normalized.lastIndexOf("}");

  if (firstBrace < 0 || lastBrace <= firstBrace) return null;

  try {
    const parsed = JSON.parse(normalized.slice(firstBrace, lastBrace + 1));
    return isAiAnalysisResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isAiAnalysisResult(value: unknown): value is AiAnalysisResult {
  if (!isRecord(value) || typeof value.summary !== "string") return false;
  if (!Array.isArray(value.painPoints) || !value.painPoints.every(isPainPoint)) return false;
  if (!Array.isArray(value.opportunities) || !value.opportunities.every(isOpportunity)) return false;
  if (!Array.isArray(value.risks) || !value.risks.every(isRisk)) return false;
  if (!isRecord(value.humanReview) || value.humanReview.required !== true) return false;

  return (
    typeof value.humanReview.why === "string" &&
    isStringArray(value.humanReview.assumptionsToVerify) &&
    isStringArray(value.humanReview.openQuestions)
  );
}

function isPainPoint(value: unknown) {
  return isRecord(value) &&
    hasStringFields(value, ["id", "title", "severity", "frequencySignal", "description"]) &&
    ["High", "Medium", "Low"].includes(value.severity as string) &&
    isStringArray(value.evidenceQuotes) &&
    isStringArray(value.userSegments);
}

function isOpportunity(value: unknown) {
  return isRecord(value) && hasStringFields(value, [
    "id", "title", "relatedPainPoint", "targetSegment", "reach", "impact",
    "confidence", "effort", "riceScore", "recommendation"
  ]);
}

function isRisk(value: unknown) {
  return isRecord(value) &&
    hasStringFields(value, ["title", "level", "description"]) &&
    ["High", "Medium", "Low"].includes(value.level as string);
}

function hasStringFields(value: Record<string, unknown>, fields: string[]) {
  return fields.every((field) => typeof value[field] === "string");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
