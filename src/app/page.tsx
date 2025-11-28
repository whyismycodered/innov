'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Video, ShieldCheck, Globe, Phone, FileText, CheckCircle2, Users } from 'lucide-react';
import Image from 'next/image';
import logo from '../../public/gabayan.png';

// Dynamic Import: Loads the AgentCall component only on the client side.
// This prevents SSR errors because AgentCall handles all the heavy Agora SDK lifting.
/*const AgentCall = dynamic(() => import('./AgentCall'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p>Initializing Secure Agent...</p>
    </div>
  )
});
*/

// --- UI COMPONENTS ---

const MainActionButton = ({ onClick, label, subLabel }: { onClick: () => void, label: string, subLabel: string }) => (
  <button 
    onClick={onClick}
    className="group relative w-full md:w-auto flex flex-col items-center justify-center bg-gradient-to-r from-[#005BF2] via-[#005BF2] to-[#009EFF] hover:from-[#009EFF] hover:to-[#005BF2] transition-all duration-500 ease-out
                    hover:shadow-[0_0_20px_#009EFF] text-white px-12 py-8 rounded-3xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 border-b-[1px] border-white"
  >
    <div className="flex items-center gap-4 mb-2">
      <div className="bg-white/20 p-3 rounded-full">
        <Video className="w-10 h-10 text-white fill-current" />
      </div>
      <span className="text-3xl md:text-4xl font-bold tracking-tight">{label}</span>
    </div>
    <span className="text-blue-100 text-lg md:text-xl font-medium tracking-wide opacity-90">{subLabel}</span>
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
  </button>
);

const TrustBadge = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-2 rounded-full font-bold text-sm border border-blue-100">
    <Icon className="w-4 h-4" />
    {text}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: string }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-300 ${delay}`}>
    <div className="bg-blue-50 p-4 rounded-xl shrink-0">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function CivicPilotHome() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    // Simulate a brief connection delay for UX
    setTimeout(() => {
      setIsStarted(true);
      setIsLoading(false);
    }, 1000);
  };

  /*
  // 1. Loading State
  if (isLoading) {
     return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 px-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Connecting to Agent...</h2>
        <p className="text-slate-500">Kumokonekta sa tulong...</p>
      </div>
    );
  }

  // 2. Active Call State
  // We render the AgentCall component which contains its own Agora Provider
  if (isStarted) {
    return <AgentCall onEnd={() => setIsStarted(false)} />;
  }
    */

  // 3. Landing Page State
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Logo" width={40} height={40} />
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#009EFF] via-[#005BF2] to-[#66c5ff] inline-block text-transparent bg-clip-text">GabAian</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PH Digital Assistance</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-700">Taglish Mode</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex flex-wrap gap-3">
              <TrustBadge icon={ShieldCheck} text="Secure & Private" />
              <TrustBadge icon={CheckCircle2} text="No Typing Needed" />
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight">
                Nahihirapan sa <br />
                <span className="text-transparent bg-gradient-to-r from-[#009EFF] via-[#005BF2] to-[#66c5ff] bg-clip-text">Government Forms?</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                Huwag mag-alala. Nandito ang GabAian para Gab-AI-yan ka. Video call lang, parang kausap mo ang apo mo.
              </p>
            </div>
            <div className="pt-6">
              <MainActionButton onClick={handleStart} label="Magsimula Dito" subLabel="Start Video Assistance" />
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                <div className="bg-white border-b px-4 py-3 flex gap-2 items-center">
                  <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
                  <div className="bg-slate-100 rounded-md px-3 py-1 text-[10px] text-slate-400 flex-1 ml-2 font-mono text-center">https://www.passport.gov.ph/appointment</div>
                </div>
                <div className="p-6 space-y-4 relative">
                   <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                   <div className="h-10 bg-white border border-slate-200 rounded shadow-sm"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/4 mt-4"></div>
                   <div className="h-24 bg-white border border-slate-200 rounded shadow-sm"></div>
                   <div className="absolute top-16 right-8 w-12 h-12 rounded-full border-4 border-red-500 opacity-60 animate-ping"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-10 bg-slate-900 text-white p-5 rounded-2xl shadow-xl max-w-xs animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex gap-2 mb-2 items-center"><div className="w-2 h-2 bg-green-400 rounded-full"></div><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agora AI Agent</span></div>
                <p className="font-medium text-lg leading-tight">"Nakikita ko na. Diyan po sa <b>Address Field</b> ilalagay ang barangay."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-6">
          <FeatureCard icon={Phone} delay="delay-0" title="Kausapin ang AI" desc="Just talk naturally." />
          <FeatureCard icon={FileText} delay="delay-100" title="Tulong sa Forms" desc="Step-by-step guidance." />
          <FeatureCard icon={Video} delay="delay-200" title="See What You See" desc="We see what you see." />
        </div>
      </main>

      <footer className="border-t border-slate-200 py-12 mt-20 bg-white">
        <div className="flex max-w-7xl mx-auto px-4 text-center justify-center">
          <p className="text-slate-900 font-regular mb-2">© 2025 GabAian. Powered by Agora. All rights reserved.</p>

        </div>
      </footer>
    </div>
  );
}