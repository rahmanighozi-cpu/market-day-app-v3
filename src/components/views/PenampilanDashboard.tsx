import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '../ui';
import { useStore } from '../../store';
import { Send, CheckCircle, Music, Mic2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, FileText, Check, Save } from 'lucide-react';

export default function PenampilanDashboard() {
  const { penampilan, setPenampilan, requestProperti, addRequestProperti } = useStore();
  
  const [localNaskah, setLocalNaskah] = useState(penampilan.naskah);
  const [localDurasi, setLocalDurasi] = useState(penampilan.duration.toString());
  const [isSaved, setIsSaved] = useState(true);

  // Property Request Form
  const [propName, setPropName] = useState('');
  const [propQty, setPropQty] = useState('');

  const handleUpdatePenampilan = () => {
    setPenampilan({ 
        ...penampilan, 
        naskah: localNaskah, 
        duration: parseInt(localDurasi) || 0 
    });
    setIsSaved(true);
    setTimeout(() => alert('Dokumen naskah dan durasi berhasil disimpan.'), 100);
  };

  const handlePushRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if(!propName || !propQty) return;
    addRequestProperti({ name: propName, qty: parseInt(propQty), status: 'Diminta' });
    setPropName('');
    setPropQty('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
     setLocalNaskah(e.target.value);
     setIsSaved(false);
  };
  
  const handleDurasiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setLocalDurasi(e.target.value);
     setIsSaved(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-gradient-to-r from-[var(--color-charcoal-800)] to-[var(--color-charcoal-900)] border border-[var(--color-charcoal-700)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white shadow-sm">
          <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-green)]">Hiburan & Susunan Acara</span>
              <h1 className="text-2xl font-black mt-1 tracking-tight">Dashboard Tim Penampilan</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1 font-medium border-l-2 border-[var(--primary-green)] pl-2">Kelola skenario, alokasi waktu Tampil, dan ajukan properti panggung.</p>
          </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Document Editor Layout */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm lg:col-span-3 flex flex-col min-h-[600px] overflow-hidden">
            {/* Editor Toolbar Header */}
            <div className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-b border-subtle p-3 flex flex-col gap-3">
               <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <div className="bg-blue-500/10 p-2 rounded-lg"><FileText className="w-5 h-5 text-blue-500" /></div>
                       <div>
                          <Input 
                            value="Naskah_Pentas_Seni.txt" 
                            className="h-7 text-sm font-bold bg-transparent border-none p-0 focus-visible:ring-0 w-[200px] hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-900)] px-2 rounded-md transition-colors" 
                            readOnly 
                          />
                          <p className="text-[9px] text-muted font-bold uppercase tracking-wider px-2 flex items-center gap-1 mt-0.5">
                             {isSaved ? <><Check className="w-3 h-3 text-green-500" /> Tersimpan ke Cloud</> : 'Ada perubahan yang belum disimpan *'}
                          </p>
                       </div>
                   </div>
                   <Button variant="neon" size="sm" onClick={handleUpdatePenampilan} disabled={isSaved} className="h-9 px-4 text-[10px] font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white border-none shrink-0 rounded-lg flex items-center gap-2">
                       <Save className="w-4 h-4"/> Tetapkan
                   </Button>
               </div>
               
               {/* Formatting Tools (Visual only for feel) */}
               <div className="flex items-center gap-2 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-900)] border border-subtle rounded-lg p-1.5 overflow-x-auto">
                   <select className="h-7 rounded border-none bg-transparent text-xs font-bold w-28 appearance-none focus:outline-none focus:ring-0">
                       <option>Inter (Normal)</option>
                       <option>Arial</option>
                       <option>Times New Roman</option>
                   </select>
                   <div className="w-px h-4 bg-[var(--color-charcoal-300)] dark:bg-[var(--color-charcoal-700)] mx-1"></div>
                   <input type="number" defaultValue="12" className="h-7 w-12 rounded border-none bg-transparent text-xs font-bold text-center focus:outline-none focus:ring-0" />
                   <div className="w-px h-4 bg-[var(--color-charcoal-300)] dark:bg-[var(--color-charcoal-700)] mx-1"></div>
                   <button className="p-1.5 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] rounded transition-colors"><Bold className="w-3 h-3" /></button>
                   <button className="p-1.5 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] rounded transition-colors"><Italic className="w-3 h-3" /></button>
                   <button className="p-1.5 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] rounded transition-colors"><Underline className="w-3 h-3" /></button>
                   <div className="w-px h-4 bg-[var(--color-charcoal-300)] dark:bg-[var(--color-charcoal-700)] mx-1"></div>
                   <button className="p-1.5 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] rounded transition-colors"><AlignLeft className="w-3 h-3" /></button>
                   <button className="p-1.5 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] rounded transition-colors"><AlignCenter className="w-3 h-3" /></button>
                   <button className="p-1.5 hover:bg-[var(--color-charcoal-200)] dark:hover:bg-[var(--color-charcoal-800)] rounded transition-colors"><AlignRight className="w-3 h-3" /></button>
                   
                   <div className="ml-auto flex items-center gap-2 pr-2">
                       <Label className="text-[10px] font-bold uppercase tracking-wider text-muted whitespace-nowrap">Target Durasi (Mnt):</Label>
                       <Input type="number" value={localDurasi} onChange={handleDurasiChange} className="h-7 w-16 text-center font-black bg-white dark:bg-black border-subtle" />
                   </div>
               </div>
            </div>

            {/* Document Canvas */}
            <div className="flex-1 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-900)] p-4 md:p-8 overflow-y-auto flex justify-center">
                <textarea 
                    className="w-full max-w-2xl bg-white dark:bg-[#1e1e1e] border border-subtle shadow-lg resize-none outline-none font-medium text-main min-h-[600px] p-8 md:p-12 text-sm leading-8 rounded-sm document-shadow focus:border-blue-500/30 transition-colors"
                    placeholder="Judul Penampilan...&#10;&#10;[Tulis skenario panggung, narasi MC, atau urutan acara di sini layaknya menggunakan pengolah kata...]"
                    value={localNaskah}
                    onChange={handleTextChange}
                />
            </div>
        </Card>

        {/* Integration to Logistik */}
        <Card className="bg-card rounded-2xl border-subtle shadow-sm lg:col-span-2 flex flex-col">
          <CardHeader className="bg-orange-500/10 border-b border-orange-500/20 pb-4">
             <CardTitle className="flex items-center gap-2 font-bold text-lg text-orange-600 dark:text-orange-400"><Music className="w-5 h-5" /> Pengajuan Properti</CardTitle>
             <p className="text-[10px] uppercase font-bold text-orange-600/80 dark:text-orange-400/80 tracking-wider mt-2 border-l-2 border-orange-500 pl-2">Sistem Integrasi Lintas-Tim: Barang yang dimasukkan di sini akan langsung menjadi notifikasi tugas di Dashboard Tim Logistik.</p>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
             <form onSubmit={handlePushRequest} className="space-y-4 mb-6 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-4 rounded-xl border border-subtle border-l-orange-500 border-l-4">
                 <div>
                     <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Spesifikasi Properti yang dibutuhkan</Label>
                     <Input value={propName} onChange={e => setPropName(e.target.value)} placeholder="Contoh: Stand Mic Vocal / Kursi Tinggi" required className="bg-white dark:bg-[var(--color-charcoal-900)] border-subtle h-11 focus:border-orange-500/50" />
                 </div>
                 <div className="flex gap-3">
                     <div className="w-1/3">
                         <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Kuantitas</Label>
                         <Input type="number" value={propQty} onChange={e => setPropQty(e.target.value)} placeholder="0" required className="bg-white dark:bg-[var(--color-charcoal-900)] border-subtle h-11 font-black text-center focus:border-orange-500/50" />
                     </div>
                     <Button type="submit" variant="default" className="flex-1 h-11 self-end bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-[10px] group shadow-md">
                         <Send className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-1" /> Ajukan ke Logistik
                     </Button>
                 </div>
             </form>

             <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                 <p className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-subtle pb-2">Status Penyediaan Logistik</p>
                 <div className="space-y-3">
                     {requestProperti.length === 0 ? <p className="text-[10px] font-bold uppercase tracking-wider text-center text-muted py-8 border border-dashed border-subtle rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">Belum mengajukan properti.</p> : requestProperti.map(req => (
                         <div key={req.id} className="flex justify-between items-center p-3 rounded-xl border border-subtle bg-white dark:bg-[var(--color-charcoal-950)] hover:border-orange-500/30 transition-colors shadow-sm">
                             <div>
                                 <p className="font-bold text-sm text-main leading-tight">{req.name}</p>
                                 <p className="text-[9px] font-black text-muted tracking-widest mt-1">JUMLAH: {req.qty} UNIT</p>
                             </div>
                             <Badge variant={req.status === 'Disediakan' ? 'success' : 'warning'} className={`font-bold px-3 py-1.5 uppercase tracking-wider text-[9px] ${req.status === 'Diminta' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20' : ''}`}>
                                 {req.status === 'Disediakan' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                                 {req.status}
                             </Badge>
                         </div>
                     )).reverse()}
                 </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

