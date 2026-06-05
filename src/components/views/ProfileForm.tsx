import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Role } from '../../types';
import { useStore } from '../../store';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface ProfileFormProps {
  role: Role;
  onBack: () => void;
  onComplete: () => void;
}

export default function ProfileForm({ role, onBack, onComplete }: ProfileFormProps) {
  const { profiles, setProfile, setWaliKelasName, waliKelasName, standName, setStandName } = useStore();
  const profile = profiles[role];

  const [leader, setLeader] = useState(profile?.leader || '');
  const [localStand, setLocalStand] = useState(standName || 'Stand Gastronomi Kelas XI');
  const [memberQty, setMemberQty] = useState(1);
  const [memberListStr, setMemberListStr] = useState('');
  const [localWaliKelas, setLocalWaliKelas] = useState(waliKelasName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStandName(localStand);
    
    if (role === 'Wali Kelas') {
      if (!localWaliKelas.trim()) return;
      setWaliKelasName(localWaliKelas);
      setProfile(role, { isFilled: true, leader: '', members: [] });
    } else {
      if (!leader.trim()) return;
      
      const parsedMembers = memberListStr.split('\n')
        .filter(line => line.includes(':'))
        .map(line => {
            const [name, task] = line.split(':');
            return { id: Math.random().toString(36).substring(7), name: name.trim(), task: task.trim() };
        });

      setProfile(role, { isFilled: true, leader: leader.trim(), members: parsedMembers });
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-950)] text-white p-6 flex items-center justify-center">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-8 rounded-3xl space-y-6"
        >
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-[var(--color-charcoal-400)] hover:text-white flex items-center space-x-2 text-sm font-semibold">
                    <ArrowLeft className="h-4 w-4" /> <span>Kembali</span>
                </button>
                <span className="text-xs text-[var(--primary-green)] font-bold uppercase tracking-wider">Inisialisasi Peran</span>
            </div>

            <div>
                <h2 className="text-2xl font-black">Lengkapi Profil Operasional</h2>
                <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Konfigurasikan informasi dasar untuk masuk ke dashboard {role}.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] uppercase mb-1.5">Nama Stand Market Day</label>
                    <input 
                        type="text"
                        value={localStand}
                        onChange={(e) => setLocalStand(e.target.value)}
                        required
                        className="w-full bg-[var(--color-charcoal-950)] border border-[var(--color-charcoal-800)] focus:border-[var(--primary-green)] p-3 rounded-xl text-sm focus:outline-none"
                        placeholder="Contoh: Stand Gastronomi Roti Panggang"
                    />
                </div>

                {role === 'Wali Kelas' ? (
                    <div>
                        <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] uppercase mb-1.5">Nama Lengkap Wali Kelas</label>
                        <input 
                            type="text"
                            value={localWaliKelas}
                            onChange={(e) => setLocalWaliKelas(e.target.value)}
                            required
                            className="w-full bg-[var(--color-charcoal-950)] border border-[var(--color-charcoal-800)] focus:border-[var(--primary-green)] p-3 rounded-xl text-sm focus:outline-none"
                            placeholder="Contoh: Dra. Herlina Widjaja"
                        />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] uppercase mb-1.5">Nama Ketua Tim</label>
                                <input 
                                    type="text"
                                    value={leader}
                                    onChange={(e) => setLeader(e.target.value)}
                                    required
                                    className="w-full bg-[var(--color-charcoal-950)] border border-[var(--color-charcoal-800)] focus:border-[var(--primary-green)] p-3 rounded-xl text-sm focus:outline-none"
                                    placeholder="Nama Ketua"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] uppercase mb-1.5">Jumlah Anggota</label>
                                <input 
                                    type="number"
                                    value={memberQty}
                                    onChange={(e) => setMemberQty(Math.max(1, parseInt(e.target.value) || 1))}
                                    required
                                    min="1"
                                    className="w-full bg-[var(--color-charcoal-950)] border border-[var(--color-charcoal-800)] focus:border-[var(--primary-green)] p-3 rounded-xl text-sm focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] uppercase mb-1.5">Daftar Anggota & Tugas Spesifik</label>
                            <p className="text-[10px] text-[var(--color-charcoal-500)] mb-1">Format: Nama Anggota : Tugas Spesifik (pisahkan per baris)</p>
                            <textarea 
                                value={memberListStr}
                                onChange={(e) => setMemberListStr(e.target.value)}
                                rows={4}
                                placeholder="Siti Aminah : Bagian Packing&#10;Rian Hidayat : Dokumentasi Produk"
                                className="w-full bg-[var(--color-charcoal-950)] border border-[var(--color-charcoal-800)] focus:border-[var(--primary-green)] p-3 rounded-xl text-xs focus:outline-none font-mono resize-none"
                            ></textarea>
                        </div>
                    </>
                )}

                <button 
                    type="submit"
                    className="w-full py-3 bg-[var(--primary-green)] text-[var(--color-charcoal-950)] hover:bg-[var(--primary-green-hover)] font-bold rounded-xl text-sm transition mt-2 inline-flex items-center justify-center"
                >
                    Simpan & Buka Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                </button>
            </form>
        </motion.div>
    </div>
  );
}
