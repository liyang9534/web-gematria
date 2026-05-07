const LOCAL_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL ||
    LOCAL_SITE_URL;

  return (siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).replace(/\/+$/, "");
}

export function buildPublicUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteUrl()}${normalizedPath}`;
}
