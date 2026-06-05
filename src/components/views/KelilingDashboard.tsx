import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '../ui';
import { useStore } from '../../store';
import { formatIDR } from '../../lib/utils';
import { Truck } from 'lucide-react';
import { motion } from 'motion/react';

export default function KelilingDashboard() {
  const { menuProduk, addTransaksi, profiles } = useStore();
  const profile = profiles['Keliling'];

  const [sellerName, setSellerName] = useState(profile.members[0]?.name || profile.leader || '');
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [qty, setQty] = useState(1);

  const selectedMenu = menuProduk.find(m => m.id === selectedMenuId);
  const totalHarga = selectedMenu ? selectedMenu.sellPrice * qty : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu || qty <= 0 || !sellerName) return;
    
    // Validasi stok
    if (selectedMenu.stock < qty) {
      alert('Stok tidak mencukupi di stand utama!');
      return;
    }

    addTransaksi({
        buyerName: 'Pembeli Keliling',
        category: 'Umum',
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        qty: qty,
        unitPrice: selectedMenu.sellPrice,
        totalPrice: totalHarga,
        method: 'Tunai', // Keliling usually uses Tunai
        sellerRole: 'Keliling',
        sellerName: sellerName,
    });

    setQty(1);
    setSelectedMenuId('');
    alert('Penjualan keliling berhasil dicatat!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white">
          <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-green)]">Operasional Lapangan</span>
              <h1 className="text-2xl font-black mt-1">Mobile Sales (Tim Keliling)</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Sistem pencatatan penjualan keliling yang terintegrasi langsung dengan stok stan utama.</p>
          </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-subtle rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold">
              <Truck className="h-5 w-5 text-blue-500" /> Form Handover Penjualan Keliling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Nama Petugas Keliling</Label>
                <select 
                     className="flex h-11 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--primary-green)] transition-colors"
                     value={sellerName} onChange={(e) => setSellerName(e.target.value)} required
                >
                    <option value="" disabled>-- Pilih Nama Petugas --</option>
                    <option value={profile.leader}>{profile.leader} (Ketua Keliling)</option>
                    {profile.members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Produk Terjual (Ambil dari Stan)</Label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--primary-green)] transition-colors"
                  value={selectedMenuId} onChange={(e) => { setSelectedMenuId(e.target.value); setQty(1); }}
                  required
                >
                  <option value="" disabled>-- Klik untuk memilih produk --</option>
                  {menuProduk.map(m => (
                    <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                      {m.name} - {formatIDR(m.sellPrice)} (Stok Stan: {m.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Jumlah Terjual Keliling (Pcs)</Label>
                <Input type="number" min="1" max={selectedMenu?.stock || 999} value={qty} onChange={e => setQty(parseInt(e.target.value) || 1)} required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] h-11 border-subtle" />
              </div>

              <div className="mt-6 pt-4 border-t border-subtle flex flex-col gap-4">
                 <div className="flex justify-between items-center bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-800)]/40 p-3 rounded-xl border border-subtle text-right">
                    <span className="text-[10px] uppercase font-bold text-muted text-left">Cash Diterima:</span>
                    <span className="text-2xl font-black text-main">{formatIDR(totalHarga)}</span>
                 </div>
                 <Button type="submit" variant="neon" className="w-full h-12 uppercase font-bold tracking-wider text-sm bg-blue-600 border-none text-white hover:bg-blue-700 hover:text-white" disabled={!selectedMenuId || (selectedMenu?.stock || 0) < qty}>
                   Setor Data Penjualan Keliling
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

