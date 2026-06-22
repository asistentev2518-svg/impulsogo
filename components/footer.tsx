'use client';

const QUICK_LINKS = [
  { href: '#simulador', label: 'Simulador' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#casos', label: 'Casos' },
  { href: '#faq', label: 'Preguntas frecuentes' },
];

export default function Footer() {
  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-100 px-4 py-12 dark:border-gray-800 dark:bg-gray-900 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Marca */}
          <div>
            <span className="text-gradient text-xl font-bold">IMPULSO GO</span>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              S.A. de C.V., SOFOM, E.N.R. Financiamiento accesible con transparencia total y tasa fija del 7.00% anual.
            </p>
          </div>

          {/* 2. Links rapidos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Navegación</h3>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                  <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Fresas 12, interior 10, Col. Tlacoquemécatl, C.P. 03200, Benito Juárez, Ciudad de México</span>
              </li>
              <li>
                <a href="tel:+525547823544" className="flex items-center gap-2 transition-colors hover:text-gray-900 dark:hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  55 4782 3544
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/525547823544"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-green-500"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                    <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" />
                  </svg>
                  WhatsApp: 55 4782 3544
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Legal + mapa */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="https://phpapps.condusef.gob.mx/SIPRES/jsp/pub/index.jsp" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  CONDUSEF
                </a>
              </li>
              <li>
                <a href="https://phpapps.condusef.gob.mx/SIPRES/jsp/pub/index.jsp" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Registro SIPRES
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => scrollTo(e, '#faq')} className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Aviso de privacidad
                </a>
              </li>
            </ul>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-800">
              <iframe
                title="Ubicación Impulso Go"
                src="https://www.google.com/maps?q=Fresas%2012%2C%20Tlacoquemecatl%2C%20Benito%20Juarez%2C%20CDMX%2003200&output=embed"
                width="100%"
                height="120"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Impulso Go, S.A. de C.V., SOFOM, E.N.R. Todos los derechos reservados.
          </p>
          <button
            type="button"
            onClick={scrollTop}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver arriba
          </button>
        </div>
      </div>
    </footer>
  );
}
