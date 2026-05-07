const LOCAL_SITE_URL = "http://localhost:3000";

export function normalizePublicSiteUrl(siteUrl: string) {
  return (siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).replace(/\/+$/, "");
}

export function getConfiguredPublicSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL;

  return siteUrl ? normalizePublicSiteUrl(siteUrl) : undefined;
}

export function getPublicSiteUrl() {
  return getConfiguredPublicSiteUrl() || LOCAL_SITE_URL;
}

export function buildPublicUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteUrl()}${normalizedPath}`;
}
