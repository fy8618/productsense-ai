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

    const provider = (process.env.AI_PROVIDER || "openai").trim().toLowerCase();
    const apiKey = process.env.AI_API_KEY?.trim();
    const model = process.env.AI_MODEL?.trim();
    const baseUrl = process.env.AI_BASE_URL?.trim();

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

    const normalizedBaseUrl = baseUrl!.replace(/\/+$/, "");
    const endpoint = `${normalizedBaseUrl}/chat/completions`;
    let providerResponse: Response;

    try {
      providerResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      const details = createSafeProviderDetails({
        provider,
        model: model!,
        baseUrl: normalizedBaseUrl,
        endpoint,
        apiKey,
        providerStatus: null,
        providerErrorCode: null,
        providerErrorMessage: error instanceof Error ? error.message : "Provider request failed before receiving a response.",
        responseText: "",
        jsonParsingError: null
      });

      logProviderFailure("Provider request could not be completed", details);

      return NextResponse.json(
        {
          error: getFriendlyProviderMessage(provider, 503, false),
          errorType: "provider_temporary",
          developerDetails: details
        },
        { status: 503 }
      );
    }

    const responseText = await providerResponse.text();
    const providerData = parseProviderEnvelope(responseText);

    if (!providerData.ok) {
      const details = createSafeProviderDetails({
        provider,
        model: model!,
        baseUrl: normalizedBaseUrl,
        endpoint,
        apiKey,
        providerStatus: providerResponse.status,
        providerErrorCode: null,
        providerErrorMessage: null,
        responseText,
        jsonParsingError: providerData.error
      });

      logProviderFailure("Provider returned a non-JSON response", details);

      return NextResponse.json(
        {
          error: getFriendlyProviderMessage(provider, providerResponse.status, false),
          errorType: isTemporaryProviderStatus(providerResponse.status) ? "provider_temporary" : "provider_error",
          developerDetails: details
        },
        { status: providerResponse.ok ? 502 : providerResponse.status }
      );
    }

    if (!providerResponse.ok) {
      const errorMessage = getProviderErrorMessage(providerData.value, provider);
      const errorCode = getProviderErrorCode(providerData.value);
      const isQuotaOrBillingError =
        providerResponse.status === 402 ||
        providerResponse.status === 429 ||
        /quota|billing|credit|insufficient|resource_exhausted/i.test(`${errorCode} ${errorMessage}`);
      const details = createSafeProviderDetails({
        provider,
        model: model!,
        baseUrl: normalizedBaseUrl,
        endpoint,
        apiKey,
        providerStatus: providerResponse.status,
        providerErrorCode: errorCode || null,
        providerErrorMessage: errorMessage,
        responseText,
        jsonParsingError: null
      });

      logProviderFailure("Provider returned an HTTP error", details);

      return NextResponse.json(
        {
          error: getFriendlyProviderMessage(provider, providerResponse.status, isQuotaOrBillingError),
          errorType: isQuotaOrBillingError
            ? "quota_or_billing"
            : isTemporaryProviderStatus(providerResponse.status)
              ? "provider_temporary"
              : "provider_error",
          developerDetails: details
        },
        { status: providerResponse.status }
      );
    }

    const content = getAssistantContent(providerData.value);

    if (!content) {
      const details = createSafeProviderDetails({
        provider,
        model: model!,
        baseUrl: normalizedBaseUrl,
        endpoint,
        apiKey,
        providerStatus: providerResponse.status,
        providerErrorCode: null,
        providerErrorMessage: "The response did not contain choices[0].message.content.",
        responseText,
        jsonParsingError: null
      });

      logProviderFailure("Provider returned an unexpected response shape", details);

      return NextResponse.json(
        {
          error: `${provider} returned an unexpected response. Check Vercel Logs or use the demo result.`,
          errorType: "provider_error",
          developerDetails: details
        },
        { status: 502 }
      );
    }

    const analysisResult = parseAnalysisJson(content);

    if (!analysisResult.ok) {
      const details = createSafeProviderDetails({
        provider,
        model: model!,
        baseUrl: normalizedBaseUrl,
        endpoint,
        apiKey,
        providerStatus: providerResponse.status,
        providerErrorCode: null,
        providerErrorMessage: "The assistant response did not match the ProductSense AI analysis shape.",
        responseText,
        jsonParsingError: analysisResult.error
      });

      logProviderFailure("Provider returned invalid analysis JSON", details);

      return NextResponse.json(
        {
          error: `${provider} returned an invalid structured response. Check Vercel Logs or use the demo result.`,
          errorType: "provider_error",
          developerDetails: details
        },
        { status: 502 }
      );
    }

    return NextResponse.json(analysisResult.value);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error while analyzing feedback." },
      { status: 500 }
    );
  }
}

function parseProviderEnvelope(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
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

function parseAnalysisJson(content: string): { ok: true; value: AiAnalysisResult } | { ok: false; error: string } {
  const normalized = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  const firstBrace = normalized.indexOf("{");
  const lastBrace = normalized.lastIndexOf("}");

  if (firstBrace < 0 || lastBrace <= firstBrace) {
    return { ok: false, error: "No complete JSON object was found in the assistant response." };
  }

  try {
    const parsed = JSON.parse(normalized.slice(firstBrace, lastBrace + 1));
    return isAiAnalysisResult(parsed)
      ? { ok: true, value: parsed }
      : { ok: false, error: "JSON parsed successfully but did not match the required analysis schema." };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

type SafeProviderDetails = {
  provider: string;
  model: string;
  baseUrl: string;
  requestUrl: string;
  aiApiKeyExists: boolean;
  providerHttpStatus: number | null;
  providerErrorCode: string | null;
  providerErrorMessage: string | null;
  rawProviderResponseText: string;
  jsonParsingError: string | null;
};

function createSafeProviderDetails(input: {
  provider: string;
  model: string;
  baseUrl: string;
  endpoint: string;
  apiKey?: string;
  providerStatus: number | null;
  providerErrorCode: string | null;
  providerErrorMessage: string | null;
  responseText: string;
  jsonParsingError: string | null;
}): SafeProviderDetails {
  return {
    provider: input.provider,
    model: input.model,
    baseUrl: sanitizeUrl(input.baseUrl, input.apiKey),
    requestUrl: sanitizeUrl(input.endpoint, input.apiKey),
    aiApiKeyExists: Boolean(input.apiKey),
    providerHttpStatus: input.providerStatus,
    providerErrorCode: sanitizeOptionalText(input.providerErrorCode, input.apiKey),
    providerErrorMessage: sanitizeOptionalText(input.providerErrorMessage, input.apiKey),
    rawProviderResponseText: redactSecrets(input.responseText, input.apiKey).slice(0, 1000),
    jsonParsingError: sanitizeOptionalText(input.jsonParsingError, input.apiKey)
  };
}

function logProviderFailure(reason: string, details: SafeProviderDetails) {
  console.error(`[analyze-feedback] ${reason}`, details);
}

function getFriendlyProviderMessage(provider: string, status: number, isQuotaOrBillingError: boolean) {
  if (isQuotaOrBillingError || status === 429) {
    return `${provider} could not complete the analysis because of quota, billing, or rate limits. Try again later or use the demo result.`;
  }

  if (isTemporaryProviderStatus(status)) {
    return `${provider} is temporarily unavailable. This may be a provider rate-limit or availability issue. Try again later or use the demo result.`;
  }

  return `${provider} could not complete the analysis. Check the safe developer details in Vercel Logs or use the demo result.`;
}

function isTemporaryProviderStatus(status: number) {
  return [429, 500, 502, 503, 504].includes(status);
}

function sanitizeUrl(value: string, apiKey?: string) {
  try {
    const url = new URL(value);
    url.username = "";
    url.password = "";

    for (const key of Array.from(url.searchParams.keys())) {
      if (/key|token|secret|auth/i.test(key)) url.searchParams.set(key, "[REDACTED]");
    }

    return redactSecrets(url.toString(), apiKey).replace(/\/$/, "");
  } catch {
    return redactSecrets(value, apiKey);
  }
}

function sanitizeOptionalText(value: string | null, apiKey?: string) {
  return value ? redactSecrets(value, apiKey) : null;
}

function redactSecrets(value: string, apiKey?: string) {
  let sanitized = value;

  if (apiKey) sanitized = sanitized.split(apiKey).join("[REDACTED]");

  return sanitized
    .replace(/Bearer\s+[^\s"']+/gi, "Bearer [REDACTED]")
    .replace(/\b(?:sk-[A-Za-z0-9_-]{8,}|AIza[A-Za-z0-9_-]{20,})\b/g, "[REDACTED]")
    .replace(/((?:api[_-]?key|authorization|token|secret)["']?\s*[:=]\s*["']?)[^"',\s}]+/gi, "$1[REDACTED]");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown JSON parsing error.";
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
