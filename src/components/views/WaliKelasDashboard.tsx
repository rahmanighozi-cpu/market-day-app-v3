import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '../ui';
import { useStore } from '../../store';
import { formatIDR } from '../../lib/utils';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Brush, Boxes, LayoutList, ExternalLink, Activity } from 'lucide-react';

export function FinancialSummaryCards() {
  const { modalAwal, bahanBaku, peralatan, transaksi, pettyCash } = useStore();

  const metrics = useMemo(() => {
    // Total Pengeluaran = Sum of approved Bahan Baku + Sewa Peralatan + Petty Cash
    const expenseKonsumsi = bahanBaku.filter(b => b.statusAcc === 'Disetujui').reduce((acc, curr) => acc + curr.totalPrice, 0);
    const expenseLogistik = peralatan.filter(p => p.source === 'Sewa' && p.statusAcc === 'Disetujui').reduce((acc, curr) => acc + curr.price, 0);
    const expenseLainnya = pettyCash.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPengeluaran = expenseKonsumsi + expenseLogistik + expenseLainnya;

    const totalPendapatan = transaksi.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const netProfit = totalPendapatan - totalPengeluaran;
    const roi = totalPengeluaran === 0 ? 0 : (netProfit / totalPengeluaran) * 100;

    return { totalPengeluaran, totalPendapatan, netProfit, roi, expenseKonsumsi, expenseLogistik, expenseLainnya };
  }, [bahanBaku, peralatan, transaksi, pettyCash]);

  const isProfit = metrics.netProfit >= 0;

  const chartData = [
    { name: 'Belanja Konsumsi', value: metrics.expenseKonsumsi },
    { name: 'Sewa Logistik', value: metrics.expenseLogistik },
    { name: 'Kas Kecil', value: metrics.expenseLainnya },
  ];

  const cashFlowData = [
    { name: 'Arus Masuk', amount: metrics.totalPendapatan, fill: 'var(--profit)' },
    { name: 'Arus Keluar', amount: metrics.totalPengeluaran, fill: '#ef4444' }, // red-500
  ];

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* TOTAL MODAL */}
            <div className="bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-900)] border border-subtle p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Modal Awal Stan</span>
                    <span className="p-1 px-2 leading-none flex items-center bg-[var(--primary-green)]/10 text-[var(--primary-green-hover)] dark:text-[var(--primary-green)] rounded-lg text-xs font-bold">Target</span>
                </div>
                <div className="mt-2">
                    <h3 className="text-2xl font-extrabold">{formatIDR(modalAwal)}</h3>
                    <p className="text-[10px] text-muted mt-1 font-semibold uppercase tracking-wider">Ditetapkan oleh Bendahara</p>
                </div>
            </div>

            {/* TOTAL PENGELUARAN */}
            <div className="bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-900)] border border-subtle p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Kas Keluar</span>
                    <span className="p-1 px-2 leading-none flex items-center bg-red-500/10 text-red-500 rounded-lg text-xs font-bold">Expense</span>
                </div>
                <div className="mt-2">
                    <h3 className="text-2xl font-extrabold text-red-500">{formatIDR(metrics.totalPengeluaran)}</h3>
                    <p className="text-[10px] text-muted mt-1 font-semibold uppercase tracking-wider">Belanja Bahan, Alat & Kas Kecil</p>
                </div>
            </div>

            {/* TOTAL PENDAPATAN */}
            <div className="bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-900)] border border-subtle p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Kas Masuk</span>
                    <span className="p-1 px-2 leading-none flex items-center bg-green-500/10 text-green-500 rounded-lg text-xs font-bold">Revenue</span>
                </div>
                <div className="mt-2">
                    <h3 className="text-2xl font-extrabold text-[var(--profit)]">{formatIDR(metrics.totalPendapatan)}</h3>
                    <p className="text-[10px] text-muted mt-1 font-semibold uppercase tracking-wider">Hasil Penjualan Kasir</p>
                </div>
            </div>

            {/* NET PROFIT */}
            <div className={`bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-900)] border border-subtle p-5 rounded-2xl flex flex-col justify-between shadow-sm ${isProfit ? 'border-b-4 border-b-green-500' : 'border-b-4 border-b-red-500'}`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Laba Bersih</span>
                    <span className={`p-1 px-2 leading-none flex items-center rounded-lg text-[10px] font-bold tracking-widest ${isProfit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        ROI {metrics.roi.toFixed(1)}%
                    </span>
                </div>
                <div className="mt-2">
                    <h3 className={`text-2xl font-extrabold flex items-center gap-2 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                        {isProfit ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>} {formatIDR(metrics.netProfit)}
                    </h3>
                    <p className="text-[10px] text-muted mt-1 font-semibold uppercase tracking-wider">Mencerminkan Arus Kas Riil</p>
                </div>
            </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col">
                 <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                     <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><Activity className="w-4 h-4 text-orange-500"/> Alokasi Pengeluaran Kas</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 flex-1 min-h-[250px]">
                     <ResponsiveContainer width="100%" height={250}>
                         <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="var(--color-charcoal-700)" vertical={false} />
                             <XAxis dataKey="name" tick={{fontSize: 10, fill: 'var(--color-charcoal-400)'}} axisLine={false} tickLine={false} />
                             <YAxis tick={{fontSize: 10, fill: 'var(--color-charcoal-400)'}} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000}k`} />
                             <Tooltip 
                                cursor={{fill: 'var(--color-charcoal-800)'}} 
                                contentStyle={{backgroundColor: 'var(--color-charcoal-900)', border: '1px solid var(--color-charcoal-700)', borderRadius: '8px'}}
                                formatter={(value: number) => formatIDR(value)}
                             />
                             <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#eab308', '#3b82f6', '#ec4899'][index % 3]} />
                                 ))}
                             </Bar>
                         </BarChart>
                     </ResponsiveContainer>
                 </CardContent>
             </Card>

             <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col">
                 <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
                     <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><Activity className="w-4 h-4 text-[var(--primary-green)]"/> Perbandingan Kas</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 flex-1 min-h-[250px]">
                     <ResponsiveContainer width="100%" height={250}>
                         <BarChart data={cashFlowData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="var(--color-charcoal-700)" horizontal={true} vertical={false} />
                             <XAxis type="number" tick={{fontSize: 10, fill: 'var(--color-charcoal-400)'}} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000}k`} />
                             <YAxis type="category" dataKey="name" tick={{fontSize: 10, fill: 'var(--color-charcoal-400)', fontWeight: 'bold'}} axisLine={false} tickLine={false} width={80} />
                             <Tooltip 
                                cursor={{fill: 'var(--color-charcoal-800)'}} 
                                contentStyle={{backgroundColor: 'var(--color-charcoal-900)', border: '1px solid var(--color-charcoal-700)', borderRadius: '8px'}}
                                formatter={(value: number) => formatIDR(value)}
                             />
                             <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={30}>
                                {cashFlowData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                 ))}
                             </Bar>
                         </BarChart>
                     </ResponsiveContainer>
                 </CardContent>
             </Card>
        </div>
    </div>
  )
}

export default function WaliKelasDashboard() {
  const { waliKelasName, desain, updateDesainStatus, peralatan, penampilan, menuProduk, transaksi } = useStore();

  const [promptOpen, setPromptOpen] = useState(false);
  const [activeDecision, setActiveDecision] = useState<{id: string, decision: 'Disetujui' | 'Perlu Revisi'} | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleDecisionClick = (id: string, decision: 'Disetujui' | 'Perlu Revisi', defaultMsg: string) => {
      setActiveDecision({id, decision});
      setFeedbackMsg(defaultMsg);
      setPromptOpen(true);
  };

  const confirmDecision = () => {
      if(activeDecision) {
          updateDesainStatus(activeDecision.id, activeDecision.decision, feedbackMsg);
      }
      setPromptOpen(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-[var(--primary-green)] to-[#adeb8f] dark:from-[var(--color-charcoal-900)] dark:to-[var(--color-charcoal-800)] p-6 rounded-2xl border border-[var(--color-charcoal-200)] dark:border-[var(--color-charcoal-700)] flex flex-col md:flex-row md:items-center justify-between text-[var(--color-charcoal-950)] dark:text-white shadow-sm">
          <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--primary-green-dark)] dark:text-[var(--primary-green)]">Monitor Eksekutif</span>
              <h1 className="text-3xl font-extrabold mt-1 tracking-tight">Dashboard Wali Kelas</h1>
              <p className="text-xs font-semibold opacity-85 mt-1 border-l-2 border-[var(--primary-green)] pl-2">Laporan Status Keuangan & Kemajuan Operasional Stan</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right bg-white dark:bg-black/20 p-4 rounded-xl border border-[var(--color-charcoal-200)] dark:border-subtle">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-charcoal-600)] dark:text-muted">Akses Super Admin</p>
              <p className="font-extrabold text-xl text-[var(--color-charcoal-900)] dark:text-[var(--primary-green)]">{waliKelasName || 'Belum Inisialisasi'}</p>
          </div>
      </div>

      {/* Metrics Row */}
      <FinancialSummaryCards />

      <div className="grid gap-6 lg:grid-cols-3 pt-4">

        {/* Monitor Desain Promosi */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col">
          <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
             <CardTitle className="flex items-center gap-2 font-bold text-lg"><Brush className="w-5 h-5 text-blue-500" /> Review Aset Desain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 flex-1">
             {desain.length === 0 ? (
                 <p className="text-[10px] font-bold tracking-wider uppercase text-muted text-center py-10 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Belum ada karya desain.</p>
             ) : desain.map(d => (
                 <div key={d.id} className="p-4 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] rounded-xl border border-subtle hover:border-blue-500/30 transition-colors">
                     <div className="pb-3 border-b border-subtle">
                        <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Judul Desain / Promosi</p>
                        <h4 className="font-bold text-main leading-tight">{d.title}</h4>
                     </div>
                     <div className="py-3 border-b border-subtle flex flex-col gap-2">
                        <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Tautan Media (Google Drive / Canva)</p>
                        <a href={d.link} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg flex items-center justify-between gap-1 hover:bg-blue-500/20 transition-colors w-full border border-blue-500/20 truncate">
                            Buka Tautan File <ExternalLink className="w-3 h-3 flex-shrink-0"/>
                        </a>
                     </div>
                     <div className="pt-3">
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Status Validasi</p>
                           <Badge variant={d.status === 'Disetujui' ? 'success' : d.status === 'Perlu Revisi' ? 'warning' : 'default'} className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5">{d.status}</Badge>
                        </div>
                        {d.feedback && (
                            <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 mt-3">
                               <p className="text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mb-1">Feedback Wali Kelas:</p>
                               <p className="text-[11px] font-medium text-main">"{d.feedback}"</p>
                            </div>
                        )}
                     </div>
                     {d.status === 'Menunggu Review' && (
                         <div className="grid grid-cols-2 gap-3 pt-4">
                             <Button size="sm" variant="outline" className="h-10 text-[10px] font-bold uppercase tracking-wider bg-green-600/10 text-green-600 border-green-600/30 hover:bg-green-600 hover:text-white" onClick={() => handleDecisionClick(d.id, 'Disetujui', 'Bagus sekali, silakan dicetak/diposting.')}>
                                Setujui
                             </Button>
                             <Button size="sm" variant="outline" className="h-10 text-[10px] font-bold uppercase tracking-wider bg-red-600/10 text-red-600 border-red-600/30 hover:bg-red-600 hover:text-white" onClick={() => handleDecisionClick(d.id, 'Perlu Revisi', 'Tolong perbaiki konten desainnya.')}>
                                Revisi
                             </Button>
                         </div>
                     )}
                 </div>
             ))}
          </CardContent>
        </Card>

        {/* Kesiapan Logistik & Acara */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col">
          <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
             <CardTitle className="flex items-center gap-2 font-bold text-lg"><Boxes className="w-5 h-5 text-orange-500" /> Status Logistik & Acara</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 flex-1">
             {/* Logistik */}
             <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Kesiapan Alat di Stand</span>
                    <span className="text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md text-[11px]">
                        {peralatan.filter(l => l.status === 'Di Stand' || l.status === 'Sudah Dikembalikan').length} / {peralatan.length || 1} Unit
                    </span>
                </div>
                <div className="w-full bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] h-3 rounded-full overflow-hidden border border-subtle">
                    <div 
                        className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(peralatan.filter(l => l.status === 'Di Stand' || l.status === 'Sudah Dikembalikan').length / (peralatan.length || 1)) * 100}%` }}
                    ></div>
                </div>
             </div>

             {/* Penampilan Acara */}
             <div className="p-4 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] rounded-xl space-y-3 border border-subtle">
                 <div className="flex justify-between items-center border-b border-subtle pb-2">
                     <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Durasi Performance</span>
                     <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">{penampilan.duration || '0'} Menit</span>
                 </div>
                 <div className="max-h-32 overflow-y-auto">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Snippet Naskah:</p>
                    <p className="text-[11px] font-medium text-main leading-relaxed">"{penampilan.naskah ? (penampilan.naskah.substring(0, 200) + (penampilan.naskah.length > 200 ? '...' : '')) : 'Belum ada naskah yang disusun.'}"</p>
                 </div>
             </div>

             {/* Produk Terlaris Overview */}
             <div className="space-y-3 pt-2">
                 <p className="text-[10px] font-bold uppercase text-muted tracking-wider pb-2 border-b border-subtle">Ketersediaan Stok Menu (Top 5)</p>
                 {menuProduk.length === 0 ? <p className="text-[10px] font-bold uppercase tracking-wider text-muted text-center py-6 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Daftar menu kosong.</p> : menuProduk.slice(0,5).map(item => (
                     <div key={item.id} className="flex justify-between items-center text-xs bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-3 rounded-xl border border-subtle">
                         <span className="font-bold text-main">{item.name}</span>
                         <span className={`font-black px-2 py-1 flex items-center gap-1 rounded-md text-[9px] uppercase tracking-wider ${item.stock < 5 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[var(--primary-green)]/10 text-[var(--primary-green-dark)] dark:text-[var(--primary-green)] border border-[var(--primary-green)]/30'}`}>
                             Sisa Stok : {item.stock}
                         </span>
                     </div>
                 ))}
             </div>
          </CardContent>
        </Card>

        {/* Transaksi POS */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm flex flex-col">
          <CardHeader className="border-b border-subtle bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 pb-4">
             <CardTitle className="flex items-center gap-2 font-bold text-lg"><LayoutList className="w-5 h-5 text-[var(--profit)]" /> Live Transaksi (POS)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6 flex-1 max-h-[600px] overflow-y-auto pr-2">
             {transaksi.length === 0 ? (
                 <p className="text-[10px] font-bold text-muted uppercase tracking-wider text-center py-10 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Bazar belum dimulai.</p>
             ) : transaksi.slice().reverse().map(tx => (
                 <div key={tx.id} className="p-4 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] rounded-xl flex justify-between items-center border border-subtle hover:border-[var(--primary-green)]/30 transition-colors">
                     <div>
                         <p className="text-[13px] font-bold text-main truncate max-w-[130px]">{tx.menuName} <span className="text-[11px] text-muted font-normal">(x{tx.qty})</span></p>
                         <p className="text-[9px] font-black text-muted mt-1.5 uppercase tracking-wider">Oleh: {tx.buyerName.substring(0,8)} | {formatTimeStr(tx.time)}</p>
                     </div>
                     <div className="text-right flex flex-col items-end">
                         <p className="text-sm font-black text-[var(--profit)]">+{formatIDR(tx.totalPrice)}</p>
                         <Badge variant="outline" className="mt-2 text-[9px] px-2 py-0.5 border-[var(--primary-green)]/30 text-[var(--primary-green-dark)] dark:text-[var(--primary-green)] bg-[var(--primary-green)]/10 font-bold uppercase tracking-wider">{tx.method}</Badge>
                     </div>
                 </div>
             ))}
          </CardContent>
        </Card>
      </div>

      {/* Modern Prompt Modal for Decision */}
      {promptOpen && activeDecision && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-200">
             <Card className="w-full max-w-md bg-[var(--color-charcoal-900)] border-[var(--primary-green)]/50 shadow-xl rounded-2xl overflow-hidden scale-in-95 duration-200">
                 <CardHeader className="bg-[var(--color-charcoal-800)]/50 border-b border-subtle pb-4">
                     <CardTitle className={`font-black tracking-wide text-lg flex gap-2 items-center ${activeDecision.decision === 'Disetujui' ? 'text-green-500' : 'text-red-500'}`}>
                        {activeDecision.decision === 'Disetujui' ? 'Setujui Desain' : 'Ajukan Revisi Desain'}
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                     <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-wider text-white block mb-1">Catatan Tambahan (Opsional):</label>
                         <Input 
                            value={feedbackMsg} 
                            onChange={e => setFeedbackMsg(e.target.value)} 
                            className="bg-[var(--color-charcoal-950)] border-subtle h-12 text-sm text-white focus:border-[var(--primary-green)]/50" 
                            autoFocus
                         />
                     </div>
                     <div className="flex gap-3 pt-6">
                         <Button variant="outline" className="flex-1 h-12 font-bold uppercase tracking-wider text-xs border-subtle text-muted hover:text-white" onClick={() => setPromptOpen(false)}>Batal</Button>
                         <Button 
                            variant="neon" 
                            className={`flex-1 h-12 font-bold uppercase tracking-wider text-[10px] border-none text-white ${activeDecision.decision === 'Disetujui' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            onClick={confirmDecision}
                         >
                            Kirim Keputusan
                         </Button>
                     </div>
                 </CardContent>
             </Card>
         </div>
      )}
    </div>
  );
}

function formatTimeStr(isoStr: string) {
    if(!isoStr) return '';
    try {
        const d = new Date(isoStr);
        return d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB';
    } catch {
        return '';
    }
}
