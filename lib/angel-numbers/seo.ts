import { siteConfig } from "@/config/site";
import type { AngelNumber, AngelNumberReading } from "@/types/angel-number";
import type { Metadata } from "next";

export function getAngelNumberPath(slug: string) {
  return `/angel-number/${slug}`;
}

export function getAngelNumberCanonicalUrl(angelNumber: AngelNumber) {
  return `${siteConfig.url}${getAngelNumberPath(angelNumber.slug)}`;
}

export function getAngelNumberKeywords(angelNumber: AngelNumber) {
  return [
    ...angelNumber.meta.keywords,
    `${angelNumber.number} angel number`,
    `what does ${angelNumber.number} mean`,
  ];
}

export function getAngelNumberRobotsPolicy(
  reading: AngelNumberReading,
): Metadata["robots"] | undefined {
  if (reading.seo.shouldIndex) {
    return undefined;
  }

  return {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  };
}
