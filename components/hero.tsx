'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 1600, decimals = 0) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, decimals]);

  return value;
}

export default function Hero() {
  const clientes = useCountUp(58758, 1800, 0);
  const tasa = useCountUp(7, 1400, 2);
  const horas = useCountUp(24, 1400, 0);

  const scrollToSimulador = () => {
    document.querySelector('#simulador')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24 lg:px-8"
    >
      {/* Particulas sutiles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { top: '15%', left: '10%', size: 6, delay: '0s' },
          { top: '30%', left: '80%', size: 4, delay: '1s' },
          { top: '65%', left: '20%', size: 5, delay: '2s' },
          { top: '75%', left: '70%', size: 7, delay: '0.5s' },
          { top: '45%', left: '50%', size: 3, delay: '1.5s' },
          { top: '20%', left: '60%', size: 4, delay: '2.5s' },
        ].map((p, i) => (
          <span
            key={i}
            className="particle absolute rounded-full bg-blue-400/40"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-5">
        {/* Texto */}
        <div className="lg:col-span-3">
          <h1 className="text-balance text-5xl font-bold leading-tight lg:text-7xl">
            <span className="text-gradient">Créditos Simples,</span>
            <br />
            <span className="text-gradient">Confianza Real</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            Impulso Go, S.A. de C.V., SOFOM, E.N.R. — Financiamiento accesible con transparencia total.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={scrollToSimulador}
              className="rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            >
              Simula tu crédito
            </button>
          </div>

          {/* Stats */}
          <dl className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <dd className="text-4xl font-bold text-gray-900 dark:text-white">
                +{clientes.toLocaleString('es-MX')}
              </dd>
              <dt className="mt-1 text-sm text-gray-500 dark:text-gray-500">clientes satisfechos</dt>
            </div>
            <div>
              <dd className="text-4xl font-bold text-gray-900 dark:text-white">{tasa.toFixed(2)}%</dd>
              <dt className="mt-1 text-sm text-gray-500 dark:text-gray-500">tasa anual fija</dt>
            </div>
            <div>
              <dd className="text-4xl font-bold text-gray-900 dark:text-white">{Math.round(horas)}h</dd>
              <dt className="mt-1 text-sm text-gray-500 dark:text-gray-500">tiempo promedio de respuesta</dt>
            </div>
          </dl>
        </div>

        {/* Decoracion 3D (oculta en movil) */}
        <div className="hidden lg:col-span-2 lg:block" aria-hidden="true">
          <div className="relative h-96" style={{ perspective: '1000px' }}>
            <div
              className="absolute right-0 top-4 w-64 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-cyan-500/10 p-6 backdrop-blur-sm"
              style={{ transform: 'perspective(1000px) rotateY(15deg) rotateX(6deg)' }}
            >
              <p className="text-sm text-gray-400">Cuota mensual desde</p>
              <p className="mt-2 text-3xl font-bold text-white">$1,148</p>
              <div className="mt-4 h-2 w-full rounded-full bg-gray-700">
                <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>
            </div>
            <div
              className="absolute bottom-4 left-0 w-56 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 p-6 backdrop-blur-sm"
              style={{ transform: 'perspective(1000px) rotateY(-12deg) rotateX(-4deg)' }}
            >
              <p className="text-sm text-gray-400">Tasa anual fija</p>
              <p className="mt-2 text-3xl font-bold text-white">7.00%</p>
              <p className="mt-2 text-xs text-gray-400">Sin sorpresas, sin letras chiquitas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
