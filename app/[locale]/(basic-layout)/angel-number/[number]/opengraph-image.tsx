import { getReadingForNumber } from "@/lib/angel-numbers";
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
          justifyContent: "center",
          padding: 72,
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            color: "#fbbf24",
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          {reading.number}
        </div>
        <div style={{ marginTop: 28, fontSize: 56, fontWeight: 700 }}>
          {reading.title}
        </div>
        <div style={{ marginTop: 20, fontSize: 30, color: "#ccfbf1" }}>
          {reading.shortMeaning}
        </div>
      </div>
    ),
    size,
  );
}
