"use client";

import { GlassMenu } from "@/components/glass-menu";
import { useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const names: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export function LanguageSwitch({ inverse = false }: { inverse?: boolean }) {
  const locale = useLocale() as Locale;
  const common = useTranslations("common");
  const router = useRouter();

  function switchTo(next: Locale) {
    const hash = window.location.hash;
    router.replace("/", { locale: next });
    if (hash) {
      window.setTimeout(() => {
        if (!window.location.hash) {
          history.replaceState(null, "", `${window.location.pathname}${hash}`);
          document.querySelector(hash)?.scrollIntoView();
        }
      }, 80);
    }
  }

  return (
    <GlassMenu
      label={common("language")}
      value={locale}
      inverse={inverse}
      onChange={switchTo}
      options={routing.locales.map((option) => ({
        value: option,
        label: names[option],
        short: option.toUpperCase(),
      }))}
    />
  );
}
