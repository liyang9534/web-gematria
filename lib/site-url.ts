const LOCAL_SITE_URL = "http://localhost:3000";

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
    throw new Error(
      "SITE_URL, PUBLIC_SITE_URL, NEXT_PUBLIC_SITE_URL, or CF_PAGES_URL must be configured in production.",
    );
  }

  return LOCAL_SITE_URL;
}

export function buildPublicUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteUrl()}${normalizedPath}`;
}
