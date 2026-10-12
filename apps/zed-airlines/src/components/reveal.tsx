"use client";

import SplitText from "@/components/SplitText";
import { splitEase } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { createElement, useEffect, useRef, type ReactNode } from "react";

function watch(el: HTMLElement) {
  if (el.hasAttribute("data-visible")) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let observer: IntersectionObserver | null = null;

  function show() {
    el.setAttribute("data-visible", "");
    observer?.disconnect();
    el.removeEventListener("focusin", show);
  }

  if (reduce) {
    show();
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) show();
    },
    { rootMargin: "0px 0px -80px 0px", threshold: 0.01 },
  );
  observer.observe(el);
  el.addEventListener("focusin", show);

  return () => {
    observer?.disconnect();
    el.removeEventListener("focusin", show);
  };
}

function useWatch() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watch(el);
  }, []);

  return ref;
}

const shared = {
  ease: splitEase,
  textAlign: "left" as const,
  to: { opacity: 1, y: 0 },
};

export function SplitCopy({
  text,
  tag = "p",
  tone = "title",
  start = 0,
  className,
}: {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  tone?: "hero" | "title" | "sub";
  start?: number;
  className?: string;
}) {
  const above = tone === "hero";
  const motion =
    tone === "hero"
      ? { splitType: "chars" as const, delay: 22, duration: 0.85, from: { opacity: 0, y: 18 } }
      : tone === "title"
        ? { splitType: "words" as const, delay: 36, duration: 0.75, from: { opacity: 0, y: 14 } }
        : { splitType: "words" as const, delay: 24, duration: 0.65, from: { opacity: 0, y: 10 } };

  return (
    <SplitText
      text={text}
      tag={tag}
      className={className}
      ease={shared.ease}
      textAlign={shared.textAlign}
      splitType={motion.splitType}
      delay={motion.delay}
      duration={motion.duration}
      from={motion.from}
      to={start ? { ...shared.to, delay: start } : shared.to}
      threshold={above ? 0 : 0.2}
      rootMargin={above ? "0px" : "-60px"}
    />
  );
}

export function CopyBlock({
  as = "h2",
  kicker,
  title,
  lede,
  className,
  titleClassName,
  ledeClassName,
}: {
  as?: "h2" | "h3";
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  titleClassName?: string;
  ledeClassName?: string;
}) {
  const titleClass =
    titleClassName ??
    `font-display text-heading-sm font-semibold text-ink md:text-heading ${kicker ? "mt-2" : ""}`;

  return (
    <div className={cn("text-left", className)}>
      {typeof kicker === "string" ? (
        <SplitCopy text={kicker} tone="sub" className="text-body-sm text-ink" />
      ) : kicker ? (
        <p className="text-body-sm text-ink">{kicker}</p>
      ) : null}
      {typeof title === "string" ? (
        <SplitCopy text={title} tag={as} tone="title" start={kicker ? 0.06 : 0} className={titleClass} />
      ) : (
        <Heading as={as} className={titleClass}>
          {title}
        </Heading>
      )}
      {typeof lede === "string" ? (
        <SplitCopy
          text={lede}
          tone="sub"
          start={0.08}
          className={cn("mt-4 max-w-140 text-body-sm text-mid", ledeClassName)}
        />
      ) : lede ? (
        <p className={cn("mt-4 max-w-140 text-body-sm text-mid", ledeClassName)}>{lede}</p>
      ) : null}
    </div>
  );
}

function Heading({
  as,
  className,
  children,
}: {
  as: "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return createElement(as, { className }, children);
}

export function Rise({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useWatch();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={cn("rise", className)}>
      {children}
    </div>
  );
}

export function RiseGroup({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "dl";
  className?: string;
  children: ReactNode;
}) {
  const ref = useWatch();

  return createElement(as, { ref, className: cn("rise-group", className) }, children);
}
