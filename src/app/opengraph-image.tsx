import { ImageResponse } from "next/og";
import { ctas } from "@/data/ctas";

export const alt = "Noah Buller — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const buildings = [
  { w: 90, h: 220, c: "#16303f" },
  { w: 70, h: 150, c: "#274156" },
  { w: 110, h: 300, c: "#16303f" },
  { w: 80, h: 180, c: "#274156" },
  { w: 95, h: 250, c: "#16303f" },
  { w: 70, h: 160, c: "#274156" },
  { w: 120, h: 320, c: "#16303f" },
  { w: 80, h: 200, c: "#274156" },
  { w: 100, h: 260, c: "#16303f" },
  { w: 75, h: 170, c: "#274156" },
  { w: 110, h: 240, c: "#16303f" },
  { w: 90, h: 190, c: "#274156" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #0d3b66 0%, #2a6f97 58%, #ffc59e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 150,
            width: 180,
            height: 180,
            borderRadius: 90,
            background: "#ffcf5c",
            boxShadow: "0 0 120px 40px rgba(255,207,92,0.55)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {buildings.map((b, i) => (
            <div key={i} style={{ width: b.w, height: b.h, background: b.c }} />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 80,
            top: 190,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 22px",
              marginBottom: 26,
              borderRadius: 999,
              border: "3px solid #ffd166",
              color: "#ffd166",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 6,
            }}
          >
            PORTFOLIO
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              color: "#f5f0e8",
              letterSpacing: 2,
            }}
          >
            {ctas.hero.label}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: "#cfd8dd",
              letterSpacing: 10,
              textTransform: "uppercase",
            }}
          >
            {ctas.hero.subtitle}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
