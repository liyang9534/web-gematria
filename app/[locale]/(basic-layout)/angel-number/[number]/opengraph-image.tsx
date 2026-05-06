import { getReadingForNumber } from "@/lib/angel-numbers";
import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export const alt = "Angel Number Meaning";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Params = Promise<{ number: string }>;

export default async function Image({ params }: { params: Params }) {
  const { number } = await params;
  const reading = getReadingForNumber(number);

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
          background: "linear-gradient(135deg, #17110b 0%, #121622 44%, #2a1742 100%)",
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
            top: 190,
            width: 420,
            height: 1,
            background: "linear-gradient(90deg, rgba(216,180,254,0.75), rgba(251,246,233,0.04))",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              border: "1px solid rgba(216,180,254,0.36)",
              color: "#d8b4fe",
              padding: "12px 18px",
              fontFamily: "Arial, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            ANGEL NUMBER
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 34,
            }}
          >
            <div
              style={{
                color: "#f0abfc",
                fontFamily: "Arial, sans-serif",
                fontSize: reading.number.length > 4 ? 128 : 172,
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 0.9,
                textShadow: "0 0 34px rgba(240,171,252,0.28)",
              }}
            >
              {reading.number}
            </div>
            <div
              style={{
                color: "rgba(251, 246, 233, 0.62)",
                fontFamily: "Arial, sans-serif",
                fontSize: 28,
                paddingBottom: 12,
              }}
            >
              recurring signal
            </div>
          </div>
          <div
            style={{
              maxWidth: 930,
              fontSize: 62,
              lineHeight: 1.04,
              fontWeight: 700,
            }}
          >
            {reading.title}
          </div>
          <div
            style={{
              maxWidth: 850,
              fontFamily: "Arial, sans-serif",
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(251, 246, 233, 0.74)",
            }}
          >
            {reading.shortMeaning}
          </div>
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
    size,
  );
}
