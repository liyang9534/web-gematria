import { siteConfig } from "@/config/site";

export type ShareCardTool = "angel" | "numerology" | "gematria";

export interface ShareCardInput {
  tool: ShareCardTool;
  number: string;
  label?: string;
  word?: string;
  resultUrl: string;
}

export type SocialSharePlatform =
  | "facebook"
  | "linkedin"
  | "reddit"
  | "threads"
  | "whatsapp"
  | "telegram"
  | "pinterest"
  | "email";

export type SocialShareUrls = Record<SocialSharePlatform, string>;

export const INSTAGRAM_SHARE_URL = "https://www.instagram.com/";
export const TIKTOK_SHARE_URL = "https://www.tiktok.com/upload";

export function buildShareCardUrl(input: ShareCardInput): string {
  const params = new URLSearchParams();
  params.set("tool", input.tool);
  params.set("number", input.number);

  if (input.label) {
    params.set("label", input.label);
  }

  if (input.word) {
    params.set("word", input.word);
  }

  return `/api/og?${params.toString()}`;
}

export function createShareCardDownloadName(input: ShareCardInput): string {
  const parts = [input.tool, input.label, input.word, input.number]
    .filter(Boolean)
    .map((part) => slugifySharePart(part as string));

  return `${parts.join("-")}.png`;
}

export function createXIntentUrl(input: ShareCardInput): string {
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("text", createXShareText(input));
  url.searchParams.set("url", input.resultUrl);
  return url.toString();
}

export function createSocialShareUrls(input: ShareCardInput): SocialShareUrls {
  const shareText = createXShareText(input);
  const imageUrl = getAbsoluteResultUrl(buildShareCardUrl(input));

  return {
    facebook: createUrl("https://www.facebook.com/sharer/sharer.php", {
      u: input.resultUrl,
    }),
    linkedin: createUrl("https://www.linkedin.com/sharing/share-offsite/", {
      url: input.resultUrl,
    }),
    reddit: createUrl("https://www.reddit.com/submit", {
      url: input.resultUrl,
      title: shareText,
    }),
    threads: createUrl("https://www.threads.net/intent/post", {
      text: `${shareText} ${input.resultUrl}`,
    }),
    whatsapp: createUrl("https://api.whatsapp.com/send", {
      text: `${shareText} ${input.resultUrl}`,
    }),
    telegram: createUrl("https://t.me/share/url", {
      url: input.resultUrl,
      text: shareText,
    }),
    pinterest: createUrl("https://www.pinterest.com/pin/create/button/", {
      url: input.resultUrl,
      media: imageUrl,
      description: shareText,
    }),
    email: `mailto:?subject=${encodeURIComponent(siteConfig.name)}&body=${encodeURIComponent(
      `${shareText}\n\n${input.resultUrl}`,
    )}`,
  };
}

export function createShareLinkText(input: ShareCardInput): string {
  return input.resultUrl;
}

export function getAbsoluteResultUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteConfig.url}${path}`;
}

function createXShareText(input: ShareCardInput): string {
  if (input.tool === "angel") {
    return `My angel number is ${input.number} - discover yours at ${siteConfig.name}`;
  }

  if (input.tool === "numerology") {
    const label = input.label ?? "Numerology";
    return `My ${label} Number is ${input.number} - discover yours at ${siteConfig.name}`;
  }

  const word = input.word ? ` for ${input.word}` : "";
  return `My Gematria result${word} is ${input.number} - discover yours at ${siteConfig.name}`;
}

function slugifySharePart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createUrl(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}
