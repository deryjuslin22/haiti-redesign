"use client";

import { SplitCopy } from "@/components/reveal";
import { SearchForm } from "@/components/search-form";
import { CloudShader } from "@/components/ui/cloud-shader";
import { useTranslations } from "next-intl";

export function FlightHero() {
  const t = useTranslations("home");

  return (
    <section
      id="hero"
      className="relative bg-linear-to-t from-[#8cbfe8] to-[#3876ba]"
    >
      <div className="hero-sky pointer-events-none absolute inset-0 overflow-hidden">
        {/* Half resolution, drawn at 2×. The clouds are soft, so the
            upscale stays clean and the drift stays smooth. */}
        <div
          className="absolute top-0 left-0 h-1/2 w-1/2"
          style={{ transform: "scale(2)", transformOrigin: "top left" }}
        >
          <CloudShader speed={1} className="absolute inset-0 min-h-0" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,52,86,0.42)_0%,rgba(18,52,86,0.14)_46%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#123456]/50 to-transparent" />

      <div className="relative z-20 mx-auto w-full max-w-300 px-5 pt-24 md:px-10 md:pt-28">
        <div className="max-w-2xl">
          <h1 className="mt-2 font-display text-heading font-bold text-white [text-shadow:0_2px_18px_rgba(15,42,67,0.35)] md:text-heading-lg lg:text-display">
            <SplitCopy text={t("line1")} tag="span" tone="hero" className="block" />
            <SplitCopy text={t("line2")} tag="span" tone="hero" start={0.1} className="block" />
          </h1>
          <SplitCopy
            text={t("lede")}
            tone="sub"
            start={0.2}
            className="mt-4 max-w-xl text-body-sm text-white/85 md:text-body"
          />
        </div>
      </div>

      {/* <div className="hero-wing pointer-events-none absolute bottom-0 left-0 z-10 w-[92%] md:w-[68%]">
        <Image
          src="/hero/plane-wing.png"
          alt={t("wingAlt")}
          width={2200}
          height={1227}
          priority
          className="h-auto w-full drop-shadow-[0_18px_28px_rgba(15,42,67,0.22)]"
        />
      </div> */}

      <div className="page relative z-30 mt-10 pb-6 md:mt-14 md:pb-8">
        <SearchForm className="card-settle shadow-[0_28px_70px_-28px_rgba(15,42,67,0.45)]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none relative z-20 h-20 bg-linear-to-b from-transparent to-canvas md:h-28"
      />
    </section>
  );
}
