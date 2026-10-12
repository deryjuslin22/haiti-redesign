"use client";

import { BrandMark } from "@/components/brand-mark";
import { CurrencySwitch } from "@/components/currency";
import { LanguageSwitch } from "@/components/language-switch";
import { fade, settle } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const links = [
  { href: "#destinations", key: "destinations" },
  { href: "#voyage", key: "travel" },
  { href: "#aide", key: "help" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverHero(entry.isIntersecting && entry.intersectionRatio > 0.18);
      },
      { threshold: [0, 0.18, 0.4, 0.7] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      setAtTop(window.scrollY < 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const inverse = overHero && !open;
  const material = !inverse
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px) saturate(180%)",
      }
    : atTop
      ? {
          backgroundColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(0px)",
        }
      : {
          backgroundColor: "rgba(18, 52, 86, 0.4)",
          backdropFilter: "blur(12px) saturate(160%)",
        };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        data-frost={!inverse ? "" : undefined}
        className="chrome"
        initial={false}
        animate={material}
        transition={reduceMotion ? { duration: 0 } : settle}
      >
        <div className="page flex h-11 items-center gap-2">
          <a
            href="#contenu"
            className={`flex items-center gap-1.5 text-micro font-semibold tracking-[-0.12px] ${
              inverse ? "text-white" : "text-ink"
            }`}
            onClick={() => setOpen(false)}
          >
            <BrandMark crop className="size-4 shrink-0" />
            ZED Airlines
          </a>

          <nav className="ml-4 hidden items-center gap-2 lg:flex" aria-label="Main">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-1 text-micro ${
                  inverse ? "text-white/90 hover:text-white" : "text-ink hover:text-deep"
                }`}
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <LanguageSwitch inverse={inverse} />
            <CurrencySwitch inverse={inverse} />
            <a
              href="tel:+13056077143"
              className={`text-micro ${
                inverse ? "text-white/80 hover:text-white" : "text-deep hover:text-ink"
              }`}
            >
              +1 305-607-7143
            </a>
            <a
              href="#recherche"
              className={
                inverse
                  ? "press rounded-pill bg-paper px-3 py-1 text-micro text-ink hover:bg-white/90"
                  : "press rounded-pill bg-action px-3 py-1 text-micro text-white hover:bg-[#0077ed]"
              }
            >
              {t("book")}
            </a>
          </div>

          <button
            type="button"
            className={`press ml-auto text-micro lg:hidden ${inverse ? "text-white" : "text-ink"}`}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? common("close") : common("menu")}
          </button>
        </div>

        <motion.div
          className="overflow-hidden lg:hidden"
          initial={false}
          animate={{ height: open ? "auto" : 0 }}
          transition={reduceMotion ? { duration: 0 } : settle}
        >
          <motion.div
            inert={!open}
            aria-hidden={!open}
            initial={false}
            animate={
              reduceMotion
                ? { opacity: open ? 1 : 0 }
                : { opacity: open ? 1 : 0, y: open ? 0 : -8 }
            }
            transition={reduceMotion ? fade : settle}
          >
            <div className="bg-nav px-5 py-6">
              <nav className="flex flex-col gap-4" aria-label="Main">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-body text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {t(link.key)}
                  </a>
                ))}
                <a href="#recherche" className="text-body text-ink" onClick={() => setOpen(false)}>
                  {t("book")}
                </a>
              </nav>
              <div className="mt-8 flex items-center gap-4">
                <LanguageSwitch />
                <CurrencySwitch />
              </div>
              <a href="tel:+13056077143" className="mt-6 block text-body-sm text-mid">
                +1 305-607-7143
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </header>
  );
}
