import {
  siAmd,
  siFastapi,
  siGithubactions,
  siHuggingface,
  siPydantic,
  siPython,
  siPytorch,
  siReact,
  siSqlite,
  siTailwindcss,
  siTypescript,
  siVite,
  siYaml,
  type SimpleIcon,
} from "simple-icons";
import { REPO } from "../../content/site";
import { Reveal } from "../ui/motion";
import { cx, Section } from "../ui/primitives";

type Tech = { name: string; note?: string; icon?: SimpleIcon; mono?: string };

/* Top row: what the repository uses today (requirements.txt, CI, frontend/package.json).
   Bottom row: what issues #16–#19 propose; later-phase items are marked. */
const inUse: Tech[] = [
  { name: "Python 3.12", icon: siPython },
  { name: "Pydantic", icon: siPydantic },
  { name: "openpyxl", mono: "xl" },
  { name: "ReportLab", mono: "RL" },
  { name: "PyYAML", icon: siYaml },
  { name: "GitHub Actions", icon: siGithubactions },
  { name: "React", icon: siReact },
  { name: "TypeScript", icon: siTypescript },
  { name: "Vite", icon: siVite },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "Motion", mono: "M" },
  { name: "MaintIE dataset", mono: "MI" },
];

const proposed: Tech[] = [
  { name: "AMD Token Factory API", note: "proposed", icon: siAmd },
  { name: "FastAPI", note: "proposed", icon: siFastapi },
  { name: "SQLite", note: "proposed", icon: siSqlite },
  { name: "Playwright E2E", note: "proposed", mono: "PW" },
  { name: "Hugging Face datasets", note: "optional", icon: siHuggingface },
  { name: "PyTorch", note: "later phase", icon: siPytorch },
  { name: "ROCm", note: "later phase", mono: "R" },
  { name: "vLLM", note: "later phase", mono: "vL" },
];

function Chip({ t }: { t: Tech }) {
  return (
    <li className="group flex h-14 shrink-0 items-center gap-3 rounded-[12px] border border-line bg-elevated px-5 transition-colors duration-300 hover:border-line-strong hover:bg-card">
      {t.icon ? (
        <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden className="shrink-0 fill-fg-3 transition-colors duration-300 group-hover:fill-fg">
          <path d={t.icon.path} />
        </svg>
      ) : (
        <span
          aria-hidden
          className="grid size-5 shrink-0 place-items-center rounded-[5px] border border-fg-4 font-mono text-[9px] font-semibold text-fg-3 transition-colors duration-300 group-hover:border-fg group-hover:text-fg"
        >
          {t.mono}
        </span>
      )}
      <span className="text-[15px] font-[510] whitespace-nowrap text-fg-2 transition-colors group-hover:text-fg">{t.name}</span>
      {t.note && (
        <span
          className={cx(
            "rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap",
            t.note === "proposed" ? "bg-accent-soft text-brand-text" : "bg-white/[0.06] text-fg-3",
          )}
        >
          {t.note}
        </span>
      )}
    </li>
  );
}

/** Infinite horizontal loop: the list is rendered twice and shifted by half its width. */
function Marquee({ items, reverse, seconds }: { items: Tech[]; reverse?: boolean; seconds: number }) {
  return (
    <div className="marquee group/m relative overflow-hidden py-1.5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className={cx("marquee-track flex w-max gap-3 group-hover/m:[animation-play-state:paused]", reverse && "marquee-reverse")}
        style={{ animationDuration: `${seconds}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex gap-3" aria-hidden={copy === 1 || undefined}>
            {items.map((t) => (
              <Chip key={t.name} t={t} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <Section
      eyebrow="Stack"
      title="Built with"
      intro={
        <>
          Top row is in the repository today. Bottom row is proposed in{" "}
          <a href={`${REPO}/issues/16`} target="_blank" rel="noreferrer" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg-3">
            issue #16
          </a>{" "}
          and may change.
        </>
      }
    >
      <Reveal className="-mx-4 space-y-3 sm:-mx-8">
        <Marquee items={inUse} seconds={48} />
        <Marquee items={proposed} seconds={40} reverse />
      </Reveal>
    </Section>
  );
}
