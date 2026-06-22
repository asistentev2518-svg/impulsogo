'use client';

import { useState } from 'react';
import { useReveal } from './use-reveal';

const ITEMS = [
  {
    q: '¿La simulación garantiza aprobación?',
    a: 'No. Los montos son referenciales y todo financiamiento queda sujeto a evaluación crediticia, validación documental y formalización contractual.',
  },
  {
    q: '¿Dónde se valida la entidad?',
    a: 'La referencia pública se consulta en SIPRES de CONDUSEF. Esa consulta verifica el registro y no implica aprobación de operaciones.',
  },
  {
    q: '¿Por qué se solicita evidencia de identidad?',
    a: 'Para prevenir suplantación, documentar consentimiento y conservar un expediente trazable cuando se formaliza el contrato.',
  },
  {
    q: '¿Cuál es la tasa de interés?',
    a: 'Nuestra tasa es del 7.00% anual fija, sujeta a evaluación crediticia individual.',
  },
  {
    q: '¿Cuánto tarda la aprobación?',
    a: 'El tiempo promedio es de 24 horas hábiles desde que recibimos tu solicitud completa con toda la documentación requerida.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref, isVisible } = useReveal<HTMLDivElement>(0.2);

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="bg-gray-100 px-4 py-20 dark:bg-[#111827] lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
          Preguntas frecuentes
        </h2>

        <div
          ref={ref}
          className={`reveal mt-10 space-y-3 ${isVisible ? 'is-visible' : ''}`}
        >
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="overflow-hidden rounded-lg bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{item.q}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-blue-500 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-gray-500 dark:text-gray-400">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
