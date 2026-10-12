"use client";

import { Price } from "@/components/currency";
import { fade, reposition } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import {
  faresBetween,
  formatDuration,
  formatLongDate,
  isAirportCode,
  routeMinutes,
  type AirportCode,
  type Fare,
} from "@/data/airline";
import { useLocale, useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FlightQuery = {
  from: AirportCode;
  to: AirportCode;
  trip: "round" | "one";
  depart: string;
  ret?: string;
  adults: number;
};

const SearchContext = createContext<{
  query: FlightQuery | null;
  search: (query: FlightQuery) => void;
} | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<FlightQuery | null>(null);
  const search = useCallback((next: FlightQuery) => {
    setQuery(next);
  }, []);

  return (
    <SearchContext.Provider value={{ query, search }}>{children}</SearchContext.Provider>
  );
}

export function useFlightSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useFlightSearch must be used within SearchProvider");
  }
  return context;
}

export function FlightResults() {
  const { query } = useFlightSearch();
  const t = useTranslations("flightsPage");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!query) return;
    document.getElementById("resultats")?.scrollIntoView({ behavior: "smooth" });
  }, [query]);

  if (!query) return null;

  return (
    <motion.section
      id="resultats"
      key={`${query.from}-${query.to}-${query.depart}-${query.ret ?? ""}`}
      className="band bg-paper"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, transform: "translateY(8px)" }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, transform: "translateY(0px)" }
      }
      transition={reduceMotion ? fade : reposition}
    >
      <div className="page">
        <SectionHeading kicker={t("kicker")} title={t("title")} />
        <Results query={query} />
      </div>
    </motion.section>
  );
}

function Results({ query }: { query: FlightQuery }) {
  const t = useTranslations("flightsPage");
  const locale = useLocale();

  return (
    <div className="mt-8 text-left">
      <p className="text-micro text-mid">
        {t("passengers", { count: query.adults })}
      </p>
      <div className="mt-4 grid gap-2 lg:grid-cols-2">
        <Direction title={t("outbound")} from={query.from} to={query.to} date={query.depart} />
        {query.trip === "round" && query.ret ? (
          <Direction title={t("return")} from={query.to} to={query.from} date={query.ret} />
        ) : null}
      </div>
      <p className="mt-6 text-body-sm text-mid">
        {t("match", { date: formatLongDate(query.depart, locale) })}
      </p>
    </div>
  );
}

function Direction({
  title,
  from,
  to,
  date,
}: {
  title: string;
  from: string;
  to: string;
  date: string;
}) {
  const t = useTranslations("flightsPage");
  const airports = useTranslations("airports");
  const common = useTranslations("common");
  const locale = useLocale();
  const all = isAirportCode(from) && isAirportCode(to) ? faresBetween(from, to) : [];
  const exact = all.filter((fare) => fare.date === date);
  const minutes = routeMinutes(from, to);

  return (
    <article className="card bg-canvas">
      <p className="text-micro text-mid">{title}</p>
      <h3 className="mt-3 font-display text-heading-sm font-semibold text-ink">
        {from}
        <span className="mx-3 text-mid">›</span>
        {to}
      </h3>
      <p className="mt-2 text-body-sm text-mid">
        {isAirportCode(from) ? airports(`${from}.city`) : from}
        <span> › </span>
        {isAirportCode(to) ? airports(`${to}.city`) : to}
        {minutes ? ` · ${formatDuration(minutes, locale)} · ${common("nonstop")}` : ""}
      </p>
      {exact.length > 0 ? (
        <ul className="mt-6 divide-y divide-hairline">
          {exact.map((fare) => (
            <li key={fare.date + fare.price} className="flex items-center justify-between gap-4 py-3">
              <span className="text-body-sm">{formatLongDate(fare.date, locale)}</span>
              <Price amount={fare.price} className="font-display text-subheading font-semibold" />
            </li>
          ))}
        </ul>
      ) : all.length > 0 ? (
        <div className="mt-4">
          <p className="text-body-sm text-mid">{t("none")}</p>
          <p className="mt-6 text-micro text-mid">{t("next")}</p>
          <ul className="mt-2 divide-y divide-hairline">
            {all.map((fare) => (
              <li key={fare.date + fare.price} className="flex items-center justify-between gap-4 py-3">
                <span className="text-body-sm">{formatLongDate(fare.date, locale)}</span>
                <Price amount={fare.price} className="font-display text-body-lg font-semibold" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-6 text-body-sm text-mid">{t("unknown")}</p>
      )}
    </article>
  );
}

export function FareCard({ fare }: { fare: Fare }) {
  const airports = useTranslations("airports");
  const common = useTranslations("common");
  const locale = useLocale();
  const { search } = useFlightSearch();

  return (
    <button
      type="button"
      onClick={() =>
        search({
          from: fare.from,
          to: fare.to,
          trip: "one",
          depart: fare.date,
          adults: 1,
        })
      }
      className="card flex h-full w-full cursor-pointer flex-col text-left hover:bg-wash"
    >
      <p className="font-display text-heading-sm font-semibold text-ink">
        {fare.from}
        <span className="mx-3 text-mid">›</span>
        {fare.to}
      </p>
      <p className="mt-2 text-body-sm text-mid">
        {airports(`${fare.from}.city`)} › {airports(`${fare.to}.city`)}
      </p>
      <Price amount={fare.price} className="mt-8 font-display text-heading-sm font-semibold text-ink" />
      <p className="mt-2 text-caption text-mid">
        {common("lowestOn", { date: formatLongDate(fare.date, locale) })}
      </p>
    </button>
  );
}

export function RouteSearchLink({
  from,
  to,
  date,
  className,
  children,
}: {
  from: AirportCode;
  to: AirportCode;
  date: string;
  className?: string;
  children: ReactNode;
}) {
  const { search } = useFlightSearch();

  return (
    <a
      href="#resultats"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        search({ from, to, trip: "one", depart: date, adults: 1 });
      }}
    >
      {children}
    </a>
  );
}
