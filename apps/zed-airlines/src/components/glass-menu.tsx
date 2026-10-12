"use client";

import { fade, settle } from "@/lib/motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

const closeOthers = "zed-glass-menu";

type Box = {
  top: number;
  left?: number;
  right?: number;
  width: number;
  origin: "top right" | "top left";
};

export function GlassMenu<T extends string>({
  label,
  value,
  options,
  onChange,
  inverse = false,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; short?: string; detail?: string }[];
  onChange: (value: T) => void;
  inverse?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [mounted, setMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const reduceMotion = useReducedMotion();
  const selected = options.find((option) => option.value === value) ?? options[0];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onOther(event: Event) {
      if ((event as CustomEvent<string>).detail !== listId) close();
    }
    window.addEventListener(closeOthers, onOther);
    return () => window.removeEventListener(closeOthers, onOther);
  }, [close, listId]);

  useEffect(() => {
    if (!open) return;
    function place() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect || rect.height === 0) {
        close();
        return;
      }
      const minWidth = 196;
      const alignEnd = rect.right - minWidth >= 8;
      const next: Box = {
        top: rect.bottom + 6,
        width: rect.width,
        origin: alignEnd ? "top right" : "top left",
        ...(alignEnd
          ? { right: document.documentElement.clientWidth - rect.right }
          : { left: rect.left }),
      };
      setBox((current) =>
        current &&
        current.top === next.top &&
        current.left === next.left &&
        current.right === next.right &&
        current.width === next.width &&
        current.origin === next.origin
          ? current
          : next,
      );
    }
    place();
    const frame = window.setInterval(place, 100);
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (root.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    }
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(frame);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  function openMenu() {
    window.dispatchEvent(new CustomEvent(closeOthers, { detail: listId }));
    setActive(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  }

  function choose(next: T) {
    onChange(next);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const next = options[active]?.value;
      if (next) choose(next);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={`press inline-flex items-center gap-0.5 bg-transparent px-1 py-2 text-micro ${
          inverse ? "text-white/90 hover:text-white" : "text-ink hover:text-deep"
        }`}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
      >
        {selected?.short ?? selected?.label}
        <motion.span
          aria-hidden
          className="inline-flex"
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : settle}
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none">
            <path
              d="M4 6.25 8 10.25 12 6.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open && box ? (
                <motion.ul
                  ref={menuRef}
                  id={listId}
                  role="listbox"
                  aria-label={label}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                  transition={reduceMotion ? fade : settle}
                  style={{
                    position: "fixed",
                    top: box.top,
                    left: box.left,
                    right: box.right,
                    minWidth: Math.max(box.width, 196),
                    transformOrigin: box.origin,
                    zIndex: 50,
                  }}
                  className="glass-menu rounded-[14px] p-1.5"
                >
                  {options.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === active;
                    return (
                      <li key={option.value} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={`flex w-full items-center gap-3 rounded-[8px] px-2.5 py-1.5 text-left text-[13px] leading-4 tracking-[-0.08px] ${
                            isActive ? "bg-[#0071e3] text-white" : "text-ink"
                          }`}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => choose(option.value)}
                        >
                          <span className="min-w-0 flex-1">{option.label}</span>
                          {option.detail ? (
                            <span className={isActive ? "text-white/75" : "text-mid"}>
                              {option.detail}
                            </span>
                          ) : null}
                          <span className="grid size-3.5 shrink-0 place-items-center">
                            {isSelected ? (
                              <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none">
                                <path
                                  d="M3.25 8.25 6.4 11.4 12.75 4.6"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
