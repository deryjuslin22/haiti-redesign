"use client";

import { GlassMenu } from "@/components/glass-menu";
import { HTG_PER_USD } from "@/data/airline";
import { useLocale, useTranslations } from "next-intl";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Currency = "USD" | "HTG";

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
} | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const value = useMemo(() => ({ currency, setCurrency }), [currency]);
  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}

export function CurrencySwitch({ inverse = false }: { inverse?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  const common = useTranslations("common");

  return (
    <GlassMenu
      label={common("currency")}
      value={currency}
      inverse={inverse}
      onChange={setCurrency}
      options={[
        { value: "USD", label: common("usdName"), short: "USD", detail: "USD" },
        { value: "HTG", label: common("htgName"), short: "HTG", detail: "HTG" },
      ]}
    />
  );
}

export function Price({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const { currency } = useCurrency();
  const locale = useLocale();
  const value = currency === "HTG" ? Math.round(amount * HTG_PER_USD) : amount;
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "HTG" ? 0 : 2,
  }).format(value);

  return <span className={className}>{formatted}</span>;
}
