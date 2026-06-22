'use client';

import { useRef, useState } from 'react';
import { useReveal } from './use-reveal';

type Estado = 'Aprobado' | 'Preaprobado' | 'En proceso';

const CASOS: {
  folio: string;
  monto: string;
  plazo: string;
  estado: Estado;
  iniciales: string;
  ciudad: string;
}[] = [
  { folio: 'IG-2026-01187', monto: '$120,000', plazo: '6 años', estado: 'Aprobado', iniciales: 'C.H.', ciudad: 'Ciudad de México' },
  { folio: 'IG-2026-01342', monto: '$200,000', plazo: '8 años', estado: 'Aprobado', iniciales: 'F.V.', ciudad: 'Monterrey' },
  { folio: 'IG-2026-00813', monto: '$60,000', plazo: '4 años', estado: 'Preaprobado', iniciales: 'M.L.', ciudad: 'Monterrey' },
  { folio: 'IG-2026-00421', monto: '$25,000', plazo: '4 años', estado: 'En proceso', iniciales: 'J.P.', ciudad: 'Ciudad de México' },
  { folio: 'IG-2026-00297', monto: '$80,000', plazo: '6 años', estado: 'En proceso', iniciales: 'R.G.', ciudad: 'Guadalajara' },
  { folio: 'IG-2026-01054', monto: '$45,000', plazo: '4 años', estado: 'En proceso', iniciales: 'A.S.', ciudad: 'Puebla' },
];

const BADGE: Record<Estado, string> = {
  Aprobado: 'bg-green-900 text-green-300',
  Preaprobado: 'bg-blue-900 text-blue-300',
  'En proceso': 'bg-yellow-900 text-yellow-300',
};

function CaseCard({ caso, index }: { caso: (typeof CASOS)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const { ref, isVisible } = useReveal<HTMLDivElement>(0.2);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = Math.max(-10, Math.min(10, px * 20));
    const rotateX = Math.max(-10, Math.min(10, -py * 20));
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const reset = () => setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 80}ms`, ...(isVisible ? {} : {}) }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ transform, transition: 'transform 150ms ease-out, box-shadow 300ms' }}
        className={`group h-full rounded-xl border border-gray-700 bg-gray-800 p-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
          isVisible ? 'is-visible' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-gray-400">{caso.folio}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${BADGE[caso.estado]}`}>
            {caso.estado}
          </span>
        </div>
        <p className="mt-4 text-3xl font-bold text-white">{caso.monto}</p>
        <p className="text-sm text-gray-400">a {caso.plazo} · 7.00% anual fija</p>
        <div className="mt-4 flex items-center gap-3 border-t border-gray-700 pt-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {caso.iniciales}
          </span>
          <span className="text-sm text-gray-400">{caso.ciudad}</span>
        </div>
      </div>
    </div>
  );
}

export default function Cases() {
  const { ref, isVisible } = useReveal<HTMLDivElement>(0.2);

  return (
    <section id="casos" className="bg-gray-50 px-4 py-20 dark:bg-[#111827] lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
          Casos recientes
        </h2>

        {/* Banner referencial */}
        <div className="mx-auto mt-6 max-w-3xl rounded-lg bg-yellow-600 px-4 py-2 text-center text-sm font-bold text-black">
          EJEMPLOS REFERENCIALES — Los montos, plazos y tasas son ilustrativos y sujetos a evaluación crediticia.
        </div>

        <div
          ref={ref}
          className={`reveal mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {CASOS.map((caso, i) => (
            <CaseCard key={caso.folio} caso={caso} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
