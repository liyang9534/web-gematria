import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export const alt = "Angel Number Decoder";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
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
          background: "linear-gradient(135deg, #17110b 0%, #101422 48%, #241638 100%)",
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
            right: 72,
            top: 186,
            height: 1,
            background: "linear-gradient(90deg, rgba(201,169,97,0.75), rgba(251,246,233,0.05))",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              border: "1px solid rgba(201,169,97,0.45)",
              color: "#d8c18a",
              padding: "12px 18px",
              fontFamily: "Arial, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                fontSize: 84,
                lineHeight: 0.98,
                fontWeight: 700,
                letterSpacing: -1,
              }}
            >
              Decode the signal behind every number.
            </div>
            <div
              style={{
                color: "rgba(251, 246, 233, 0.74)",
                fontFamily: "Arial, sans-serif",
                fontSize: 30,
                lineHeight: 1.35,
                maxWidth: 760,
              }}
            >
              Angel numbers, numerology, and gematria tools for patterns that keep finding you.
            </div>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(251, 246, 233, 0.68)",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
          }}
        >
          <span>{new URL(siteConfig.url).hostname}</span>
          <span>Angel Numbers · Numerology · Gematria</span>
        </div>
      </div>
    ),
    size,
  );
}
