import { chromium } from "playwright";
import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const videoDir = path.join(appRoot, "videos");
const rawName = "zed-airlines-scroll.webm";
const url = process.env.CAPTURE_URL ?? "http://localhost:3000/fr";

await mkdir(videoDir, { recursive: true });

const browser = await chromium.launch({
  headless: false,
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    "--use-gl=angle",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
  ],
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  locale: "fr-FR",
  colorScheme: "light",
  recordVideo: {
    dir: videoDir,
    size: { width: 1920, height: 1080 },
  },
});

const page = await context.newPage();
page.on("console", (message) => {
  if (message.type() === "log") console.log(message.text());
});

page.setDefaultTimeout(180000);
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.addInitScript(() => {
  const style = document.createElement("style");
  style.textContent = `
    html { scroll-behavior: auto !important; scrollbar-width: none !important; }
    ::-webkit-scrollbar { display: none !important; }
  `;
  document.documentElement.appendChild(style);
});

console.log(`Opening ${url}`);
await page.goto(url, { waitUntil: "load", timeout: 45000 });
await page.bringToFront();
await page.waitForSelector("#hero", { timeout: 20000 });
await page.addStyleTag({
  content: `
    html, body { scrollbar-width: none !important; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none !important; width: 0 !important; }
  `,
});

const plan = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) throw new Error("prefers-reduced-motion is still reduce");

  await document.fonts.ready;
  await Promise.race([
    Promise.all(
      [...document.images].map((image) => image.decode?.().catch(() => undefined)),
    ),
    sleep(5000),
  ]);

  const speed = 340;
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const headerClearance = 168;

  function frameY(node) {
    const top = node.getBoundingClientRect().top + window.scrollY;
    return Math.min(max, Math.max(0, Math.round(top - headerClearance)));
  }

  const nodes = [
    ...document.querySelectorAll("main section, main article"),
    document.querySelector("footer"),
  ].filter(Boolean);

  const beats = [];
  for (const node of nodes) {
    const y = frameY(node);
    const previous = beats[beats.length - 1];
    if (previous && Math.abs(previous.y - y) < 220) continue;
    const label = node.id || node.tagName.toLowerCase();
    beats.push({ y, label });
  }
  if (!beats.length || beats[beats.length - 1].y < max - 8) {
    beats.push({ y: max, label: "fin" });
  }

  console.log(
    `Capture: ${beats.length} arrêts, page ${Math.round(document.documentElement.scrollHeight)}px`,
  );

  await sleep(3400);

  let cursor = window.scrollY;
  for (const beat of beats) {
    const distance = beat.y - cursor;
    if (distance > 8) {
      const duration = (distance / speed) * 1000;
      const from = cursor;
      const started = performance.now();
      await new Promise((resolve) => {
        function frame(now) {
          const t = Math.min(1, (now - started) / duration);
          window.scrollTo(0, from + distance * t);
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
      cursor = beat.y;
    }
    const hold = beat.y >= max - 8 ? 2200 : distance < 280 ? 1600 : 1200;
    console.log(`Arrêt ${beat.label} @ ${beat.y}px (${hold}ms)`);
    await sleep(hold);
  }

  return { beats: beats.length, max };
});

console.log(`Scroll finished (${plan.beats} beats, ${plan.max}px)`);
await page.waitForTimeout(400);

const video = page.video();
await context.close();
await browser.close();

const recorded = await video.path();
const target = path.join(videoDir, rawName);
await rm(target, { force: true });
if (path.resolve(recorded) !== path.resolve(target)) {
  await rename(recorded, target);
}

console.log(`WebM: ${target}`);
