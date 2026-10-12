import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="bg-paper px-5 pb-24 pt-40">
      <div className="page">
        <h1 className="max-w-4xl font-display text-heading font-bold text-ink md:text-display">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-140 text-body-sm text-mid">{t("body")}</p>
        <Link href="/" className="btn-fill mt-8">
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
