import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../ui';
import { useStore } from '../../store';
import { DownloadCloud, Users, UserCheck, TrendingUp, TrendingDown, DollarSign, ListOrdered, ShoppingBag, Box, Receipt } from 'lucide-react';
import { Role } from '../../types';
import { formatIDR, formatDate, formatTime } from '../../lib/utils';

export default function RekamJejak() {
  const { 
      standName, waliKelasName, profiles,
      modalAwal, bahanBaku, peralatan, pettyCash, 
      transaksi
  } = useStore();

  const totalPengeluaranBahan = bahanBaku.reduce((acc, curr) => acc + (curr.source === 'Kas' && curr.statusAcc === 'Disetujui' ? curr.totalPrice : 0), 0);
  const totalPengeluaranAlat = peralatan.reduce((acc, curr) => acc + (curr.source === 'Sewa' && curr.statusAcc === 'Disetujui' ? curr.price * curr.qty : 0), 0);
  const totalPettyCash = pettyCash.reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalPengeluaran = totalPengeluaranBahan + totalPengeluaranAlat + totalPettyCash;
  const totalPendapatan = transaksi.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;

  const allTransactions = [...transaksi].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const handlePrint = () => {
    window.print();
  };

  const roleLabels: Role[] = ['Bendahara', 'Kasir', 'Keliling', 'Konsumsi', 'Logistik', 'Desain', 'Penampilan'];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end print-hide gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-green)]">Ringkasan Operasional</span>
          <h2 className="text-2xl font-black tracking-tight mt-1">Ringkasan Event Market Day</h2>
          <p className="text-muted text-xs font-semibold mt-1">Laporan komprehensif mulai dari tim, keuangan, hingga daftar transaksi pengunjung.</p>
        </div>
        <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-[var(--color-charcoal-900)] text-white hover:bg-[var(--primary-green)] hover:text-black hover:border-black border border-transparent px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
            <DownloadCloud className="h-4 w-4" /> Unduh Dokumen Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card rounded-2xl border-subtle shadow-sm">
             <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2"><UserCheck className="w-5 h-5 text-blue-500" /> Profil Stand</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 space-y-4">
                 <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Nama Stand</p>
                     <p className="font-black text-xl text-main mt-1">{standName || 'Belum Diatur'}</p>
                 </div>
                 <hr className="border-subtle" />
                 <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Guru Pembimbing / Wali Kelas</p>
                     <p className="font-bold text-main mt-1 text-lg">{waliKelasName || 'Belum Diatur'}</p>
                 </div>
             </CardContent>
          </Card>

          <Card className="bg-card rounded-2xl border-subtle shadow-sm">
             <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-500" /> Ringkasan Keuangan</CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-4 rounded-xl border border-subtle">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Total Modal Awal</p>
                       <p className="font-black text-2xl text-main">{formatIDR(modalAwal)}</p>
                   </div>
                   <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 mb-1">Total Pendapatan</p>
                       <p className="font-black text-lg text-green-700 dark:text-green-300">+{formatIDR(totalPendapatan)}</p>
                   </div>
                   <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">Total Pengeluaran</p>
                       <p className="font-black text-lg text-red-700 dark:text-red-300">-{formatIDR(totalPengeluaran)}</p>
                   </div>
                   <div className={`col-span-2 p-4 rounded-xl border flex items-center justify-between ${labaBersih >= 0 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                       <div>
                           <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${labaBersih >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>Status Keuangan</p>
                           <p className={`font-black text-xl ${labaBersih >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                               {labaBersih >= 0 ? 'Surplus / Profit' : 'Defisit / Loss'}
                           </p>
                       </div>
                       <div className="text-right">
                           <p className={`font-black text-2xl ${labaBersih >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                               {labaBersih >= 0 ? '+' : ''}{formatIDR(labaBersih)}
                           </p>
                       </div>
                   </div>
                </div>
             </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Catatan Transaksi (Siapa yang beli) */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col max-h-[500px]">
           <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4 shrink-0">
               <CardTitle className="text-lg font-bold flex items-center gap-2"><ListOrdered className="w-5 h-5 text-indigo-500" /> Catatan Transaksi (Pembeli)</CardTitle>
           </CardHeader>
           <CardContent className="pt-4 flex-1 overflow-y-auto">
               <div className="space-y-3">
                   {allTransactions.length === 0 ? (
                       <p className="text-[10px] font-bold uppercase tracking-wider text-center text-muted py-8 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Tidak ada transaksi tercatat.</p>
                   ) : (
                       allTransactions.map(tx => (
                           <div key={tx.id} className="p-3 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] rounded-xl flex justify-between items-center border border-subtle">
                               <div>
                                   <p className="font-bold text-sm text-main">{tx.buyerName || 'Pelanggan Walk-in'} <span className="text-[10px] text-muted font-bold ml-1 uppercase">({tx.sellerRole === 'Kasir' ? 'Kasir Stan' : 'Tim Keliling'})</span></p>
                                   <p className="text-[10px] font-bold mt-1 text-muted uppercase tracking-wider">{new Date(tx.time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                               </div>
                               <div className="text-right">
                                   <p className="font-black text-green-500 whitespace-nowrap text-sm">+{formatIDR(tx.totalPrice)}</p>
                                   <p className="text-[10px] font-bold mt-1 text-muted uppercase tracking-wider">{tx.qty} {tx.menuName}</p>
                               </div>
                           </div>
                       ))
                   )}
               </div>
           </CardContent>
        </Card>

        {/* Breakdown Pengeluaran */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col max-h-[500px]">
           <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4 shrink-0">
               <CardTitle className="text-lg font-bold flex items-center gap-2"><Receipt className="w-5 h-5 text-orange-500" /> Detail Pengeluaran Modal</CardTitle>
           </CardHeader>
           <CardContent className="pt-4 flex-1 overflow-y-auto">
               <div className="space-y-4">
                  {/* Bahan Baku */}
                   <div>
                       <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5"/> Pengeluaran Konsumsi (Bahan Baku)</p>
                       <div className="space-y-2">
                           {bahanBaku.filter(b => b.source === 'Kas' && b.statusAcc === 'Disetujui').length === 0 ? <p className="text-[10px] text-muted font-bold">Nihil</p> : bahanBaku.filter(b => b.source === 'Kas' && b.statusAcc === 'Disetujui').map(b => (
                               <div key={b.id} className="flex justify-between text-sm py-1 border-b border-subtle/50 last:border-0 border-dashed">
                                   <span className="font-medium">{b.name} <span className="text-muted text-[10px] ml-1">x{b.quantity}</span></span>
                                   <span className="font-bold text-red-500">-{formatIDR(b.totalPrice)}</span>
                               </div>
                           ))}
                       </div>
                   </div>

                  {/* Peralatan */}
                   <div>
                       <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5"><Box className="w-3.5 h-3.5"/> Pengeluaran Logistik (Sewa Inventaris)</p>
                       <div className="space-y-2">
                           {peralatan.filter(p => p.source === 'Sewa' && p.statusAcc === 'Disetujui').length === 0 ? <p className="text-[10px] text-muted font-bold">Nihil</p> : peralatan.filter(p => p.source === 'Sewa' && p.statusAcc === 'Disetujui').map(p => (
                               <div key={p.id} className="flex justify-between text-sm py-1 border-b border-subtle/50 last:border-0 border-dashed">
                                   <span className="font-medium">{p.name} <span className="text-muted text-[10px] ml-1">x{p.qty}</span></span>
                                   <span className="font-bold text-red-500">-{formatIDR(p.price * p.qty)}</span>
                               </div>
                           ))}
                       </div>
                   </div>

                  {/* Petty Cash */}
                   <div>
                       <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Pengeluaran Mendadak (Kas Kecil)</p>
                       <div className="space-y-2">
                           {pettyCash.length === 0 ? <p className="text-[10px] text-muted font-bold">Nihil</p> : pettyCash.map(pc => (
                               <div key={pc.id} className="flex justify-between text-sm py-1 border-b border-subtle/50 last:border-0 border-dashed">
                                   <span className="font-medium">{pc.description} <span className="text-muted text-[10px] ml-1">{new Date(pc.date).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })}</span></span>
                                   <span className="font-bold text-red-500">-{formatIDR(pc.amount)}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           </CardContent>
        </Card>
      </div>

      <h3 className="font-black text-lg mt-8 text-main border-b border-subtle pb-2 flex items-center gap-2"><Users className="w-5 h-5" /> Struktur Divisi Tim</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
         {roleLabels.map(role => {
             const prof = profiles[role];
             if (!prof?.isFilled) {
                 return (
                     <div key={role} className="bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] border border-dashed border-subtle p-4 rounded-xl flex flex-col items-center justify-center text-center opacity-50">
                         <p className="font-bold text-main">{role}</p>
                         <p className="text-[10px] font-bold tracking-wider uppercase text-muted mt-1">Belum Disiapkan</p>
                     </div>
                 );
             }
             return (
                 <div key={role} className="bg-card border border-subtle p-4 rounded-xl shadow-sm hover:border-[var(--primary-green)]/30 transition-colors">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-green-dark)] dark:text-[var(--primary-green)] mb-3 bg-[var(--primary-green)]/10 inline-block px-2 py-0.5 rounded-md">
                         Tim {role}
                     </p>
                     <div className="space-y-3">
                         <div>
                             <p className="text-[10px] font-bold uppercase text-muted">Ketua Divisi</p>
                             <p className="font-bold text-main">{prof.leader}</p>
                         </div>
                         {prof.members.length > 0 && (
                             <div>
                                 <p className="text-[10px] font-bold uppercase text-muted mb-1">Anggota & Tugas</p>
                                 <div className="space-y-2">
                                     {prof.members.map(m => (
                                         <div key={m.id} className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)] p-2 rounded-lg">
                                             <p className="font-bold text-xs text-main">{m.name}</p>
                                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted mt-0.5">Tugas: {m.task}</p>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             );
         })}
      </div>
      
      {/* Hide things when printing */}
      <style>{`
        @media print {
            .print-hide { display: none !important; }
            body { background: white !important; color: black !important; }
            .bg-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
            .overflow-y-auto { overflow: visible !important; max-height: none !important; }
        }
      `}</style>
    </div>
  );
}
