import { getReadingForNumber } from "@/lib/angel-numbers";
import {
  getAngelDescriptionFromD1,
  getNumerologyDescriptionFromD1,
} from "@/lib/number-meanings-db";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { createElement } from "react";

type OgTool = "angel" | "numerology" | "gematria";

interface OgCardParams {
  tool: OgTool;
  number: string;
  label?: string;
  word?: string;
}

const CARD_SIZE = {
  width: 1200,
  height: 630,
};

const TOOL_STYLES: Record<
  OgTool,
  {
    background: string;
    numberColor: string;
    accent: string;
  }
> = {
  angel: {
    background: "linear-gradient(135deg, #35114f 0%, #1e1b4b 100%)",
    numberColor: "#f0abfc",
    accent: "#d8b4fe",
  },
  numerology: {
    background: "linear-gradient(135deg, #0f2a55 0%, #1e1b4b 100%)",
    numberColor: "#7dd3fc",
    accent: "#bae6fd",
  },
  gematria: {
    background: "linear-gradient(135deg, #3b260d 0%, #1f1608 100%)",
    numberColor: "#fcd34d",
    accent: "#fde68a",
  },
};

export async function GET(request: NextRequest) {
  const parsed = parseOgCardParams(request.nextUrl.searchParams);

  if (!parsed) {
    return new Response("Invalid OG card parameters", { status: 400 });
  }

  const content = await getCardContent(parsed);
  const style = TOOL_STYLES[parsed.tool];

  return new ImageResponse(
    renderShareCard(parsed, content, style, request.nextUrl.host),
    CARD_SIZE,
  );
}

function renderShareCard(
  params: OgCardParams,
  content: CardContent,
  style: (typeof TOOL_STYLES)[OgTool],
  host: string,
) {
  return createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: style.background,
        color: "#fbf6e9",
        fontFamily: "Georgia, serif",
      },
    },
    createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at 82% 12%, rgba(255,255,255,0.08), transparent 24%)",
      },
    }),
    createElement("div", {
      style: {
        position: "absolute",
        inset: 36,
        border: "1px solid rgba(251, 246, 233, 0.22)",
      },
    }),
    createElement(
      "div",
      { style: { position: "relative", display: "flex", flexDirection: "column" } },
      createElement(
        "div",
        {
          style: {
            alignSelf: "flex-start",
            border: "1px solid rgba(251, 246, 233, 0.28)",
            borderRadius: 999,
            padding: "10px 18px",
            color: style.accent,
            fontSize: 24,
            letterSpacing: 4,
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
          },
        },
        content.badge,
      ),
      createElement(
        "div",
        {
          style: {
            marginTop: 44,
            fontSize: params.number.length > 4 ? 132 : 168,
            lineHeight: 0.95,
            color: style.numberColor,
            fontFamily: "Arial, sans-serif",
            fontWeight: 800,
            letterSpacing: 0,
            textShadow: `0 0 34px ${style.numberColor}55`,
          },
        },
        params.number,
      ),
      createElement(
        "div",
        {
          style: {
            marginTop: 28,
            maxWidth: 920,
            fontSize: 54,
            lineHeight: 1.08,
            fontWeight: 700,
          },
        },
        content.title,
      ),
      createElement(
        "div",
        {
          style: {
            marginTop: 24,
            maxWidth: 900,
            color: "rgba(251, 246, 233, 0.78)",
            fontSize: 30,
            lineHeight: 1.35,
            fontFamily: "Arial, sans-serif",
          },
        },
        content.description,
      ),
    ),
    createElement(
      "div",
      {
        style: {
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "rgba(251, 246, 233, 0.72)",
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
        },
      },
      createElement("span", null, host),
      createElement("span", null, content.footer),
    ),
  );
}

function parseOgCardParams(searchParams: URLSearchParams): OgCardParams | null {
  const tool = searchParams.get("tool");
  const number = searchParams.get("number")?.replace(/\D/g, "") ?? "";

  if (!isOgTool(tool) || !/^\d{1,6}$/.test(number)) {
    return null;
  }

  return {
    tool,
    number,
    label: normalizeCardText(searchParams.get("label")),
    word: normalizeCardText(searchParams.get("word")),
  };
}

function isOgTool(tool: string | null): tool is OgTool {
  return tool === "angel" || tool === "numerology" || tool === "gematria";
}

interface CardContent {
  badge: string;
  title: string;
  description: string;
  footer: string;
}

async function getCardContent(params: OgCardParams): Promise<CardContent> {
  if (params.tool === "angel") {
    const reading = getReadingForNumber(params.number);
    return {
      badge: "ANGEL NUMBER",
      title: reading.shortMeaning,
      description: await getAngelDescriptionFromD1(params.number),
      footer: "Decode the number",
    };
  }

  if (params.tool === "numerology") {
    const label = params.label ?? "Numerology";
    return {
      badge: `${label.toUpperCase()} NUMBER`,
      title: `${label} Number ${params.number}`,
      description: await getNumerologyDescriptionFromD1(params.number),
      footer: "Calculate your profile",
    };
  }

  const word = params.word ?? "Your phrase";
  return {
    badge: "GEMATRIA",
    title: `${word} = ${params.number}`,
    description:
      "This calculation gives the word a numeric signature. Compare it across systems, then follow any meaningful number patterns.",
    footer: "Calculate the cipher",
  };
}

function normalizeCardText(value: string | null): string | undefined {
  const trimmed = value?.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, 48);
}
