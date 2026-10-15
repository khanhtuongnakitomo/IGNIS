import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero, REPO } from "../../content/site";
import { Icon } from "../ui/icons";
import { EASE } from "../ui/motion";
import { ButtonLink, Container, cx } from "../ui/primitives";

export function Hero() {
  const words = hero.headline.split(" ");
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 600], [0, 120]);
  const contentY = useTransform(scrollY, [0, 600], [0, -40]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute top-[-280px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(242_100_58/0.22),transparent)] blur-2xl"
      />

      <Container className="relative">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="flex flex-col items-center text-center">
          <motion.a
            href={`${REPO}/issues/16`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] py-1 pr-3 pl-1 text-[12px] text-fg-2 transition-colors hover:border-white/25 hover:text-fg"
          >
            <span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">AMD</span>
            {hero.pill}
            <Icon name="arrow" size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.a>

          <h1 className="mt-8 max-w-4xl text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-[64px] lg:text-[76px]">
            <span className="sr-only">{hero.headline}</span>
            <span aria-hidden>
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="text-gradient inline-block pr-[0.22em] pb-[0.08em]"
                  initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.075 }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: EASE, delay: 0.75 }}
            className="mt-6 max-w-[560px] text-[16px] leading-relaxed text-fg-2 sm:text-[17px]"
          >
            {hero.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <ButtonLink href="#product">
              See how it works
              <Icon name="arrow" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={`${REPO}/issues/16`} variant="secondary" external>
              Read the proposal
            </ButtonLink>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.1 }}
          className="mx-auto mt-16 max-w-[860px] sm:mt-20"
        >
          <EvidenceTrace />
        </motion.div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Evidence trace: a looping illustration of one work order moving through
 * extraction → human review → code facts → cited report. Illustrative only.
 * ------------------------------------------------------------------------- */

const SPANS = [
  { text: "mechanical seal", type: "component", step: 1 },
  { text: "leaking", type: "fault", step: 2 },
  { text: "replaced", type: "action", step: 3 },
] as const;

const CHAIN = [
  { owner: "AI", title: "Suggested", detail: "3 spans · schema valid", step: 4 },
  { owner: "HUMAN", title: "Approved", detail: "reviewer · rev 2", step: 5 },
  { owner: "CODE", title: "Fact", detail: "recurrence · rule v1", step: 6 },
  { owner: "REPORT", title: "Cited claim", detail: "→ WO-0418 · §4.2", step: 7 },
] as const;

const LAST_STEP = 7;

function useTraceStep() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? LAST_STEP : 0);
  useEffect(() => {
    if (reduce) {
      setStep(LAST_STEP);
      return;
    }
    // Start after the hero entrance, advance every 700ms, hold the full trail, then replay.
    const delay = step === 0 ? 2200 : step === LAST_STEP ? 3800 : 700;
    const t = window.setTimeout(() => setStep((s) => (s === LAST_STEP ? 0 : s + 1)), delay);
    return () => window.clearTimeout(t);
  }, [step, reduce]);
  return step;
}

const spanTone = {
  component: { bar: "bg-info", text: "text-info", bg: "bg-info/10" },
  fault: { bar: "bg-danger", text: "text-danger", bg: "bg-danger/10" },
  action: { bar: "bg-ok", text: "text-ok", bg: "bg-ok/10" },
} as const;

function TraceSpan({ text, type, on }: { text: string; type: keyof typeof spanTone; on: boolean }) {
  const t = spanTone[type];
  return (
    <span className="relative inline-block leading-[1.35]">
      <AnimatePresence>
        {on && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cx(
              "absolute -top-[17px] left-0 font-mono sm:-top-6 text-[10px] font-medium tracking-wide whitespace-nowrap uppercase",
              t.text,
            )}
          >
            {type}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        aria-hidden
        className={cx("absolute inset-x-[-3px] inset-y-[-1px] rounded-[3px]", t.bg)}
        initial={false}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <span className="relative">{text}</span>
      <motion.span
        aria-hidden
        className={cx("absolute right-0 -bottom-1 left-0 h-[2px] origin-left rounded-full", t.bar)}
        initial={false}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      />
    </span>
  );
}

function EvidenceTrace() {
  const step = useTraceStep();
  const ownerTone: Record<string, string> = {
    AI: "text-fg-3",
    HUMAN: "text-accent",
    CODE: "text-fg-3",
    REPORT: "text-ok",
  };

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-line-strong bg-elevated/80 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.02)] backdrop-blur">
      {/* top highlight */}
      <div aria-hidden className="absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-fg-3">
          <span className="size-2 rounded-full bg-fg-4" />
          WO-0418 · source row 37
        </div>
        <span className="rounded-full bg-synthetic/12 px-2 py-0.5 text-[11px] font-medium text-synthetic">
          Illustrative · synthetic example
        </span>
      </div>

      <div className="px-4 pt-10 pb-6 sm:px-8 sm:pt-12">
        <p className="text-left text-[17px] leading-[3] text-fg sm:text-[22px] sm:leading-[2.2]">
          Pump P-101 <TraceSpan {...SPANS[0]} on={step >= SPANS[0].step} />{" "}
          <TraceSpan {...SPANS[1]} on={step >= SPANS[1].step} /> at drive end,{" "}
          <TraceSpan {...SPANS[2]} on={step >= SPANS[2].step} /> seal and gasket.
        </p>
      </div>

      <ol className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
        {CHAIN.map((node, i) => {
          const on = step >= node.step;
          return (
            <li key={node.title} className="relative bg-elevated px-4 py-4 text-left sm:px-5">
              {/* connector that draws into the next node */}
              {i < CHAIN.length - 1 && (
                <motion.span
                  aria-hidden
                  className="absolute top-1/2 -right-px z-10 hidden h-px w-6 origin-left translate-x-1/2 bg-accent sm:block"
                  initial={false}
                  animate={{ scaleX: step >= CHAIN[i + 1].step ? 1 : 0, opacity: step >= CHAIN[i + 1].step ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              )}
              <motion.div
                initial={false}
                animate={{ opacity: on ? 1 : 0.28, y: on ? 0 : 4 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className={cx("font-mono text-[10px] font-medium tracking-wider", ownerTone[node.owner])}>
                  {node.owner}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-fg">
                  <motion.span
                    className="grid size-4 place-items-center rounded-full bg-ok/15 text-ok"
                    initial={false}
                    animate={{ scale: on ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 26 }}
                  >
                    <Icon name="check" size={10} />
                  </motion.span>
                  {node.title}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-fg-3">{node.detail}</div>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
