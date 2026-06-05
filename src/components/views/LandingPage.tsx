import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-charcoal-950)] text-white flex flex-col justify-between p-6 relative overflow-hidden" 
         style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a2305 0%, #030303 100%)' }}>
      
      {/* Visual glowing elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-neon-default)]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-neon-default)]/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 max-w-6xl w-full mx-auto">
          <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-green)] flex items-center justify-center text-[var(--color-charcoal-950)] font-black text-xl">
                  M
              </div>
              <span className="font-extrabold text-sm tracking-widest text-[var(--primary-green)]">MARKET DAY INTERNAL</span>
          </div>
          <span className="text-xs text-[var(--color-charcoal-400)] font-semibold tracking-wider">Edisi Siswa 2026</span>
      </div>

      {/* Main Content */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="my-auto z-10 text-center max-w-3xl mx-auto space-y-6"
      >
          <span className="px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-xs font-bold tracking-wider uppercase border border-[var(--primary-green)]/20">
              Sistem Manajemen Terintegrasi 100% Real-time
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mt-6">
              Kelola Stan Market Day Kelasmu <br/>
              <span className="text-[var(--primary-green)]">Lebih Cerdas & Akurat</span>
          </h1>
          <p className="text-[var(--color-charcoal-400)] text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium mt-6">
              Sebuah platform koordinasi internal yang menghubungkan Wali Kelas, Kasir POS, Tim Bendahara, Logistik, Desain, Konsumsi hingga Tim Acara dalam satu basis data terpadu.
          </p>
          
          <div className="pt-4 pb-2">
             <span className="inline-block px-4 py-2 border border-[var(--primary-green)]/30 bg-[var(--primary-green)]/10 rounded-xl text-[var(--primary-green)] font-black text-sm tracking-widest uppercase shadow-sm">
                 Developed by Ghozi Rahmani
             </span>
          </div>
          
          <div className="pt-4">
              <button 
                  onClick={onEnter}
                  className="px-8 py-4 bg-[var(--primary-green)] hover:bg-[var(--primary-green-hover)] text-[var(--color-charcoal-950)] font-bold rounded-2xl shadow-xl shadow-[var(--primary-green)]/20 transition duration-300 transform hover:-translate-y-0.5 inline-flex items-center"
              >
                  Masuk ke Sistem <ArrowRight className="ml-2 h-5 w-5" />
              </button>
          </div>
      </motion.div>

      {/* Footer */}
      <div className="z-10 text-center border-t border-[var(--color-charcoal-900)] pt-6 max-w-6xl w-full mx-auto">
      </div>
    </div>
  );
}
