import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label } from '../ui';
import { useStore } from '../../store';
import { formatIDR, formatDate } from '../../lib/utils';
import { Check, X, FileText, Receipt, HandCoins, Settings2, Trash2 } from 'lucide-react';
import { FinancialSummaryCards } from './WaliKelasDashboard';
import { AnimatePresence, motion } from 'motion/react';

export default function BendaharaDashboard() {
  const { 
      modalAwal, setModalAwal, bahanBaku, accBahanBaku, 
      peralatan, accPeralatan, pettyCash, addPettyCash, deletePettyCash 
  } = useStore();

  const [pcDesc, setPcDesc] = useState('');
  const [pcAmount, setPcAmount] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [localModal, setLocalModal] = useState(modalAwal.toString());

  const handleUpdateModal = (e: React.FormEvent) => {
      e.preventDefault();
      setModalAwal(parseInt(localModal) || 0);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddPettyCash = (e: React.FormEvent) => {
      e.preventDefault();
      if(!pcDesc || !pcAmount) return;
      addPettyCash({ date: new Date().toISOString(), description: pcDesc, amount: parseInt(pcAmount) });
      setPcDesc('');
      setPcAmount('');
  };

  // Filter requests that need approval
  const konsumsiRequests = bahanBaku.filter(b => b.source === 'Kas');
  const logistikRequests = peralatan.filter(p => p.source === 'Sewa');

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-gradient-to-r from-[var(--color-charcoal-800)] to-[var(--color-charcoal-900)] border border-[var(--color-charcoal-700)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white shadow-sm">
          <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-green)]">Arsip Keuangan</span>
              <h1 className="text-2xl font-black mt-1 tracking-tight">Dashboard Bendahara</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1 font-medium border-l-2 border-[var(--primary-green)] pl-2">Pengendalian arus kas stan, persetujuan anggaran, & modal awal.</p>
          </div>
      </div>

      <FinancialSummaryCards />

      <div className="grid gap-6 lg:grid-cols-3 pt-4">
        {/* Persetujuan Anggaran */}
        <Card className="bg-card lg:col-span-2 rounded-2xl border-subtle shadow-sm flex flex-col">
          <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
             <CardTitle className="flex items-center gap-2 font-bold text-lg"><Receipt className="w-5 h-5 text-blue-500" /> Persetujuan Anggaran Pengadaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 flex-1">
             
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <FileText className="h-4 w-4" /> Ajuan Belanja Tim Konsumsi
              </h4>
              <div className="space-y-3">
                {konsumsiRequests.length === 0 ? <p className="text-[10px] font-bold uppercase tracking-wider text-muted text-center py-6 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Tidak ada ajuan persetujuan dana.</p> : konsumsiRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-4 rounded-xl border border-subtle border-l-orange-500 border-l-4 hover:border-r-orange-500/20 transition-all">
                     <div>
                       <p className="font-bold text-sm text-main leading-tight">{req.name} <span className="font-black text-muted text-[10px]">({req.quantity} Pcs)</span></p>
                       <p className="text-[10px] text-muted mt-1 font-bold uppercase tracking-wider">Total Rp: <span className="text-main font-black tracking-normal text-xs">{formatIDR(req.totalPrice)}</span></p>
                     </div>
                     <div className="flex items-center gap-2">
                        {req.statusAcc === 'Menunggu' ? (
                          <>
                            <Button size="icon" variant="neon" className="h-9 w-9 bg-green-600 border-none hover:bg-green-700 text-white rounded-lg shadow-sm" onClick={() => accBahanBaku(req.id, 'Disetujui')}><Check className="h-4 w-4" /></Button>
                            <Button size="icon" variant="neon" className="h-9 w-9 bg-red-600 border-none hover:bg-red-700 text-white rounded-lg shadow-sm" onClick={() => accBahanBaku(req.id, 'Ditolak')}><X className="h-4 w-4" /></Button>
                          </>
                        ) : (
                          <Badge variant={req.statusAcc === 'Disetujui' ? 'success' : 'destructive'} className="font-bold py-1 px-3 uppercase tracking-wider text-[9px]">{req.statusAcc}</Badge>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileText className="h-4 w-4" /> Ajuan Sewa Tim Logistik
              </h4>
              <div className="space-y-3">
                {logistikRequests.length === 0 ? <p className="text-[10px] font-bold uppercase tracking-wider text-muted text-center py-6 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Tidak ada ajuan persetujuan sewa alat.</p> : logistikRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-4 rounded-xl border border-subtle border-l-purple-500 border-l-4 hover:border-r-purple-500/20 transition-all">
                     <div>
                       <p className="font-bold text-sm text-main leading-tight">{req.name} <span className="font-black text-muted text-[10px]">({req.qty} Pcs)</span></p>
                       <p className="text-[10px] text-muted mt-1 font-bold uppercase tracking-wider">Biaya Sewa: <span className="text-main font-black tracking-normal text-xs">{formatIDR(req.price)}</span></p>
                     </div>
                     <div className="flex items-center gap-2">
                        {req.statusAcc === 'Menunggu' ? (
                          <>
                            <Button size="icon" variant="neon" className="h-9 w-9 bg-green-600 border-none hover:bg-green-700 text-white rounded-lg shadow-sm" onClick={() => accPeralatan(req.id, 'Disetujui')}><Check className="h-4 w-4" /></Button>
                            <Button size="icon" variant="neon" className="h-9 w-9 bg-red-600 border-none hover:bg-red-700 text-white rounded-lg shadow-sm" onClick={() => accPeralatan(req.id, 'Ditolak')}><X className="h-4 w-4" /></Button>
                          </>
                        ) : (
                          <Badge variant={req.statusAcc === 'Disetujui' ? 'success' : 'destructive'} className="font-bold py-1 px-3 uppercase tracking-wider text-[9px]">{req.statusAcc}</Badge>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Pencatatan Dana Darurat (Petty Cash) & Modal */}
        <div className="space-y-6 lg:col-span-1">
            <Card className="bg-card rounded-2xl border-subtle shadow-sm">
                <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                    <CardTitle className="flex items-center gap-2 font-bold text-lg"><Settings2 className="w-5 h-5 text-[var(--primary-green)]" /> Penetapan Modal Stan</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleUpdateModal} className="space-y-3">
                        <div>
                        <Label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Modal Awal Pembukaan Stan</Label>
                        <Input type="number" value={localModal} onChange={e => setLocalModal(e.target.value)} required className="h-12 bg-input font-black text-lg focus:border-[var(--primary-green)]/50" />
                        </div>
                        <Button type="submit" variant="neon" className="w-full h-11 border-none bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider text-[10px]">Simpan Target Modal</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col h-[calc(100%-250px)] min-h-[300px]">
               <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                  <CardTitle className="flex items-center gap-2 font-bold text-lg"><HandCoins className="w-5 h-5 text-orange-500" /> Kas Kecil (Petty Cash)</CardTitle>
               </CardHeader>
               <CardContent className="pt-6 flex flex-col flex-1">
                  <form onSubmit={handleAddPettyCash} className="space-y-4 mb-6">
                     <div>
                       <Label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Deskripsi Kebutuhan Mendadak</Label>
                       <Input value={pcDesc} onChange={e => setPcDesc(e.target.value)} placeholder="Misal: Es batu darurat" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-11 font-medium" />
                     </div>
                     <div>
                       <Label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Jumlah Biaya (Rp)</Label>
                       <Input type="number" value={pcAmount} onChange={e => setPcAmount(e.target.value)} placeholder="0" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-11 font-black" />
                     </div>
                     <Button type="submit" className="w-full h-11 mt-2 font-bold bg-[var(--color-charcoal-900)] hover:bg-orange-600 dark:bg-orange-600/20 dark:text-orange-500 dark:hover:bg-orange-600 dark:hover:text-white border dark:border-orange-500/30 text-white transition-colors text-[10px] uppercase tracking-wider rounded-xl shadow-sm">Catat Kas Keluar</Button>
                  </form>
                  <hr className="border-subtle" />
                  <div className="space-y-3 flex-1 overflow-y-auto mt-4 pr-2">
                     <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Riwayat Kas Kecil</p>
                     {pettyCash.length === 0 ? <p className="text-[10px] font-bold uppercase tracking-wider text-center text-muted py-6 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Tidak ada catatan petty cash.</p> : pettyCash.map((pc) => (
                        <div key={pc.id} className="p-3 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] rounded-xl flex justify-between items-center border border-subtle gap-2">
                           <div className="overflow-hidden flex-1">
                             <p className="font-bold text-sm text-main truncate leading-tight">{pc.description}</p>
                             <p className="text-[9px] text-muted font-bold mt-1 uppercase tracking-wider">Jam: {new Date(pc.date).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })}</p>
                           </div>
                           <div className="font-black text-red-500 whitespace-nowrap text-xs text-right">
                              -{formatIDR(pc.amount)}
                           </div>
                           {deleteConfirmId === pc.id ? (
                               <div className="flex items-center gap-1">
                                   <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)} className="h-8 text-[10px] font-bold">Batal</Button>
                                   <Button size="sm" onClick={() => { deletePettyCash(pc.id); setDeleteConfirmId(null); }} className="h-8 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold">Hapus</Button>
                               </div>
                           ) : (
                               <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(pc.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-500/10 flex-shrink-0">
                                   <Trash2 className="h-4 w-4" />
                               </Button>
                           )}
                        </div>
                     )).reverse()}
                  </div>
               </CardContent>
            </Card>
        </div>

      </div>
      {/* Toast Notification */}
      <AnimatePresence>
          {showToast && (
              <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="fixed top-4 left-0 right-0 mx-auto w-max z-50 pointer-events-none"
              >
                  <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl shadow-black/20 font-medium text-sm">
                      <div className="bg-green-500 rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                      <span>Target modal awal berhasil ditetapkan!</span>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
