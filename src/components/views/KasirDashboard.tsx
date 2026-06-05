import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '../ui';
import { useStore } from '../../store';
import { formatIDR, getNowFormatted } from '../../lib/utils';
import { ShoppingBag, AlertTriangle, MonitorSmartphone, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function KasirDashboard() {
  const { menuProduk, addTransaksi, profiles, transaksi } = useStore();
  const kasirProfile = profiles['Kasir'];

  const [buyerName, setBuyerName] = useState('');
  const [buyerCategory, setBuyerCategory] = useState<'Siswa' | 'Guru' | 'Umum'>('Siswa');
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS'>('Tunai');

  const selectedMenu = menuProduk.find(m => m.id === selectedMenuId);
  const totalHarga = selectedMenu ? selectedMenu.sellPrice * qty : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu || qty <= 0) return;
    
    // Validasi stok
    if (selectedMenu.stock < qty) {
      alert('Stok tidak mencukupi!');
      return;
    }

    addTransaksi({
        buyerName: buyerName || 'Anonim',
        category: buyerCategory,
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        qty: qty,
        unitPrice: selectedMenu.sellPrice,
        totalPrice: totalHarga,
        method: paymentMethod,
        sellerRole: 'Kasir',
        sellerName: kasirProfile.members[0]?.name || kasirProfile.leader || 'Kasir',
    });

    // Reset Form
    setBuyerName('');
    setQty(1);
  };

  const kasirTransactions = transaksi.filter(t => t.sellerRole === 'Kasir');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Checkout Form */}
      <Card className="lg:col-span-2 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold">
            <MonitorSmartphone className="h-5 w-5 text-[var(--primary-green)]" /> Point of Sale (POS) Stand Makan/Minum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Nama Pembeli</Label>
                 <Input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Contoh: Dimas Aditya" className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle" />
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Kategori Pembeli</Label>
                 <select 
                   className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--primary-green)] transition-colors"
                   value={buyerCategory} onChange={(e) => setBuyerCategory(e.target.value as any)}
                 >
                   <option value="Siswa">Siswa Kelas Lain</option>
                   <option value="Guru">Guru / Staff</option>
                   <option value="Umum">Umum / Tamu</option>
                 </select>
               </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
               <div className="space-y-2 md:col-span-2">
                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Pilih Menu</Label>
                 <select 
                   className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--primary-green)] transition-colors"
                   value={selectedMenuId} onChange={(e) => { setSelectedMenuId(e.target.value); setQty(1); }}
                   required
                 >
                   <option value="" disabled>-- Klik untuk memilih Hidangan --</option>
                   {menuProduk.map(m => (
                     <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                       {m.name} - {formatIDR(m.sellPrice)} (Stok: {m.stock})
                     </option>
                   ))}
                 </select>
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Jumlah Porsi (Qty)</Label>
                 <Input type="number" min="1" max={selectedMenu?.stock || 999} value={qty} onChange={e => setQty(parseInt(e.target.value) || 1)} required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] h-10 border-subtle" />
               </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
               <div className="space-y-2">
                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Metode Pembayaran</Label>
                 <select 
                     className="flex h-10 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--primary-green)] transition-colors"
                     value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}
                 >
                     <option value="Tunai">Tunai / Cash</option>
                     <option value="QRIS">QRIS / E-Wallet</option>
                 </select>
               </div>
               <div className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border border-subtle p-3 rounded-xl flex flex-col justify-center text-right">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Pembayaran</span>
                  <span className="text-xl font-black text-[var(--profit)] leading-none mt-1">
                    {formatIDR(totalHarga)}
                  </span>
               </div>
            </div>

            <Button type="submit" variant="neon" className="w-full h-12 text-sm uppercase font-bold tracking-wider mt-4 shadow-lg group relative overflow-hidden bg-[var(--color-charcoal-900)] text-white hover:bg-[var(--primary-green)] hover:text-black hover:border-black transition-colors" disabled={!selectedMenuId || (selectedMenu?.stock || 0) < qty}>
               Proses Transaksi Penjualan <MonitorSmartphone className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Stock Indicator & Transactions */}
      <div className="space-y-6">
          <Card className="bg-card rounded-2xl border-subtle shadow-sm overflow-hidden">
             {/* Border red gradient if critical */}
             <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-500"></div>
             <CardContent className="p-5 space-y-3">
                 <h4 className="font-bold text-sm text-red-500 flex items-center gap-2">
                     <AlertTriangle className="animate-bounce w-4 h-4" /> Peringatan Stok Kritis (&lt; 5 Pcs)
                 </h4>
                 <div className="space-y-2">
                     {menuProduk.filter(m => m.stock < 5 && m.stock > 0).length === 0 && menuProduk.filter(m => m.stock === 0).length === 0 ? (
                         <p className="text-xs text-[var(--primary-green)] font-bold bg-[var(--primary-green)]/10 p-3 rounded-xl border border-[var(--primary-green)]/20">Semua stok produk aman dan mencukupi.</p>
                     ) : (
                       <>
                         {menuProduk.filter(m => m.stock < 5 && m.stock > 0).map(m => (
                             <div key={m.id} className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex justify-between items-center text-xs">
                                 <span className="font-bold">{m.name}</span>
                                 <span className="font-black animate-pulse">Sisa {m.stock}</span>
                             </div>
                         ))}
                         {menuProduk.filter(m => m.stock === 0).map(m => (
                             <div key={m.id} className="p-3 bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-500 rounded-xl flex justify-between items-center text-xs opacity-75">
                                 <span className="font-bold line-through">{m.name}</span>
                                 <span className="font-black">HABIS</span>
                             </div>
                         ))}
                       </>
                     )}
                 </div>
             </CardContent>
          </Card>

          <Card className="bg-card rounded-2xl border-subtle shadow-sm">
             <CardContent className="p-5 space-y-3">
                 <h4 className="font-bold text-sm text-main flex items-center gap-2 uppercase tracking-wide text-xs">
                     <Clock className="w-4 h-4 text-muted" /> Transaksi Terakhir Anda
                 </h4>
                 <div className="space-y-2 max-h-[180px] overflow-y-auto">
                     {kasirTransactions.length === 0 ? (
                         <p className="text-xs text-muted text-center py-4 border border-dashed border-subtle rounded-xl">Belum ada transaksi</p>
                     ) : kasirTransactions.slice().reverse().map(tx => (
                         <div key={tx.id} className="p-3 bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)] rounded-xl flex justify-between items-center text-xs border border-subtle/50 hover:border-subtle transition-colors">
                             <div>
                                 <p className="font-bold text-main">{tx.menuName}</p>
                                 <p className="text-[10px] text-muted font-bold tracking-wider mt-0.5">{tx.buyerName} &bull; {tx.qty} Pcs</p>
                             </div>
                             <p className="font-black text-[var(--profit)]">+{formatIDR(tx.totalPrice)}</p>
                         </div>
                     ))}
                 </div>
             </CardContent>
          </Card>
      </div>
    </div>
  );
}
