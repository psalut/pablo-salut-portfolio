import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  House,
  CircleUserRound,
  FolderOpen,
  Star,
  Mail,
  Briefcase,
} from "lucide-react";

type IconType = typeof House;

type NavItem = {
  id: string;
  label: string;
  icon: IconType;
};

type HighlightStyle = {
  x: number;
  width: number;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: House },
  { id: "about", label: "About", icon: CircleUserRound },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "skills", label: "Skills", icon: Star },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function FloatingNavbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
    x: 0,
    width: 48,
  });

  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const getSections = (): HTMLElement[] =>
      navItems
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => section !== null);

    const updateActiveSection = (): void => {
      const sections = getSections();

      if (sections.length === 0) {
        return;
      }

      const viewportMiddle = window.scrollY + window.innerHeight * 0.45;
      let currentSection = sections[0]?.id ?? "home";

      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
          currentSection = section.id;
          break;
        }
      }

      const pageBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (pageBottom >= documentHeight - 8) {
        currentSection = sections[sections.length - 1]?.id ?? currentSection;
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();

    let ticking = false;

    const onScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useLayoutEffect(() => {
    const updateHighlightPosition = (): void => {
      const navElement = navRef.current;
      const activeItem = itemRefs.current[activeSection];

      if (!navElement || !activeItem) {
        return;
      }

      const navRect = navElement.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      setHighlightStyle({
        x: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    };

    updateHighlightPosition();

    const resizeObserver = new ResizeObserver(() => {
      updateHighlightPosition();
    });

    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    Object.values(itemRefs.current).forEach((item) => {
      if (item) {
        resizeObserver.observe(item);
      }
    });

    window.addEventListener("resize", updateHighlightPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHighlightPosition);
    };
  }, [activeSection]);

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4">
      <nav
        ref={navRef}
        aria-label="Primary"
        className="relative flex max-w-max items-center gap-1 rounded-full border border-white/8 bg-black/40 p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.24)] backdrop-blur-xl"
      >
        <motion.span
          aria-hidden="true"
          className="absolute top-1.5 left-0 h-7 rounded-full bg-white"
          animate={{
            x: highlightStyle.x,
            width: highlightStyle.width,
          }}
          transition={{
            type: "spring",
            stiffness: 430,
            damping: 28,
            mass: 0.75,
          }}
        />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              ref={(element) => {
                itemRefs.current[item.id] = element;
              }}
              href={`#${item.id}`}
              aria-current={isActive ? "page" : undefined}
              className="relative z-10 flex h-7 w-[38px] items-center justify-center overflow-hidden rounded-full text-xs font-medium leading-none transition-colors duration-200 sm:w-[94px] sm:px-3"
            >
              <span
                className={[
                  "flex items-center gap-1.5 whitespace-nowrap transition-colors duration-200",
                  isActive
                    ? "text-black"
                    : "text-slate-400 hover:text-slate-200",
                ].join(" ")}
              >
                <Icon size={14} strokeWidth={1.65} />
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
