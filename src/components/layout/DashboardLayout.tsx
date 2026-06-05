import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../../types';
import { useStore } from '../../store';
import { 
  X, LogOut, Settings, History, LayoutDashboard, 
  Moon, Sun, PanelLeftClose, PanelLeft, RefreshCw
} from 'lucide-react';

interface DashboardLayoutProps {
  activeRole: Role;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onExit: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ activeRole, currentView, onNavigate, onLogout, onExit, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme, standName, profiles, waliKelasName } = useStore();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const profile = profiles[activeRole];
  const activeName = activeRole === 'Wali Kelas' ? waliKelasName : profile.leader;

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-main">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 border-r border-subtle bg-card z-20 flex flex-col"
          >
            <div className="p-6 border-b border-subtle flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-green)] flex items-center justify-center text-[var(--color-charcoal-950)] font-bold text-xl shadow-lg shadow-[var(--primary-green)]/20">
                        M
                    </div>
                    <div>
                        <h1 className="font-extrabold text-sm tracking-wide dark:text-white">MARKET DAY</h1>
                        <span className="text-xs text-muted font-medium">Internal System v2.0</span>
                    </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-muted hover:text-main">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto !scrollbar-hide py-4 px-4 space-y-6">
              <nav className="space-y-1">
                <p className="px-3 text-[10px] font-bold tracking-wider text-muted uppercase mb-2">MENU UTAMA</p>
                <SidebarButton 
                  icon={LayoutDashboard} 
                  label={`Dashboard ${activeRole}`} 
                  active={currentView === 'dashboard'} 
                  onClick={() => onNavigate('dashboard')} 
                />
                <SidebarButton 
                  icon={History} 
                  label="Ringkasan Event" 
                  active={currentView === 'logs'} 
                  onClick={() => onNavigate('logs')} 
                />
                <SidebarButton 
                  icon={Settings} 
                  label="Pengaturan Sistem" 
                  active={currentView === 'settings'} 
                  onClick={() => onNavigate('settings')} 
                />
              </nav>

              <nav className="space-y-1 border-t border-subtle pt-4">
                <p className="px-3 text-[10px] font-bold tracking-wider text-muted uppercase mb-2">GERBANG AKSES</p>
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-card-hover text-left transition duration-150 group"
                >
                    <RefreshCw className="w-5 h-5" />
                    <span>Pindah Peran Tim</span>
                </button>

                <button 
                    onClick={onExit}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 text-left transition duration-150"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar Sistem</span>
                </button>
              </nav>
            </div>
            
            <div className="p-4 border-t border-subtle shrink-0">
                <div className="bg-[var(--color-charcoal-200)]/40 dark:bg-[var(--color-charcoal-800)]/50 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-charcoal-300)] dark:bg-[var(--color-charcoal-700)] flex items-center justify-center text-[var(--color-charcoal-800)] dark:text-[var(--color-charcoal-200)] font-bold">
                        {activeRole.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-semibold truncate text-main">
                            {activeName || 'Nama Pengguna'}
                        </p>
                        <p className="text-[10px] text-muted font-medium truncate capitalize">
                            Peran: {activeRole}
                        </p>
                    </div>
                </div>
                <p className="text-[9px] text-center text-muted mt-3 font-semibold tracking-wider">DEVELOPED BY GHOZI RAHMANI</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-subtle bg-surface/80 backdrop-blur-md px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl bg-[var(--color-charcoal-200)]/50 dark:bg-[var(--color-charcoal-900)]/50 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-600)] dark:text-[var(--color-charcoal-300)] transition-colors"
                title="Sembunyikan/Tampilkan Panel Samping"
            >
                {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>
            <div>
                <span className="text-xs font-medium text-muted uppercase tracking-widest">Market Day Stan</span>
                <h2 className="font-bold text-lg text-main leading-tight">
                    {standName || 'Stand Gastronomi'}
                </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 py-1.5 px-3 rounded-full text-xs font-bold animate-[pulse_2s_ease-in-out_infinite]">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                 <span>Sistem Terkoneksi</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-6">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${
        active 
          ? 'bg-[var(--primary-green)]/10 text-[var(--primary-green-hover)] dark:text-[var(--primary-green)]' 
          : 'text-muted hover:bg-card-hover'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-[var(--primary-green-hover)] dark:text-[var(--primary-green)]' : ''}`} />
      <span>{label}</span>
    </button>
  );
}
