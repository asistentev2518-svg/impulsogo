'use client';

import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Solicitud digital',
    desc: 'Completa tu solicitud en minutos desde cualquier dispositivo.',
    icon: (
      <path
        d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5ZM8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    num: '02',
    title: 'Evaluación inmediata',
    desc: 'Análisis crediticio en tiempo real, sin esperas.',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    num: '03',
    title: 'Firma electrónica',
    desc: 'Contrato seguro con validez legal ante CONDUSEF.',
    icon: (
      <path
        d="M3 17c3-1 4-6 6-6s2 4 4 4 3-7 5-7M3 21h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    num: '04',
    title: 'Depósito en 24h',
    desc: 'Recibe tu financiamiento directo a tu cuenta bancaria.',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="14.5" r="1.5" fill="currentColor" />
      </>
    ),
  },
];

export default function Process() {
  const [active, setActive] = useState<number[]>([]);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setActive([0, 1, 2, 3]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            // Staggered: cada nodo 200ms despues
            setTimeout(() => {
              setActive((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
            }, idx * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="proceso" className="bg-gray-100 px-4 py-20 dark:bg-[#0a0e17] lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
          Un proceso claro, de principio a fin
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
          Cuatro pasos simples para obtener tu financiamiento.
        </p>

        <div className="relative mt-14 pl-8">
          {/* Linea conectora */}
          <div className="absolute left-[23px] top-2 h-[calc(100%-2rem)] w-1 rounded-full bg-gray-300 dark:bg-gray-800">
            <div
              className="w-full rounded-full bg-gradient-to-b from-blue-500 to-cyan-400 transition-all duration-700"
              style={{ height: `${(active.length / STEPS.length) * 100}%` }}
            />
          </div>

          <ol className="space-y-10">
            {STEPS.map((step, idx) => {
              const isActive = active.includes(idx);
              return (
                <li
                  key={step.num}
                  ref={(el) => {
                    refs.current[idx] = el;
                  }}
                  data-idx={idx}
                  className="relative"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 600ms ease-out, transform 600ms ease-out',
                  }}
                >
                  {/* Nodo */}
                  <span
                    className={`absolute -left-8 flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-500 transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                        : 'bg-gray-200 text-blue-500 dark:bg-gray-800'
                    }`}
                    style={{
                      transform: isActive
                        ? 'perspective(800px) rotateY(0deg)'
                        : 'perspective(800px) rotateY(35deg)',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {step.icon}
                    </svg>
                  </span>

                  <div className="pl-10">
                    <span className="text-sm font-bold text-blue-500">{step.num}</span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
