const LOCAL_SITE_URL = "http://localhost:3000";
const CANONICAL_SITE_URL = "https://mynumberdecoder.com";

export function normalizePublicSiteUrl(siteUrl: string) {
  return (siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).replace(/\/+$/, "");
}

export function getConfiguredPublicSiteUrl() {
  const siteUrl =
    process.env.SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL;

  return siteUrl ? normalizePublicSiteUrl(siteUrl) : undefined;
}

export function getPublicSiteUrl() {
  const configuredSiteUrl = getConfiguredPublicSiteUrl();

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return normalizePublicSiteUrl(window.location.origin);
  }

  if (process.env.NODE_ENV === "production") {
    return CANONICAL_SITE_URL;
  }

  return LOCAL_SITE_URL;
}

export function buildPublicUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteUrl()}${normalizedPath}`;
}
