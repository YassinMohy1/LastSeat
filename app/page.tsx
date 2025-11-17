'use client';

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TopDeals from '@/components/TopDeals';
import HowItWorks from '@/components/HowItWorks';
import Reviews from '@/components/Reviews';
import ContactForm from '@/components/ContactForm';
import AIAssistant from '@/components/AIAssistant';
import Footer from '@/components/Footer';

export default function Home() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <Hero />
      <TopDeals />
      <HowItWorks />
      <Reviews />
      <ContactForm />
      <Footer />
      <AIAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} onOpen={() => setShowAssistant(true)} />
    </div>
  );
}
