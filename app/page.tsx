'use client';

import PublicHeader from '@/components/public-header';
import Hero from '@/components/hero';
import Simulator from '@/components/simulator';
import Process from '@/components/process';
import Cases from '@/components/cases';
import FAQ from '@/components/faq';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />
      <main>
        <Hero />
        <Simulator />
        <Process />
        <Cases />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
