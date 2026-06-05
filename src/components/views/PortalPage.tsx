import React from 'react';
import { motion } from 'motion/react';
import { Role } from '../../types';
import { UserCheck, Wallet, ShoppingCart, Truck, Utensils, PackageSearch, Palette, Shell } from 'lucide-react';
import { useStore } from '../../store';
import { Badge, Button } from '../ui';
import { ArrowLeft } from 'lucide-react';

interface PortalPageProps {
  onSelectRole: (role: Role) => void;
  onBack?: () => void;
}

const ROLES: { name: Role; icon: React.ElementType; desc: string }[] = [
  { name: 'Wali Kelas', icon: UserCheck, desc: 'Pemantauan eksekutif & persetujuan ide promosi stan.' },
  { name: 'Bendahara', icon: Wallet, desc: 'Pengendalian kas besar, pengalokasian & persetujuan dana belanja.' },
  { name: 'Kasir', icon: ShoppingCart, desc: 'Sistem POS transaksi di tempat & status ketersediaan barang.' },
  { name: 'Keliling', icon: Truck, desc: 'Pencatatan penjualan keliling dengan pelacak sisa barang.' },
  { name: 'Konsumsi', icon: Utensils, desc: 'Manajemen resep bahan baku, kedaluwarsa & list produk jadi.' },
  { name: 'Logistik', icon: PackageSearch, desc: 'Inventarisasi peralatan stan, kelayakan alat & pemenuhan aset.' },
  { name: 'Desain', icon: Palette, desc: 'Upload ide visual promosi & pantau status revisi wali kelas.' },
  { name: 'Penampilan', icon: Shell, desc: 'Manajemen naskah, rundowns acara promosi & kebutuhan panggung.' },
];

export default function PortalPage({ onSelectRole, onBack }: PortalPageProps) {
  const { profiles } = useStore();

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-950)] text-white p-6 md:p-12 flex flex-col justify-center">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto w-full space-y-8"
        >
            
            {/* Title Bar */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="text-[var(--color-charcoal-400)] hover:text-white flex items-center space-x-2 text-sm font-semibold transition"
                >
                    <ArrowLeft className="w-4 h-4" /> <span>Kembali</span>
                </button>
                <span className="text-xs text-[var(--primary-green)] font-bold tracking-widest">PORTAL PERAN INTERAKTIF</span>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold">Selamat Datang di Portal Market Day</h2>
                <p className="text-[var(--color-charcoal-400)] text-sm md:text-base font-medium">Silakan pilih peran operasional Anda untuk masuk ke antarmuka kerja khusus:</p>
            </div>

            {/* Grid Peran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {ROLES.map((role, idx) => {
                    const isConfigured = profiles[role.name]?.isFilled;
                    const Icon = role.icon;
                    return (
                        <motion.button 
                            key={role.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onSelectRole(role.name)}
                            className="bg-[var(--color-charcoal-900)]/60 border border-[var(--color-charcoal-800)] hover:border-[var(--primary-green)] p-5 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--primary-green)]/5 group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--primary-green)]/10 text-[var(--primary-green)] group-hover:bg-[var(--primary-green)] group-hover:text-[var(--color-charcoal-950)] flex items-center justify-center transition-colors duration-300">
                                    <Icon className="w-6 h-6" />
                                </div>
                                {isConfigured ? (
                                    <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-bold inline-flex items-center gap-1">
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full font-bold inline-flex items-center gap-1">
                                        Belum Setup
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-base text-white group-hover:text-[var(--primary-green)] transition-colors">{role.name}</h3>
                            <p className="text-xs text-[var(--color-charcoal-400)] font-medium leading-relaxed mt-2 line-clamp-2">{role.desc}</p>
                        </motion.button>
                    );
                })}
            </div>

        </motion.div>
    </div>
  );
}
