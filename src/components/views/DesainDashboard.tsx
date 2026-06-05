import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '../ui';
import { useStore } from '../../store';
import { UploadCloud, Trash2, Eye, Paintbrush } from 'lucide-react';

export default function DesainDashboard() {
  const { desain, addDesain, deleteDesain } = useStore();
  
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if(!title || !link) return;
    addDesain({
       title,
       link,
       status: 'Menunggu Review',
       feedback: ''
    });
    setTitle('');
    setLink('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-white">
          <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-green)]">Kreatif & Promosi</span>
              <h1 className="text-2xl font-black mt-1">Dashboard Tim Desain</h1>
              <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Sistem pengajuan aset visual (Banner, Menu, Props) untuk direview oleh Penanggung Jawab / Wali Kelas.</p>
          </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card lg:col-span-1 rounded-2xl shadow-sm border-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold"><Paintbrush className="w-5 h-5 text-blue-500" /> Upload Aset Baru</CardTitle>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleUpload} className="space-y-4">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Judul Aset / Promosi</Label>
                   <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Banner Utama Stand" required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-11" />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Tautan Media (G-Drive / Canva / Figma)</Label>
                   <Input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." required className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-950)] border-subtle h-11" />
                 </div>
                 
                 <div className="pt-4">
                    <Button type="submit" variant="neon" className="w-full h-12 uppercase font-bold tracking-wider text-sm bg-[var(--color-charcoal-900)] text-white hover:bg-[var(--primary-green)] hover:text-black hover:border-black transition-colors group">
                      <UploadCloud className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-1" /> Ajukan Desain
                    </Button>
                 </div>
             </form>
          </CardContent>
        </Card>

        <Card className="bg-card lg:col-span-2 rounded-2xl shadow-sm border-subtle overflow-hidden">
          <CardHeader className="bg-[var(--color-charcoal-100)] dark:bg-[var(--color-charcoal-900)]/40 border-b border-subtle">
            <CardTitle className="font-bold text-lg">Status Review Media</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
               {desain.length === 0 ? (
                 <div className="text-center py-16 text-muted border border-subtle border-dashed rounded-xl bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)]">
                    <Paintbrush className="w-8 h-8 opacity-20 mx-auto mb-2" />
                    <p className="font-bold text-xs uppercase tracking-wider">Belum ada aset desain yang diunggah.</p>
                 </div>
               ) : desain.map(d => (
                 <div key={d.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--color-charcoal-50)] dark:bg-[var(--color-charcoal-950)] p-4 rounded-xl border border-subtle group hover:border-[var(--primary-green)] transition-colors">
                    <div className="flex-1">
                       <h4 className="font-bold text-lg text-main leading-tight">{d.title}</h4>
                       <div className="flex items-center gap-3 mt-2">
                          <a href={d.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-md">
                             <Eye className="h-3 w-3" /> Buka Tautan
                          </a>
                          <span className="text-[10px] text-muted font-bold tracking-wider">
                            DIKIRIM: {new Date(d.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                       </div>
                       
                       {d.feedback && (
                           <div className="mt-4 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                               <p className="font-black text-orange-600 dark:text-orange-400 mb-1 text-[10px] uppercase tracking-wider flex items-center gap-1">Catatan Wali Kelas:</p>
                               <p className="text-sm font-medium text-main">{d.feedback}</p>
                           </div>
                       )}
                    </div>

                    <div className="flex sm:flex-col items-center justify-end sm:items-end gap-3 min-w-[120px] w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-subtle">
                       <Badge variant={d.status === 'Disetujui' ? 'success' : d.status === 'Perlu Revisi' ? 'warning' : 'default'} className="text-center justify-center py-1.5 px-3 font-bold uppercase tracking-wider text-[10px]">
                          {d.status}
                       </Badge>
                       {deleteConfirmId === d.id ? (
                           <div className="flex flex-col gap-1 w-full sm:w-auto">
                               <Button size="sm" onClick={() => { deleteDesain(d.id); setDeleteConfirmId(null); }} className="h-7 w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider">Ya, Hapus</Button>
                               <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)} className="h-7 w-full text-[10px] font-bold uppercase tracking-wider">Batal</Button>
                           </div>
                       ) : (
                           <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(d.id)} className="h-8 gap-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider">
                               <Trash2 className="h-3 w-3" /> Hapus
                           </Button>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

