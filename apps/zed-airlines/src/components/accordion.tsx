"use client";

import { fade, settle } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(-1);
  const reduceMotion = useReducedMotion();

  return (
    <div className="divide-y divide-hairline">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                className="flex w-full items-start justify-between gap-6 py-5 text-left font-display text-subheading font-semibold text-ink"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? -1 : index)}
              >
                {item.q}
                <span aria-hidden="true" className="text-mid">
                  {expanded ? "–" : "+"}
                </span>
              </button>
            </h3>
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : 0 }}
              transition={reduceMotion ? { duration: 0 } : settle}
              className="overflow-hidden"
            >
              <motion.div
                inert={!expanded}
                aria-hidden={!expanded}
                initial={false}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={reduceMotion ? fade : settle}
              >
                <p className="max-w-140 pb-6 text-body-sm text-mid">{item.a}</p>
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
