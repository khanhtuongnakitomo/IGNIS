import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { demoUrl, nav, REPO } from "../../content/site";
import { Icon } from "../ui/icons";
import { ButtonLink, Container, cx, Wordmark } from "../ui/primitives";
import { EASE } from "../ui/motion";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // Scroll spy: the section crossing the upper third of the viewport is active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : entry.target.id);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    const hero = document.getElementById("top");
    if (hero) observer.observe(hero);
    for (const item of nav) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={cx(
        "fixed inset-x-0 top-0 z-50 h-14 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-line bg-bg/80 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-full items-center justify-between">
        <a href="#top" aria-label="IGNIS home">
          <Wordmark />
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  className={cx(
                    "relative z-10 block rounded-full px-3 py-1.5 text-[13px] transition-colors",
                    active === item.id ? "text-fg" : "text-fg-3 hover:text-fg",
                  )}
                >
                  {item.label}
                </a>
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="#/app" variant="ghost">
            Workspace preview
          </ButtonLink>
          <ButtonLink href={REPO} variant="secondary" external>
            <Icon name="github" size={14} /> GitHub
          </ButtonLink>
          {demoUrl && (
            <ButtonLink href={demoUrl} external>
              View demo
            </ButtonLink>
          )}
        </div>

        <button
          type="button"
          className="grid size-9 place-items-center rounded-[var(--radius)] text-fg-2 hover:bg-hover md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Sections"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="border-b border-line bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <Container className="flex flex-col py-3">
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[15px] text-fg-2 hover:text-fg"
                >
                  {item.label}
                </a>
              ))}
              <a href="#/app" className="py-2.5 text-[15px] text-fg-2 hover:text-fg">
                Workspace preview
              </a>
              <a href={REPO} target="_blank" rel="noreferrer" className="py-2.5 text-[15px] text-fg-2 hover:text-fg">
                GitHub
              </a>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
