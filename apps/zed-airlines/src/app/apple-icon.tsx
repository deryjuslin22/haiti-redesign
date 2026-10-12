import { BrandMark } from "@/components/brand-mark";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1d1d1f",
        }}
      >
        <BrandMark crop size={180} />
      </div>
    ),
    { ...size },
  );
}
