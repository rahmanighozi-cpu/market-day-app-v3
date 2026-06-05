import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '../ui';
import { useStore } from '../../store';
import { formatIDR } from '../../lib/utils';
import { Plus, Trash2, Bell, Truck, PackageCheck } from 'lucide-react';

export default function LogistikDashboard() {
  const { peralatan, addPeralatan, deletePeralatan, requestProperti, updateRequestProperti } = useStore();
  
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [source, setSource] = useState<'Pinjam Sekolah' | 'Bawa Sendiri' | 'Sewa'>('Pinjam Sekolah');
  const [status, setStatus] = useState<'Belum Ada' | 'Di Stand' | 'Sudah Dikembalikan'>('Belum Ada');
  const [price, setPrice] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddModal = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !qty) return;
    addPeralatan({
      name,
      qty: parseInt(qty),
      source,
      status,
      condition: 'Bagus', // default
      price: source === 'Sewa' ? parseInt(price || '0') : 0,
      statusAcc: source === 'Sewa' ? 'Menunggu' : 'Disetujui'
    });
    setName(''); setQty(''); setPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white">
          <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-green)]">Sarana & Prasarana</span>
              <h1 className="text-2xl font-black mt-1">Dashboard Tim Logistik</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Kelola perangkat keras, tenda, properti dan ajukan pendanaan sewa ke Tim Bendahara.</p>
          </div>
      </div>

      {requestProperti.filter(r => r.status === 'Diminta').length > 0 && (
         <Card className="bg-orange-500/10 border-orange-500/30 rounded-2xl animate-in slide-in-from-top-4 fade-in duration-300">
            <CardHeader className="pb-3 border-b border-orange-500/20 bg-orange-500/5">
               <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2 font-bold text-lg">
                  <Bell className="w-5 h-5 animate-pulse" /> Urgent: Permintaan Properti Masuk (Tim Penampilan)
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
               {requestProperti.filter(r => r.status === 'Diminta').map(req => (
                  <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-4 rounded-xl border border-orange-500/20 gap-4 hover:border-orange-500/50 transition-colors">
                     <div>
                       <p className="font-bold text-main">{req.name}</p>
                       <p className="text-[10px] font-black text-muted tracking-wide mt-1">DIBUTUHKAN: {req.qty} UNIT</p>
                     </div>
                     <Button size="sm" variant="neon" className="bg-orange-600 border-none text-white hover:bg-orange-700 w-full sm:w-auto h-10 px-6 font-bold uppercase tracking-wider text-xs" onClick={() => updateRequestProperti(req.id, 'Disediakan')}>Tandai Disediakan</Button>
                  </div>
               ))}
            </CardContent>
         </Card>
      )}

      <Card className="bg-card rounded-2xl border-subtle shadow-sm overflow-hidden">
        <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40">
          <CardTitle className="text-lg font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-[var(--primary-green)]" /> Buku Inventaris Logistik & Properti</CardTitle>
          <p className="text-xs text-muted mt-1">Sumber pengadaan "Sewa" akan otomatis direkap untuk persetujuan pencairan dana oleh Bendahara.</p>
        </CardHeader>
        <CardContent className="pt-6">
           <form onSubmit={handleAddModal} className="grid sm:grid-cols-6 gap-3 mb-8 bg-surface p-4 rounded-xl border border-subtle border-l-[3px] border-l-[var(--primary-green)] items-end">
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Nama Alat/Barang</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Tenda Darurat 3x3" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Jumlah</Label>
                <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10" />
              </div>
              <div className="sm:col-span-1 space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Sumber</Label>
                <select className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-1 text-sm outline-none" value={source} onChange={e => setSource(e.target.value as any)}>
                   <option value="Pinjam Sekolah">Pinjam Sekolah</option>
                   <option value="Bawa Sendiri">Bawa Sendiri</option>
                   <option value="Sewa">Sewa (Dana)</option>
                </select>
              </div>
              <div className="sm:col-span-1 space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Status Unit</Label>
                <select className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-1 text-sm outline-none" value={status} onChange={e => setStatus(e.target.value as any)}>
                   <option value="Belum Ada">Belum Ada</option>
                   <option value="Di Stand">Di Stand</option>
                   <option value="Sudah Dikembalikan">Beres / Kembali</option>
                </select>
              </div>
              {source === 'Sewa' ? (
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1 block">Biaya Sewa Satuan</Label>
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-orange-500/50 focus-visible:border-orange-500 h-10" required />
                </div>
              ) : (
                <div className="hidden sm:block"></div>
              )}
              <div className="sm:col-span-6 flex justify-end mt-2">
                <Button type="submit" className="h-10 text-xs px-6 font-bold uppercase tracking-wider bg-[var(--color-charcoal-900)] text-white hover:bg-[var(--primary-green)] hover:text-black hover:border-black transition-colors rounded-xl shadow-lg group"><Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90"/> Input Inventaris</Button>
              </div>
           </form>

           <div className="overflow-x-auto rounded-xl border border-subtle">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-muted uppercase bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)] font-bold tracking-wider">
                 <tr>
                   <th className="px-5 py-4">Nama Properti/Barang</th>
                   <th className="px-5 py-4 text-center">Qty</th>
                   <th className="px-5 py-4">Sumber</th>
                   <th className="px-5 py-4">Status / Lokasi</th>
                   <th className="px-5 py-4">Biaya & Pencairan Dana</th>
                   <th className="px-5 py-4 text-right">Delete</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-subtle">
                  {peralatan.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-xs text-muted font-bold">Belum ada inventaris yang diinput.</td></tr>
                  ) : peralatan.map(item => (
                    <tr key={item.id} className="hover:bg-[var(--color-charcoal-50)] dark:hover:bg-[var(--color-charcoal-950)] transition-colors">
                      <td className="px-5 py-4 font-bold text-main">{item.name}</td>
                      <td className="px-5 py-4 text-center font-black">{item.qty}</td>
                      <td className="px-5 py-4 text-xs font-medium"><span className="bg-blue-500/10 text-blue-500 font-bold px-3 py-1 rounded-full">{item.source}</span></td>
                      <td className="px-5 py-4">
                         <Badge variant={item.status === 'Sudah Dikembalikan' ? 'success' : item.status === 'Belum Ada' ? 'warning' : 'default'} className="font-bold px-3 py-1 uppercase tracking-wider text-[9px]">{item.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                         {item.source !== 'Sewa' ? <span className="text-xs text-muted font-bold">-</span> : (
                             <div className="flex flex-col gap-1 items-start">
                                 <span className="font-black text-orange-500">{formatIDR(item.price)} <span className="text-[10px] font-bold text-muted">/ea</span></span>
                                 <Badge className="font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider" variant={item.statusAcc === 'Disetujui' ? 'success' : item.statusAcc === 'Ditolak' ? 'destructive' : 'warning'}>{item.statusAcc}</Badge>
                             </div>
                         )}
                      </td>
                      <td className="px-5 py-4 text-right min-w-[120px]">
                        {deleteConfirmId === item.id ? (
                            <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)} className="h-8 text-[10px] font-bold">Batal</Button>
                                <Button size="sm" onClick={() => { deletePeralatan(item.id); setDeleteConfirmId(null); }} className="h-8 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold shadow-sm">Hapus</Button>
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}


