import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '../ui';
import { useStore } from '../../store';
import { AlertCircle, Users, Edit, Settings } from 'lucide-react';
import { Role } from '../../types';

export default function PengaturanGlobal() {
  const { standName, waliKelasName, setStandName, setWaliKelasName, resetData, profiles, setProfile } = useStore();
  const [localStand, setLocalStand] = useState(standName);
  
  const [resetConfirm, setResetConfirm] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Edit Mode state
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editLeader, setEditLeader] = useState('');

  const handleUpdateStand = (e: React.FormEvent) => {
      e.preventDefault();
      setStandName(localStand);
      alert('Nama stand / acara berhasil diperbarui.');
  };

  const handleReset = () => {
      if (resetConfirm === 'KONFIRMASI RESET') {
          resetData(resetConfirm);
          setShowResetModal(false);
          setResetConfirm('');
          alert('Seluruh data berhasil dihapus.');
      } else {
          alert('Kata kunci salah!');
      }
  };

  const startEditProfile = (role: Role) => {
      setEditingRole(role);
      setEditLeader(profiles[role].leader);
  };

  const saveEditProfile = () => {
      if (editingRole) {
          setProfile(editingRole, { ...profiles[editingRole], leader: editLeader });
          setEditingRole(null);
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white">
          <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-green)]">Sistem Inti</span>
              <h1 className="text-2xl font-black mt-1">Pengaturan Global</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Kelola identitas sistem utama, otoritas wali kelas, dan profil manajemen kepanitiaan.</p>
          </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* Kiri */}
         <div className="space-y-6">
             <Card className="bg-card rounded-2xl border-subtle shadow-sm">
                 <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40">
                    <CardTitle className="font-bold flex items-center gap-2 text-lg"><Settings className="w-5 h-5 text-[var(--primary-green)]" /> Identitas Event & Kelas</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6">
                     <form onSubmit={handleUpdateStand} className="flex flex-col gap-5">
                         <div className="space-y-2">
                            <Label htmlFor="standname" className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Nama Stand / Usaha Kelas</Label>
                            <Input id="standname" value={localStand} onChange={e => setLocalStand(e.target.value)} placeholder="Masukkan nama stand..." className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-11 text-lg font-bold" />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="wk" className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Otoritas Wali Kelas (Super Admin)</Label>
                            <Input id="wk" value={waliKelasName} onChange={e => setWaliKelasName(e.target.value)} className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-11" />
                         </div>
                         <Button type="submit" variant="secondary" className="w-full h-11 font-bold uppercase tracking-wider text-xs">Simpan Perubahan Identitas</Button>
                     </form>
                 </CardContent>
             </Card>

             <Card className="bg-card rounded-2xl border-red-500/20 shadow-sm overflow-hidden">
                 <CardHeader className="bg-red-500/5 border-b border-red-500/10 pb-4">
                    <CardTitle className="text-red-500 dark:text-red-400 flex items-center gap-2 font-black tracking-wide"><AlertCircle className="w-5 h-5"/> ZONA BERBAHAYA</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-5">
                     <p className="text-sm text-main mb-6 font-medium leading-relaxed">
                         Tindakan ini akan <b>mengahapus permanen</b> seluruh riwayat transaksi, data kas, list menu, logistik, pengingat, dan riwayat operasional tim.
                     </p>
                     <Button variant="destructive" onClick={() => setShowResetModal(true)} className="w-full text-xs font-bold uppercase tracking-wider h-11">Wipe All Data (Hard Reset)</Button>
                 </CardContent>
             </Card>
         </div>

         {/* Kanan - Profil Teams */}
         <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col">
             <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                 <CardTitle className="flex items-center gap-2 font-bold text-lg"><Users className="w-5 h-5 text-blue-500"/> Profil Manajemen Tim Kepanitiaan</CardTitle>
                 <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">Struktur Koordinasi Organisasi</p>
             </CardHeader>
             <CardContent className="flex-1 pt-6 pb-2">
                 <div className="space-y-4 pr-1">
                     {(Object.entries(profiles) as [Role, typeof profiles[Role]][]).map(([role, prof]) => {
                         if(role === 'Wali Kelas') return null; // Ditangani terpisah
                         return (
                             <div key={role} className="p-4 rounded-xl border border-subtle bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] space-y-3">
                                 <div className="flex justify-between items-center pb-2 border-b border-subtle">
                                    <h4 className="font-bold text-main uppercase tracking-wider text-xs">Divisi {role}</h4>
                                    <Badge variant={prof.isFilled ? 'success' : 'default'} className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5">{prof.isFilled ? 'Aktif' : 'Belum Setup'}</Badge>
                                 </div>
                                 {prof.isFilled && (
                                     <>
                                        <div className="text-sm grid grid-cols-12 gap-2 items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted col-span-3">Ketua Div.</span>
                                            {editingRole === role ? (
                                                <div className="flex gap-2 col-span-9">
                                                    <Input className="h-8 text-xs font-bold bg-input border-subtle flex-1" value={editLeader} onChange={e => setEditLeader(e.target.value)} />
                                                    <Button size="sm" variant="neon" className="h-8 text-xs px-3 font-bold" onClick={saveEditProfile}>Simpan</Button>
                                                </div>
                                            ) : (
                                                <div className="col-span-9 flex justify-between items-center bg-surface border border-subtle px-3 py-1.5 rounded-lg">
                                                    <span className="font-bold text-main">{prof.leader}</span> 
                                                    <button onClick={() => startEditProfile(role)} className="text-blue-500 hover:text-blue-600 bg-blue-500/10 p-1.5 rounded-md hover:bg-blue-500/20 transition-colors"><Edit className="w-3 h-3"/></button>
                                                </div>
                                            )}
                                        </div>
                                        {prof.members.length > 0 && (
                                            <div className="text-sm pt-2">
                                               <span className="text-[9px] font-bold uppercase tracking-wider text-muted block mb-1">Daftar Anggota:</span>
                                               <ul className="space-y-1.5 mt-2">
                                                   {prof.members.map(m => (
                                                       <li key={m.id} className="text-xs flex items-start gap-2 bg-input/50 px-2.5 py-1.5 rounded-md font-medium text-main">
                                                          <div className="w-1 h-1 bg-[var(--primary-green)] rounded-full mt-1.5"></div>
                                                          <div className="flex flex-col">
                                                              <span>{m.name}</span>
                                                              <span className="text-[10px] text-muted">{m.task}</span>
                                                          </div>
                                                       </li>
                                                   ))}
                                               </ul>
                                            </div>
                                        )}
                                     </>
                                 )}
                             </div>
                         )
                     })}
                 </div>
             </CardContent>
         </Card>
      </div>

      {/* Basic Reset Modal */}
      {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-200">
             <Card className="w-full max-w-md bg-[var(--color-charcoal-900)] border-red-500/50 shadow-2xl rounded-2xl overflow-hidden scale-in-95 duration-200">
                 <CardHeader className="bg-red-500/10 border-b border-red-500/20 pb-4">
                     <CardTitle className="text-red-500 font-black tracking-wide text-lg flex gap-2 items-center justify-center"><AlertCircle className="w-5 h-5"/> KONFIRMASI MUTLAK</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                     <p className="text-sm text-center font-medium leading-relaxed text-white">Apakah Anda benar-benar yakin ingin menghapus seluruh data pencatatan ekosistem event ini?<br/><br/><span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-md border border-red-500/30 text-xs font-bold uppercase tracking-wider block">Tindakan ini tidak dapat dibatalkan.</span></p>
                     
                     <div className="space-y-2 pt-4">
                         <Label className="text-[10px] font-bold uppercase tracking-wider text-muted text-center block">Ketik "KONFIRMASI RESET" di bawah ini:</Label>
                         <Input 
                            value={resetConfirm} 
                            onChange={e => setResetConfirm(e.target.value)} 
                            className="font-mono text-center font-bold text-red-400 bg-black/50 border-red-500/30 h-12 uppercase" 
                            autoFocus
                            placeholder="Ketik disini..."
                         />
                     </div>
                     <div className="flex gap-3 pt-6">
                         <Button variant="outline" className="flex-1 h-12 font-bold uppercase tracking-wider text-xs border-subtle text-muted hover:text-white" onClick={() => setShowResetModal(false)}>Batal</Button>
                         <Button variant="destructive" className="flex-1 h-12 font-bold uppercase tracking-wider text-xs bg-red-600 hover:bg-red-700" disabled={resetConfirm !== 'KONFIRMASI RESET'} onClick={handleReset}>Hapus Semua Data!</Button>
                     </div>
                 </CardContent>
             </Card>
          </div>
      )}
    </div>
  );
}

