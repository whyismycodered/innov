'use client';

import Header from '@/components/civic-pilot/header';
import Footer from '@/components/civic-pilot/footer';
import ServiceCard from '@/components/civic-pilot/service-card';
import { Button } from '@/components/ui/button';
import { BookCopy, Shield, HeartPulse, Phone, Sparkles, Star, Circle, Zap, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Trigger shake animation every 5 seconds
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      if (!isExpanded) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    }, 5000);

    return () => clearInterval(shakeInterval);
  }, [isExpanded]);

  // Generate random positioned icons with MORE in the center area
  const backgroundIcons = [
    // Original outer icons
    { Icon: Sparkles, top: '10%', left: '15%', delay: '0s', size: 32 },
    { Icon: Star, top: '20%', left: '85%', delay: '1s', size: 28 },
    { Icon: Circle, top: '30%', left: '10%', delay: '2s', size: 24 },
    { Icon: Sparkles, top: '60%', left: '20%', delay: '1.5s', size: 30 },
    { Icon: Star, top: '70%', left: '80%', delay: '0.8s', size: 26 },
    { Icon: Circle, top: '80%', left: '12%', delay: '2.2s', size: 28 },
    { Icon: Sparkles, top: '15%', left: '70%', delay: '1.2s', size: 32 },
    { Icon: Sparkles, top: '50%', left: '5%', delay: '1.8s', size: 34 },
    { Icon: Star, top: '85%', left: '88%', delay: '0.3s', size: 30 },
    { Icon: Circle, top: '90%', left: '50%', delay: '1.4s', size: 30 },
    
    // NEW CENTER AREA ICONS (inside the red circle area)
    { Icon: Star, top: '18%', left: '40%', delay: '1.6s', size: 26 },
    { Icon: Circle, top: '15%', left: '55%', delay: '0.9s', size: 24 },
    { Icon: Star, top: '25%', left: '68%', delay: '1.3s', size: 30 },
    { Icon: Star, top: '32%', left: '30%', delay: '2.1s', size: 32 },
    { Icon: Star, top: '35%', left: '45%', delay: '0.7s', size: 28 },
    { Icon: Circle, top: '38%', left: '60%', delay: '1.9s', size: 26 },
    { Icon: Zap, top: '28%', left: '75%', delay: '0.2s', size: 34 },
    { Icon: Sparkles, top: '42%', left: '35%', delay: '1.7s', size: 30 },
    { Icon: Star, top: '45%', left: '50%', delay: '0.5s', size: 32 },
    { Icon: Circle, top: '48%', left: '65%', delay: '2.3s', size: 28 },
    { Icon: Zap, top: '40%', left: '22%', delay: '1.1s', size: 30 },
  ];

  return (
    <div className="relative flex flex-col min-h-dvh bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 overflow-hidden">
      {/* Animated Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundIcons.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={index}
              className="absolute animate-float"
              style={{
                top: item.top,
                left: item.left,
                animationDelay: item.delay,
              }}
            >
              <IconComponent 
                size={item.size}
                className="text-blue-300/60"
              />
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
            {/* Hero */}
            <section className="mb-10 md:mb-10">
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6 !leading-tight bg-gradient-to-r from-[#009EFF] via-[#005BF2] to-[#66c5ff] inline-block text-transparent bg-clip-text">
                Kamusta, Ano Ang Maitutulong Ko?
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Ang ultimate Gab-AI mo sa pag-navigate ng government services.
              </p>
            </section>

            {/* CTA */}
            <section className="mb-16">
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onMouseEnter={() => setIsExpanded(true)}
                  onMouseLeave={() => setIsExpanded(false)}
                  onClick={() => {
                    console.log('Voice AI activated');
                  }}
                  style={isShaking ? {
                    animation: 'shake 0.6s ease-in-out'
                  } : undefined}
                  className={`
                    relative overflow-hidden
                    text-white font-bold rounded-full text-xl 
                    bg-gradient-to-r from-[#009EFF] to-[#99d8ff]
                    transition-all duration-500 ease-out
                    hover:shadow-[0_0_20px_#009EFF] hover:scale-105
                    ${isExpanded ? 'w-1/3' : 'w-40 px-0'}
                    h-40
                  `}
                >
                  <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <Phone
                      className={`
                        !w-10 !h-10 text-white ml-2 flex-shrink-0
                        transition-transform duration-500
                        ${isExpanded ? 'rotate-12' : 'rotate-0'}
                      `} 
                    />
                    <span 
                      className={`
                        transition-all duration-500 font-semibold text-4xl
                        ${isExpanded ? 'opacity-100 w-auto ml-4' : 'opacity-0 w-0'}
                      `}
                    >
                      Kausapin Ako!
                    </span>
                  </div>
                </Button>
              </div>
            </section>

            {/* Service Cards */}
            <section id="quick-links" className="mt-20 md:mb-20 max-w-5xl mx-auto">
              <h2 className="text-3xl font-headline font-bold mb-8 text-blue-400">Government Services</h2>
              <div className="grid grid-rows-1 md:grid-rows-3 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ServiceCard 
                    icon={<User className="w-6 h-6 text-white" />}
                    title="Tin"
                    description="Tin ID Registration"
                    href="https://www.bir.gov.ph/primary-registration/dfa"
                    target="_blank"
                  />
                  <ServiceCard 
                    icon={<Shield className="w-6 h-6 text-white" />}
                    title="Nbi Clearance"
                    description="Police Clearance"
                    href="https://clearance.nbi.gov.ph/dfa"
                    target="_blank"
                  />
                  <ServiceCard 
                    icon={<HeartPulse className="w-6 h-6 text-white" />}
                    title="PhilHealth"
                    description="Health Insurance"
                    href="https://memberinquiry.philhealth.gov.ph/member/dfa"
                    target="_blank"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ServiceCard 
                    icon={<BookCopy className="w-6 h-6 text-white" />}
                    title="SSS"
                    description="Social Security System"
                    href="https://www.sss.gov.ph/dfa"
                    target="_blank"
                  />
                  <ServiceCard 
                    icon={<Shield className="w-6 h-6 text-white" />}
                    title="PSA"
                    description="Birth, Marriage, & Death Cetificate"
                    href="https://psaonlineappointment.org/dfa"
                    target="_blank"
                  />
                  <ServiceCard 
                    icon={<HeartPulse className="w-6 h-6 text-white" />}
                    title="DFA"
                    description="Passport Application"
                    href="https://passport.gov.ph/appointment/dfa"
                    target="_blank"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { 
            transform: translateX(0) rotate(0deg); 
          }
          10%, 30%, 50%, 70%, 90% { 
            transform: translateX(-10px) rotate(-5deg); 
          }
          20%, 40%, 60%, 80% { 
            transform: translateX(10px) rotate(5deg); 
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}