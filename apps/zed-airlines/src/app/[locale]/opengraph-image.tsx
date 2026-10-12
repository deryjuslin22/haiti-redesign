import { BrandMark } from "@/components/brand-mark";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageResponse } from "next/og";

export const alt = "ZED Airlines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const tagline = t("title").split("—").pop()?.trim() || t("title");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f5f7",
          paddingLeft: 88,
          paddingRight: 88,
        }}
      >
        <BrandMark crop size={280} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 64,
            width: 680,
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-1.6px",
              color: "#1d1d1f",
            }}
          >
            ZED Airlines
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#707070",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
