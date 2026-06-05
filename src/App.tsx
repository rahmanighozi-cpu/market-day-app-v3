import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { Role } from './types';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/views/LandingPage';
import PortalPage from './components/views/PortalPage';
import ProfileForm from './components/views/ProfileForm';
import DashboardLayout from './components/layout/DashboardLayout';
import WaliKelasDashboard from './components/views/WaliKelasDashboard';
import BendaharaDashboard from './components/views/BendaharaDashboard';
import KasirDashboard from './components/views/KasirDashboard';
import KelilingDashboard from './components/views/KelilingDashboard';
import KonsumsiDashboard from './components/views/KonsumsiDashboard';
import LogistikDashboard from './components/views/LogistikDashboard';
import DesainDashboard from './components/views/DesainDashboard';
import PenampilanDashboard from './components/views/PenampilanDashboard';
import RekamJejak from './components/views/RekamJejak';
import PengaturanGlobal from './components/views/PengaturanGlobal';

export default function App() {
  const { profiles } = useStore();
  
  // App routing state
  const [currentView, setCurrentView] = useState<'landing' | 'portal' | 'profile' | 'dashboard' | 'logs' | 'settings'>('landing');
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleRoleSelect = (role: Role) => {
    setActiveRole(role);
    // If profile is already filled, go straight to dashboard
    if (profiles[role]?.isFilled || (role === 'Wali Kelas' && profiles['Wali Kelas']?.isFilled)) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('profile');
    }
  };

  const renderDashboard = () => {
    switch (activeRole) {
      case 'Wali Kelas': return <WaliKelasDashboard />;
      case 'Bendahara': return <BendaharaDashboard />;
      case 'Kasir': return <KasirDashboard />;
      case 'Keliling': return <KelilingDashboard />;
      case 'Konsumsi': return <KonsumsiDashboard />;
      case 'Logistik': return <LogistikDashboard />;
      case 'Desain': return <DesainDashboard />;
      case 'Penampilan': return <PenampilanDashboard />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-main transition-colors duration-300">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <LandingPage onEnter={() => setCurrentView('portal')} />
          </motion.div>
        )}
        
        {currentView === 'portal' && (
          <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <PortalPage onSelectRole={handleRoleSelect} onBack={() => setCurrentView('landing')} />
          </motion.div>
        )}
        
        {currentView === 'profile' && activeRole && (
           <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
             <ProfileForm 
               role={activeRole} 
               onBack={() => { setActiveRole(null); setCurrentView('portal'); }} 
               onComplete={() => setCurrentView('dashboard')} 
             />
           </motion.div>
        )}

        {['dashboard', 'logs', 'settings'].includes(currentView) && (
          <motion.div key="main-board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <DashboardLayout 
              activeRole={activeRole!} 
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view as any)}
              onLogout={() => { setActiveRole(null); setCurrentView('portal'); }}
              onExit={() => { setActiveRole(null); setCurrentView('landing'); }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={currentView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {currentView === 'dashboard' && renderDashboard()}
                  {currentView === 'logs' && <RekamJejak />}
                  {currentView === 'settings' && <PengaturanGlobal />}
                </motion.div>
              </AnimatePresence>
            </DashboardLayout>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
