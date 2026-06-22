'use client';

import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#simulador', label: 'Simulador' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#casos', label: 'Casos' },
  { href: '#faq', label: 'FAQ' },
];

function LogoMark() {
  // Mano con flecha ascendente (representacion simplificada en SVG)
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M4 13c0-1.1.9-2 2-2s2 .9 2 2v3"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 16v-1.5a1.5 1.5 0 0 1 3 0V16m0-1.5a1.5 1.5 0 0 1 3 0V16m0-1a1.5 1.5 0 0 1 3 0v3a4 4 0 0 1-4 4H10a4 4 0 0 1-3.4-1.9L4.5 17"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 6l3-3 3 3M18 3v8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PublicHeader() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const dark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const nowDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
    setIsDark(nowDark);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[rgba(10,14,23,0.8)] backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-2 items-center px-4 lg:grid-cols-3 lg:px-8">
        {/* Logo */}
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex items-center gap-2 justify-self-start"
          aria-label="Impulso Go, ir al inicio"
        >
          <LogoMark />
          <span className="text-gradient text-xl font-bold tracking-tight">IMPULSO GO</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="group relative text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
            className="rounded-lg p-2 text-gray-600 transition-transform duration-300 hover:rotate-12 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Hamburguesa mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-gray-600 dark:text-gray-300 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute right-0 top-0 flex h-full w-64 flex-col gap-2 border-l border-gray-800 bg-[#0a0e17] p-6 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-gradient text-lg font-bold">IMPULSO GO</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="rounded-lg p-1 text-gray-400 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="rounded-lg px-3 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
