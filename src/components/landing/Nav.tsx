import { useEffect, useState } from "react";
import logo from "@/assets/landingpage/logo.svg";
import logo2 from "@/assets/landingpage/logo2.svg";
import signin from "@/assets/landingpage/signin.svg";

const links = [
  { id: "hero", label: "الرئيسية" },
  { id: "overview", label: "نظرة عامة" },
  { id: "capabilities", label: "القدرات الرئيسية" },
  { id: "platform-value", label: "القيمة" },
  { id: "contact", label: "تواصل" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Nav() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [activeId, setActiveId] = useState(links[0].id);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPastHero(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  // Scrollspy: highlight whichever section link matches the section
  // currently in view, and un-highlight the rest.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those
        // currently intersecting, so only one section is "active" at a time.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveId(top.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <img
          src={scrolledPastHero ? logo2 : logo}
          alt="Track+ by JODAYN"
          className="h-14 w-auto"
        />

        <ul className="hidden flex-1 list-none items-center justify-between gap-6 px-14 text-sm md:flex">
          {links.map((l) => (
            <li key={l.id} className="list-none">
              <button
                onClick={() => scrollTo(l.id)}
                className={`appearance-none border-0 bg-transparent p-0 m-0 cursor-pointer transition-colors hover:text-brand ${
                  activeId === l.id
                    ? "text-brand"
                    : scrolledPastHero
                      ? "text-black"
                      : "text-white"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          aria-label="تسجيل الدخول"
          className="appearance-none border-0 bg-transparent p-0 m-0 cursor-pointer"
        >
          <img src={signin} alt="تسجيل الدخول" className="h-[52px] w-auto transition-transform hover:scale-[1.03]" />
        </button>
      </nav>
    </header>
  );
}
