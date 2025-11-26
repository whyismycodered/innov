import Header from '@/components/civic-pilot/header';
import Footer from '@/components/civic-pilot/footer';
import ServiceCard from '@/components/civic-pilot/service-card';
import { Button } from '@/components/ui/button';
import { BookCopy, Shield, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          {/* Hero */}
          <section className="mb-20 md:mb-32">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6 !leading-tight">
              Your AI Caseworker for Philippine Government Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Simplifying bureaucracy for everyone. Just ask, and we guide you.
            </p>
          </section>

          {/* Service Cards */}
          <section className="mb-20 md:mb-32 max-w-5xl mx-auto">
            <h2 className="text-3xl font-headline font-bold mb-12">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard 
                icon={<BookCopy className="w-10 h-10 text-primary" />}
                title="DFA"
                description="Passport Services"
                href="/services/dfa"
              />
              <ServiceCard 
                icon={<Shield className="w-10 h-10 text-primary" />}
                title="SSS"
                description="Social Security"
                href="/services/sss"
              />
              <ServiceCard 
                icon={<HeartPulse className="w-10 h-10 text-primary" />}
                title="PhilHealth"
                description="Health Insurance"
                href="/services/philhealth"
              />
            </div>
          </section>

          {/* CTA */}
          <section>
            <Link href="/caseworker" passHref>
              <Button 
                size="lg" 
                className="text-white font-bold rounded-full px-12 h-16 text-xl bg-gradient-to-r from-[#94B3FD] to-[#B894FD] transition-all duration-300 ease-in-out hover:shadow-[0_0_25px_#B894FD] hover:scale-105"
              >
                Start
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
