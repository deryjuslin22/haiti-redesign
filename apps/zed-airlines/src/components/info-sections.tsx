import { Accordion } from "@/components/accordion";
import { CopyBlock, Rise, RiseGroup } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { fareFamilies, baggageFacts } from "@/data/airline";
import { getTranslations } from "next-intl/server";

export async function InfoSections() {
  const travel = await getTranslations("travelPage");
  const topics = await getTranslations("topics");
  const families = await getTranslations("families");
  const common = await getTranslations("common");
  const help = await getTranslations("helpPage");
  const faq = help.raw("faq") as { q: string; a: string }[];

  return (
    <>
      <section id="voyage" className="band bg-paper">
        <div className="page">
          <SectionHeading title={travel("title")} lede={travel("lede")} />

          <article id="enregistrement" className="mt-20">
            <CopyBlock
              as="h3"
              title={topics("check-in.title")}
              lede={topics("check-in.lede")}
              titleClassName="font-display text-heading-sm font-semibold text-ink"
            />
            <RiseGroup as="dl" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["check-in.opens", "check-in.opensValue"],
                  ["check-in.arrive", "check-in.arriveValue"],
                  ["check-in.closes", "check-in.closesValue"],
                  ["check-in.gate", "check-in.gateValue"],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="card rise bg-canvas">
                  <dt className="text-micro text-mid">{topics(label)}</dt>
                  <dd className="mt-3 font-display text-heading-sm font-semibold text-ink">
                    {topics(value).split(" ").map((part, index) => (
                      <span key={part} className={index > 0 ? "block" : undefined}>
                        {part}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </RiseGroup>
            <p className="mt-6 max-w-140 text-caption text-mid">{topics("check-in.late")}</p>
          </article>

          <article id="bagages" className="mt-24">
            <CopyBlock
              as="h3"
              title={topics("baggage.title")}
              lede={topics("baggage.carryBody")}
              titleClassName="font-display text-heading-sm font-semibold text-ink"
            />
            <Rise className="card mt-8 overflow-x-auto bg-canvas">
              <table className="w-full table-fixed text-left text-body-sm">
                <thead>
                  <tr className="border-b border-hairline text-micro text-mid">
                    <th className="w-1/4 py-3 pr-4 font-normal">{topics("onboard.family")}</th>
                    {fareFamilies.map((fare) => (
                      <th key={fare.id} className="w-1/4 py-3 pr-4 font-normal">
                        {families(fare.id)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <th className="py-4 pr-4 font-normal text-ink">{topics("baggage.carryTitle")}</th>
                    {fareFamilies.map((fare) => (
                      <td key={fare.id} className="py-4 pr-4 text-mid">
                        {baggageFacts.carryKg} kg
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="py-4 pr-4 font-normal text-ink">{topics("onboard.checked")}</th>
                    {fareFamilies.map((fare) => (
                      <td key={fare.id} className="py-4 pr-4 text-mid">
                        {fare.bags} × {baggageFacts.checkedKg} kg
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Rise>
            <p className="mt-6 text-caption text-mid">
              {topics("baggage.extraBag")} · ${baggageFacts.extraBagUsd.toFixed(2)} ·{" "}
              {topics("baggage.overweight")} · ${baggageFacts.overweightUsd.toFixed(2)}
            </p>
            <p className="mt-4 text-caption text-mid">{topics("baggage.infantBody")}</p>
            <p className="mt-3 text-caption text-mid">{topics("baggage.lithium")}</p>
          </article>

          <article id="documents" className="mt-24">
            <CopyBlock
              as="h3"
              title={topics("documents.title")}
              lede={topics("documents.lede")}
              titleClassName="font-display text-heading-sm font-semibold text-ink"
            />
            <RiseGroup as="dl" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["documents.passportTitle", "documents.passportBody"],
                  ["documents.visaTitle", "documents.visaBody"],
                  ["baggage.infantTitle", "documents.infant"],
                ] as const
              ).map(([label, value]) => (
                <div key={value} className="card rise bg-canvas">
                  <dt className="text-micro text-mid">{topics(label)}</dt>
                  <dd className="mt-3 text-body-sm text-ink">{topics(value)}</dd>
                </div>
              ))}
            </RiseGroup>
          </article>

          <article id="abord" className="mt-24">
            <CopyBlock
              as="h3"
              title={topics("onboard.title")}
              lede={topics("onboard.lede")}
              titleClassName="font-display text-heading-sm font-semibold text-ink"
            />
            <Rise className="card mt-8 overflow-x-auto bg-canvas">
              <table className="w-full min-w-xl text-left text-body-sm">
                <thead>
                  <tr className="border-b border-hairline text-micro text-mid">
                    <th className="py-3 font-normal">{topics("onboard.family")}</th>
                    {fareFamilies.map((fare) => (
                      <th key={fare.id} className="py-3 font-normal">
                        {families(fare.id)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <th className="py-4 font-normal text-ink">{topics("onboard.seat")}</th>
                    {fareFamilies.map((fare) => (
                      <td key={fare.id} className="text-mid">
                        {fare.seat === "included" ? common("included") : common("fee")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="py-4 font-normal text-ink">{topics("onboard.changes")}</th>
                    {fareFamilies.map((fare) => (
                      <td key={fare.id} className="text-mid">
                        {fare.change === "free" ? common("freeChange") : common("paidChange")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="py-4 font-normal text-ink">{topics("onboard.refund")}</th>
                    {fareFamilies.map((fare) => (
                      <td key={fare.id} className="text-mid">
                        {common("noRefund")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Rise>
            <p className="mt-6 max-w-180 text-caption text-mid">{topics("onboard.rules")}</p>
          </article>
        </div>
      </section>

      <section id="aide" className="band bg-canvas">
        <div className="page">
          <div id="faq">
            <CopyBlock as="h2" title={help("faqTitle")} className="mb-8" />
            <Accordion items={faq} />
          </div>
        </div>
      </section>
    </>
  );
}
