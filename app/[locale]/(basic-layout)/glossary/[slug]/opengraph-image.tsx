import { siteConfig } from "@/config/site";
import { glossaryCms } from "@/lib/cms";
import { ImageResponse } from "next/og";

export const alt = "Glossary Entry";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function Image({ params }: Props) {
  const { locale, slug } = await params;
  const { metadata } = await glossaryCms.getPostMetadata(slug, locale);

  if (!metadata) {
    // Return a default image if post not found
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            backgroundColor: "#fafafa",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
          }}
        >
          <div>{siteConfig.name}</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Truncate title if too long (max 2 lines)
  const title =
    metadata.title.length > 60
      ? metadata.title.substring(0, 60) + "..."
      : metadata.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #101422 0%, #151c2d 48%, #2b220f 100%)",
          color: "#fbf6e9",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: "1px solid rgba(251, 246, 233, 0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 186,
            width: 520,
            height: 1,
            background: "linear-gradient(90deg, rgba(125,211,252,0.64), rgba(251,246,233,0.04))",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              border: "1px solid rgba(125,211,252,0.38)",
              color: "#bae6fd",
              padding: "12px 18px",
              fontFamily: "Arial, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Glossary
          </div>
          <div
            style={{
              fontSize: title.length > 40 ? 56 : 68,
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {metadata.description && (
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 28,
                lineHeight: 1.36,
                color: "rgba(251, 246, 233, 0.72)",
                maxWidth: 840,
              }}
            >
              {metadata.description.length > 150
                ? metadata.description.substring(0, 150) + "..."
                : metadata.description}
            </div>
          )}
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(251, 246, 233, 0.68)",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
          }}
        >
          <span>{siteConfig.name}</span>
          <span>{new URL(siteConfig.url).hostname}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
