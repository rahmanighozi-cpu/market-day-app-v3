import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '../ui';
import { useStore } from '../../store';
import { formatIDR } from '../../lib/utils';
import { Plus, Trash2, Edit, ShoppingBasket, Soup } from 'lucide-react';
import { BahanBaku, MenuProduk } from '../../types';

export default function KonsumsiDashboard() {
  const { bahanBaku, addBahanBaku, deleteBahanBaku, menuProduk, addMenu, deleteMenu } = useStore();
  
  // States for Bahan Baku Form
  const [bbName, setBbName] = useState('');
  const [bbCat, setBbCat] = useState<'Bahan Baku' | 'Pengemas'>('Bahan Baku');
  const [bbPrice, setBbPrice] = useState('');
  const [bbQty, setBbQty] = useState('');
  const [bbSource, setBbSource] = useState<'Kas' | 'Sponsor' | 'Iuran'>('Kas');

  // States for Menu Form
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuStock, setMenuStock] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmMenuId, setDeleteConfirmMenuId] = useState<string | null>(null);

  const handleAddBahanBaku = (e: React.FormEvent) => {
    e.preventDefault();
    if(!bbName || !bbPrice || !bbQty) return;
    addBahanBaku({
      name: bbName,
      category: bbCat,
      buyPrice: parseInt(bbPrice),
      quantity: parseInt(bbQty),
      source: bbSource,
      link: '',
      expStatus: 'Aman',
      statusAcc: bbSource === 'Kas' ? 'Menunggu' : 'Disetujui'
    });
    setBbName(''); setBbPrice(''); setBbQty('');
  };

  const handleAddMenu = (e: React.FormEvent) => {
     e.preventDefault();
     if(!menuName || !menuPrice || !menuStock) return;
     addMenu({
       name: menuName,
       sellPrice: parseInt(menuPrice),
       stock: parseInt(menuStock)
     });
     setMenuName(''); setMenuPrice(''); setMenuStock('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white">
          <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-green)]">Dapur & Pengadaan</span>
              <h1 className="text-2xl font-black mt-1">Dashboard Tim Konsumsi</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Sistem pencatatan belanja bahan baku dan manajemen stok produk yang dijual di stan.</p>
          </div>
      </div>

      {/* Tabel 1: Bahan Baku */}
      <Card className="bg-card rounded-2xl border-subtle overflow-hidden">
        <CardHeader className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 border-b border-subtle">
           <CardTitle className="flex items-center gap-2 font-bold text-lg"><ShoppingBasket className="w-5 h-5 text-[var(--primary-green)]" /> Tabel Belanja Pengadaan Bahan</CardTitle>
           <p className="text-xs text-muted mt-1">Sumber "Kas" akan otomatis diajukan ke Tim Bendahara untuk dimintakan Approval pencairan dana.</p>
        </CardHeader>
        <CardContent className="pt-6">
           <form onSubmit={handleAddBahanBaku} className="grid sm:grid-cols-6 gap-3 mb-8 bg-surface p-4 rounded-xl border border-subtle border-l-[3px] border-l-[var(--primary-green)] items-end">
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Nama Barang</Label>
                <Input value={bbName} onChange={e => setBbName(e.target.value)} placeholder="Contoh: Ayam Fillet 1kg" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Kategori</Label>
                <select className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-1 text-sm outline-none" value={bbCat} onChange={e => setBbCat(e.target.value as any)}>
                   <option value="Bahan Baku">Item Konsumsi</option>
                   <option value="Pengemas">Pengemasan / Alat</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Harga Satuan</Label>
                <Input type="number" value={bbPrice} onChange={e => setBbPrice(e.target.value)} placeholder="0" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Qty (Jml)</Label>
                <Input type="number" value={bbQty} onChange={e => setBbQty(e.target.value)} placeholder="0" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Sumber Dana</Label>
                <select className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-1 text-sm outline-none" value={bbSource} onChange={e => setBbSource(e.target.value as any)}>
                   <option value="Kas">Modal Kas</option>
                   <option value="Sponsor">Sponsor</option>
                   <option value="Iuran">Iuran Anggota</option>
                </select>
              </div>
              <div className="sm:col-span-6 flex justify-end mt-2">
                <Button type="submit" className="h-10 text-xs px-6 font-bold bg-[var(--color-charcoal-900)] text-white hover:bg-[var(--primary-green)] hover:text-black hover:border-black transition-colors rounded-xl shadow-lg group"><Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90"/> Tambah Data Belanja</Button>
              </div>
           </form>

           <div className="overflow-x-auto rounded-xl border border-subtle">
             <table className="w-full text-sm text-left whitespace-nowrap">
               <thead className="text-[10px] text-muted uppercase bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)] font-bold tracking-wider">
                 <tr>
                   <th className="px-4 py-3">Nama/Jenis Item</th>
                   <th className="px-4 py-3">Kat</th>
                   <th className="px-4 py-3 text-right">Harga (/pcs)</th>
                   <th className="px-4 py-3 text-center">Jml</th>
                   <th className="px-4 py-3 text-right">Total Biaya</th>
                   <th className="px-4 py-3 text-center">Sumber</th>
                   <th className="px-4 py-3 text-center">Approve Bendahara</th>
                   <th className="px-4 py-3 text-right">Hapus</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-subtle">
                  {bahanBaku.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-xs text-muted font-bold">Tidak ada data pembelanjaan bahan baku.</td></tr>
                  ) : bahanBaku.map(item => (
                    <tr key={item.id} className="hover:bg-[var(--color-charcoal-50)] dark:hover:bg-[var(--color-charcoal-950)] transition-colors">
                      <td className="px-4 py-3 font-bold text-main">{item.name}</td>
                      <td className="px-4 py-3 text-xs">{item.category}</td>
                      <td className="px-4 py-3 text-right text-xs">{formatIDR(item.buyPrice)}</td>
                      <td className="px-4 py-3 text-center font-black">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-black text-[var(--profit)] bg-[var(--profit)]/5">{formatIDR(item.totalPrice)}</td>
                      <td className="px-4 py-3 text-center text-xs"><span className="bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full">{item.source}</span></td>
                      <td className="px-4 py-3 text-center">
                         {item.source !== 'Kas' ? <span className="text-xs text-muted">-</span> : <Badge variant={item.statusAcc === 'Disetujui' ? 'success' : item.statusAcc === 'Ditolak' ? 'destructive' : 'warning'} className="text-[10px] px-2 font-bold">{item.statusAcc}</Badge>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {deleteConfirmId === item.id ? (
                            <div className="flex items-center justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)} className="h-6 px-2 text-[9px] font-bold">Batal</Button>
                                <Button size="sm" onClick={() => { deleteBahanBaku(item.id); setDeleteConfirmId(null); }} className="h-6 px-2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold">Hapus</Button>
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

      {/* Tabel 2: Produk Jadi (Menu) */}
      <Card className="bg-card rounded-2xl border-subtle overflow-hidden">
        <CardHeader className="bg-[var(--primary-green)]/10 border-b border-subtle">
          <CardTitle className="text-lg font-bold flex items-center gap-2"><Soup className="w-5 h-5 text-[var(--primary-green)]" /> Update Ketersediaan Menu & Stok Stan</CardTitle>
          <p className="text-xs text-muted mt-1">Input data ini untuk mengaktifkan Tombol Pembelian di Dashboard Kasir dan Tim Keliling.</p>
        </CardHeader>
        <CardContent className="pt-6">
           <form onSubmit={handleAddMenu} className="grid sm:grid-cols-4 gap-3 mb-8 bg-surface p-4 rounded-xl border border-subtle items-end">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Nama Menu Siap Jual</Label>
                <Input value={menuName} onChange={e => setMenuName(e.target.value)} placeholder="Contoh: Rice Bowl Ayam Spicy" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10 text-lg font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Harga Jual Per Porsi</Label>
                <Input type="number" value={menuPrice} onChange={e => setMenuPrice(e.target.value)} placeholder="0" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10 font-bold" />
              </div>
              <div className="flex gap-2 items-end">
                 <div className="space-y-1 flex-1">
                   <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Stok Awal</Label>
                   <Input type="number" value={menuStock} onChange={e => setMenuStock(e.target.value)} placeholder="0" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-10 font-black text-blue-500" />
                 </div>
                 <Button type="submit" variant="neon" size="icon" className="h-10 w-10 shrink-0 rounded-xl"><Plus className="h-5 w-5 font-black text-black"/></Button>
              </div>
           </form>

           <div className="overflow-x-auto rounded-xl border border-subtle">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-muted uppercase bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)] font-bold tracking-wider">
                 <tr>
                   <th className="px-6 py-4">Produk Stand</th>
                   <th className="px-6 py-4 text-right">Harga Jual Ke Pembeli</th>
                   <th className="px-6 py-4 text-center">Status Stok Stan</th>
                   <th className="px-6 py-4 text-right">Hapus Menu</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-subtle">
                  {menuProduk.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-10 text-xs text-muted font-bold border border-dashed border-subtle m-4">Belum ada menu yang didaftarkan ke kasir.</td></tr>
                  ) : menuProduk.map(item => (
                    <tr key={item.id} className="hover:bg-[var(--color-charcoal-50)] dark:hover:bg-[var(--color-charcoal-950)] transition-colors">
                      <td className="px-6 py-4 font-black text-xl text-main">{item.name}</td>
                      <td className="px-6 py-4 text-right font-black text-xl text-[var(--profit)]">{formatIDR(item.sellPrice)}</td>
                      <td className="px-6 py-4 text-center">
                         <div className={`inline-flex items-center justify-center min-w-16 h-10 px-4 rounded-full font-black text-xl ${item.stock <= 5 ? (item.stock === 0 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white') : 'bg-[var(--primary-green)] text-black'}`}>
                           {item.stock} {item.stock === 0 ? 'Habis' : 'Pcs'}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {deleteConfirmMenuId === item.id ? (
                            <div className="flex items-center justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmMenuId(null)} className="h-8 px-3 text-[10px] font-bold">Batal</Button>
                                <Button size="sm" onClick={() => { deleteMenu(item.id); setDeleteConfirmMenuId(null); }} className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold">Hapus</Button>
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmMenuId(item.id)} className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-500/10">
                              <Trash2 className="h-5 w-5" />
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
