const LOCAL_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || LOCAL_SITE_URL).replace(/\/+$/, "");
}

export function buildPublicUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteUrl()}${normalizedPath}`;
}
