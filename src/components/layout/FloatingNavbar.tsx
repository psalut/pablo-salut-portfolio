import { useEffect, useState } from 'react';
import {
  House,
  CircleUserRound,
  FolderOpen,
  Star,
  Mail,
  Briefcase,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: typeof House;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'about', label: 'About', icon: CircleUserRound },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills', icon: Star },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function FloatingNavbar() {
  const [activeSection, setActiveSection] = useState<string>('home');

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
      let currentSection = sections[0]?.id ?? 'home';

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

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4">
      <nav
        aria-label="Primary"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-transparent text-slate-300 hover:text-white',
              ].join(' ')}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}