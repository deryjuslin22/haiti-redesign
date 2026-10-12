import { FlightHero } from "@/components/flight-hero";
import { FlightResults, RouteSearchLink } from "@/components/flight-search";
import { InfoSections } from "@/components/info-sections";
import { Rise, RiseGroup } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  cityStories,
  formatDuration,
  haitiPlaces,
  lowestFare,
  networkRoutes,
} from "@/data/airline";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

const storyFinishes = ["bg-sky", "bg-citrus", "bg-blush"] as const;

export async function HomePage() {
  const t = await getTranslations("home");
  const stories = await getTranslations("stories");
  const airports = await getTranslations("airports");
  const common = await getTranslations("common");
  const locale = await getLocale();

  const places = haitiPlaces.map((place) => ({
    ...place,
    body: t(place.code === "CAP" ? "capBody" : place.code === "PAP" ? "papBody" : "cyaBody"),
    alt: t(place.code === "CAP" ? "capAlt" : place.code === "PAP" ? "papAlt" : "cyaAlt"),
  }));

  return (
    <>
      <FlightHero />

      <FlightResults />

      <section id="destinations" className="band bg-canvas">
        <div className="page">
          <SectionHeading title={t("storiesTitle")} lede={t("storiesLede")} />
          <RiseGroup className="mt-16 grid gap-5 lg:grid-cols-3">
            {cityStories.map((story, index) => (
              <article key={story.slug} id={story.slug} className="rise">
                <div className={`media overflow-hidden rounded-card ${storyFinishes[index]}`}>
                  <Image
                    src={story.image}
                    alt={stories(`${story.slug}.imageAlt`)}
                    width={900}
                    height={1125}
                    className="aspect-4/5 w-full object-cover"
                  />
                </div>
                <p className="mt-6 text-body-sm text-ink">{stories(`${story.slug}.kicker`)}</p>
                <h3 className="mt-1 font-display text-heading-sm font-semibold text-ink">
                  {stories(`${story.slug}.title`)}
                </h3>
                <p className="mt-3 text-body-sm text-mid">
                  {stories(`${story.slug}.body`)}
                </p>
                <p className="mt-3 text-caption text-mid">
                  {formatDuration(story.minutes, locale)} · {common("nonstop")}
                </p>
                <RouteSearchLink
                  from={story.from}
                  to={story.to}
                  date={lowestFare(story.from, story.to)?.date ?? "2026-10-13"}
                  className="link-arrow mt-4 inline-block"
                >
                  {t("seeFlights")} ›
                </RouteSearchLink>
              </article>
            ))}
          </RiseGroup>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="page">
          <SectionHeading title={t("haitiTitle")} lede={t("haitiLede")} />
          <RiseGroup className="mt-16 grid gap-5 md:grid-cols-3">
            {places.map((place) => (
              <article key={place.code} className="rise">
                <div className="media relative overflow-hidden rounded-card">
                  <Image
                    src={place.image}
                    alt={place.alt}
                    width={1600}
                    height={1200}
                    className="aspect-4/3 w-full object-cover"
                    style={{ objectPosition: place.position }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/45 to-transparent" />
                  <p className="absolute bottom-4 left-5 font-display text-heading font-semibold text-white">
                    {place.code}
                  </p>
                </div>
                <h3 className="mt-6 font-display text-heading-sm font-semibold text-ink">
                  {airports(`${place.code}.city`)}
                </h3>
                <p className="mt-3 text-body-sm text-mid">{place.body}</p>
                {"credit" in place ? (
                  <p className="mt-3 text-micro text-mid">
                    <a href={place.credit.href} className="hover:underline" target="_blank" rel="noreferrer">
                      {place.credit.name}
                    </a>
                    {" · "}
                    <a href={place.credit.licenseHref} className="hover:underline" target="_blank" rel="noreferrer">
                      {place.credit.license}
                    </a>
                  </p>
                ) : null}
              </article>
            ))}
          </RiseGroup>
        </div>
      </section>

      <section id="reseau" className="band bg-canvas">
        <div className="page">
          <SectionHeading title={t("networkTitle")} lede={t("networkLede")} />
          <Rise className="mt-16 divide-y divide-hairline">
            {networkRoutes.map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="grid items-baseline gap-x-8 gap-y-1 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                <p className="font-display text-heading-sm font-semibold text-ink">
                  {route.from}
                  <span className="mx-3 text-mid">›</span>
                  {route.to}
                </p>
                <p className="text-body-sm text-mid">
                  {airports(`${route.from}.city`)} › {airports(`${route.to}.city`)}
                </p>
                <p className="text-body-sm text-mid sm:text-right">
                  {formatDuration(route.minutes, locale)} · {common("nonstop")}
                </p>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      <InfoSections />
    </>
  );
}
