import { contacts } from "@/data/airline";
import { getTranslations } from "next-intl/server";

function tel(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const help = await getTranslations("helpPage");

  return (
    <footer className="bg-canvas text-mid">
      <div className="page grid gap-12 py-25 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-heading-sm font-semibold text-ink">ZED Airlines</p>
          <p className="mt-4 max-w-sm text-body-sm text-mid">{t("blurb")}</p>
          <p className="mt-8 text-micro text-mid">{t("social")}</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-micro">
            {contacts.socials.map((social) => (
              <li key={social.id}>
                <a href={social.href} className="text-link hover:underline" target="_blank" rel="noreferrer">
                  {social.id}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 md:col-span-5">
          <div>
            <p className="text-micro text-mid">{t("book")}</p>
            <ul className="mt-3 space-y-2 text-micro">
              <li><a href="#recherche" className="text-link hover:underline">{nav("search")}</a></li>
              <li><a href="#destinations" className="text-link hover:underline">{nav("where")}</a></li>
            </ul>
          </div>
          <div>
            <p className="text-micro text-mid">{t("travel")}</p>
            <ul className="mt-3 space-y-2 text-micro">
              <li><a href="#enregistrement" className="text-link hover:underline">{nav("checkin")}</a></li>
              <li><a href="#bagages" className="text-link hover:underline">{nav("baggage")}</a></li>
              <li><a href="#documents" className="text-link hover:underline">{nav("documents")}</a></li>
              <li><a href="#abord" className="text-link hover:underline">{nav("onboard")}</a></li>
            </ul>
          </div>
          <div>
            <p className="text-micro text-mid">{t("company")}</p>
            <ul className="mt-3 space-y-2 text-micro">
              <li><a href="#faq" className="text-link hover:underline">{nav("faq")}</a></li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-micro text-mid">{t("contact")}</p>
          <ul className="mt-3 space-y-4 text-micro">
            {contacts.regions.map((region) => (
              <li key={region.id}>
                <p className="text-mid">{help(`regions.${region.id}`)}</p>
                {region.phones.map((phone) => (
                  <a key={phone} href={tel(phone)} className="block text-link hover:underline">
                    {phone}
                  </a>
                ))}
              </li>
            ))}
            <li>
              <a href={`mailto:${contacts.email}`} className="text-link hover:underline">
                {contacts.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="page pb-10 text-micro leading-[1.33] text-mid">
        <p className="max-w-3xl">{t("disclaimer")}</p>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p>{t("rights")}</p>
          <p className="ml-auto">
            {t("made")}{" "}
            <a
              href="https://deryjuslin.com"
              className="credit-name text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dery JUSLIN
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
