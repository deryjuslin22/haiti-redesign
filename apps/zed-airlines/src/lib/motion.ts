import type { Transition } from "motion/react";

/** Critically damped. Apple damping 1.0, response about 0.35s. */
export const settle: Transition = { type: "spring", bounce: 0, duration: 0.35 };

/** A control moving to a new place. Apple damping 1.0, response 0.4s. */
export const reposition: Transition = { type: "spring", bounce: 0, duration: 0.4 };

/** Reduced motion: a short opacity cross-fade, no travel. */
export const fade: Transition = { duration: 0.18, ease: [0.23, 1, 0.32, 1] };

/** GSAP ease closest to --ease-out. No overshoot. */
export const splitEase = "power3.out";
