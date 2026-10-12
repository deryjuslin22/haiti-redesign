"use client";

import { fade, settle } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

const iconClass =
  "pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-deep";

function Chevron({ direction }: { direction: "down" | "left" | "right" }) {
  const rotation =
    direction === "left" ? "rotate-90" : direction === "right" ? "-rotate-90" : "";
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`size-4 ${rotation}`}
      fill="none"
    >
      <path
        d="M4 6.25 8 10.25 12 6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none">
      <rect
        x="2.25"
        y="3.25"
        width="11.5"
        height="10.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.25 6.75h11.5M5.5 2.25v2.5M10.5 2.25v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function useDismiss(
  open: boolean,
  close: () => void,
  root: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) close();
    }
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, root]);
}

export function FieldSelect({
  id,
  labelId,
  value,
  options,
  onChange,
  disabled,
}: {
  id?: string;
  labelId?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const valueId = useId();
  const close = useCallback(() => setOpen(false), []);
  const reduceMotion = useReducedMotion();
  useDismiss(open, close, root);

  const selected = options.find((option) => option.value === value) ?? options[0];

  function openList() {
    const index = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    setActive(index);
    setOpen(true);
  }

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(options[active]?.value ?? value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={root} className="relative mt-1">
      <button
        id={id}
        type="button"
        disabled={disabled}
        className="field pr-11 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
        aria-activedescendant={open ? `${listId}-${options[active]?.value}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span id={valueId}>{selected?.label}</span>
      </button>
      <motion.span
        className={iconClass}
        initial={false}
        animate={{ rotate: open ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : settle}
      >
        <Chevron direction="down" />
      </motion.span>
      <motion.ul
        id={listId}
        role="listbox"
        inert={!open}
        aria-hidden={!open}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: open ? 1 : 0, scale: 1 }
            : { opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }
        }
        transition={reduceMotion ? fade : settle}
        style={{ transformOrigin: "top center", pointerEvents: open ? "auto" : "none" }}
        className="menu-scroll absolute top-[calc(100%+8px)] right-0 left-0 z-30 max-h-72 overflow-auto rounded-[16px] border border-hairline bg-paper p-1.5 shadow-[0_18px_50px_-24px_rgba(29,29,31,0.45)]"
      >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === active;
            return (
              <li key={option.value} role="presentation">
                <button
                  id={`${listId}-${option.value}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full rounded-link px-3.5 py-2.5 text-left text-body-sm ${
                    isSelected || isActive ? "bg-wash text-ink" : "text-ink"
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
      </motion.ul>
    </div>
  );
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function DateField({
  id,
  labelId,
  value,
  onChange,
  min,
  disabled,
}: {
  id?: string;
  labelId?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  disabled?: boolean;
}) {
  const t = useTranslations("search");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const base = value ? parseIso(value) : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const root = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const valueId = useId();
  const close = useCallback(() => setOpen(false), []);
  const reduceMotion = useReducedMotion();
  useDismiss(open, close, root);

  const weekStart = locale.startsWith("en") ? 0 : 1;
  const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2026, 0, 4 + weekStart + index),
    ),
  );

  const first = new Date(cursor.year, cursor.month, 1);
  let leading = first.getDay() - weekStart;
  if (leading < 0) leading += 7;
  const count = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: count }, (_, index) => new Date(cursor.year, cursor.month, index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(cursor.year, cursor.month, 1));

  const shown = value
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(parseIso(value))
    : t("chooseDate");

  function shiftMonth(delta: number) {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  }

  function openCalendar() {
    const base = value ? parseIso(value) : min ? parseIso(min) : new Date();
    setCursor({ year: base.getFullYear(), month: base.getMonth() });
    setOpen(true);
  }

  return (
    <div ref={root} className="relative mt-1">
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={`field pr-11 text-left ${value ? "text-ink" : "text-mid"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
        onClick={() => (open ? setOpen(false) : openCalendar())}
      >
        <span id={valueId}>{shown}</span>
      </button>
      <span className={iconClass}>
        <CalendarIcon />
      </span>
      <motion.div
        id={dialogId}
        role="dialog"
        aria-label={monthLabel}
        inert={!open}
        aria-hidden={!open}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: open ? 1 : 0, scale: 1 }
            : { opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }
        }
        transition={reduceMotion ? fade : settle}
        style={{ transformOrigin: "top center", pointerEvents: open ? "auto" : "none" }}
        className="absolute top-[calc(100%+8px)] right-0 left-0 z-30 rounded-[16px] border border-hairline bg-paper p-4 shadow-[0_18px_50px_-24px_rgba(29,29,31,0.45)]"
      >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="press grid size-9 place-items-center rounded-full text-ink hover:bg-wash"
              aria-label={t("prevMonth")}
              onClick={() => shiftMonth(-1)}
            >
              <Chevron direction="left" />
            </button>
            <p className="text-body-sm text-ink capitalize">{monthLabel}</p>
            <button
              type="button"
              className="press grid size-9 place-items-center rounded-full text-ink hover:bg-wash"
              aria-label={t("nextMonth")}
              onClick={() => shiftMonth(1)}
            >
              <Chevron direction="right" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {weekdayLabels.map((label) => (
              <span key={label} className="py-1 text-micro text-mid">
                {label.replace(".", "")}
              </span>
            ))}
            {cells.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} />;
              const iso = toIso(date);
              const isSelected = iso === value;
              const isDisabled = Boolean(min && iso < min);
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`press grid aspect-square w-full place-items-center rounded-full text-caption ${
                    isSelected
                      ? "bg-action text-paper"
                      : isDisabled
                        ? "text-mid/40"
                        : "text-ink hover:bg-wash"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
      </motion.div>
    </div>
  );
}
