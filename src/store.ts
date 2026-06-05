import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
    Role, TeamProfile, BahanBaku, MenuProduk, Transaksi, 
    Peralatan, DesainItem, PenampilanData, PettyCash, AuditLog, RequestProperti 
} from './types';
import { generateId, getNowFormatted } from './lib/utils';
import { db } from './firebase'; // Memanggil konfigurasi Firebase yang kita buat sebelumnya
import { ref, set as firebaseSet, onValue } from 'firebase/database';

interface AppState {
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;

    standName: string;
    waliKelasName: string;
    modalAwal: number;
    setStandName: (name: string) => void;
    setWaliKelasName: (name: string) => void;
    setModalAwal: (amount: number) => void;

    profiles: Record<Role, TeamProfile>;
    setProfile: (role: Role, profile: TeamProfile) => void;

    bahanBaku: BahanBaku[];
    addBahanBaku: (items: Omit<BahanBaku, 'id' | 'totalPrice'>) => void;
    updateBahanBaku: (id: string, updates: Partial<BahanBaku>) => void;
    deleteBahanBaku: (id: string) => void;
    accBahanBaku: (id: string, status: 'Disetujui' | 'Ditolak') => void;

    menuProduk: MenuProduk[];
    addMenu: (menu: Omit<MenuProduk, 'id'>) => void;
    updateMenu: (id: string, updates: Partial<MenuProduk>) => void;
    deleteMenu: (id: string) => void;

    transaksi: Transaksi[];
    addTransaksi: (t: Omit<Transaksi, 'id' | 'time'>) => void;

    peralatan: Peralatan[];
    addPeralatan: (item: Omit<Peralatan, 'id'>) => void;
    updatePeralatan: (id: string, updates: Partial<Peralatan>) => void;
    deletePeralatan: (id: string) => void;
    accPeralatan: (id: string, status: 'Disetujui' | 'Ditolak') => void;

    desain: DesainItem[];
    addDesain: (item: Omit<DesainItem, 'id' | 'time'>) => void;
    updateDesainStatus: (id: string, status: DesainItem['status'], feedback: string) => void;
    deleteDesain: (id: string) => void;

    penampilan: PenampilanData;
    setPenampilan: (data: PenampilanData) => void;

    requestProperti: RequestProperti[];
    addRequestProperti: (req: Omit<RequestProperti, 'id'>) => void;
    updateRequestProperti: (id: string, status: 'Diminta' | 'Disediakan') => void;

    pettyCash: PettyCash[];
    addPettyCash: (pc: Omit<PettyCash, 'id'>) => void;
    deletePettyCash: (id: string) => void;

    logs: AuditLog[];
    addLog: (action: string, role: Role | 'System') => void;
    clearLogs: () => void;

    resetData: (confirmText: string) => void;
    syncFromFirebase: (data: any) => void;
}

const defaultProfiles: Record<Role, TeamProfile> = {
    'Wali Kelas': { isFilled: false, leader: '', members: [] },
    'Bendahara': { isFilled: false, leader: '', members: [] },
    'Kasir': { isFilled: false, leader: '', members: [] },
    'Keliling': { isFilled: false, leader: '', members: [] },
    'Konsumsi': { isFilled: false, leader: '', members: [] },
    'Logistik': { isFilled: false, leader: '', members: [] },
    'Desain': { isFilled: false, leader: '', members: [] },
    'Penampilan': { isFilled: false, leader: '', members: [] },
};

// Fungsi pembantu untuk otomatis melempar state data ke Firebase cloud setiap kali ada perubahan
const syncToFirebase = (state: any) => {
    const dataToSync = {
        standName: state.standName,
        waliKelasName: state.waliKelasName,
        modalAwal: state.modalAwal,
        profiles: state.profiles,
        bahanBaku: state.bahanBaku,
        menuProduk: state.menuProduk,
        transaksi: state.transaksi,
        peralatan: state.peralatan,
        desain: state.desain,
        penampilan: state.penampilan,
        requestProperti: state.requestProperti,
        pettyCash: state.pettyCash,
        logs: state.logs
    };
    firebaseSet(ref(db, 'market-day-data/'), dataToSync);
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            setTheme: (theme) => set({ theme }),

            standName: '',
            waliKelasName: '',
            modalAwal: 0,
            setStandName: (standName) => {
                set({ standName });
                syncToFirebase(get());
            },
            setWaliKelasName: (waliKelasName) => {
                set({ waliKelasName });
                syncToFirebase(get());
            },
            setModalAwal: (modalAwal) => {
                set({ modalAwal });
                syncToFirebase(get());
            },

            profiles: defaultProfiles,
            setProfile: (role, profile) => {
                set((state) => ({
                    profiles: { ...state.profiles, [role]: profile }
                }));
                syncToFirebase(get());
            },

            bahanBaku: [],
            addBahanBaku: (item) => {
                set((state) => {
                    const priceMatch = Number(item.buyPrice) * Number(item.quantity);
                    const statusAcc = item.source === 'Kas' ? 'Menunggu' : 'Disetujui';
                    const newState = {
                        bahanBaku: [...state.bahanBaku, { ...item, id: generateId(), totalPrice: priceMatch, statusAcc }]
                    };
                    return newState;
                });
                get().addLog(`Bahan Baku '${item.name}' ditambahkan.`, 'Konsumsi');
                syncToFirebase(get());
            },
            updateBahanBaku: (id, updates) => {
                set((state) => ({
                    bahanBaku: state.bahanBaku.map(b => b.id === id ? { ...b, ...updates, totalPrice: (updates.buyPrice || b.buyPrice) * (updates.quantity || b.quantity) } : b)
                }));
                get().addLog(`Bahan Baku (ID: ${id}) diperbarui.`, 'Konsumsi');
                syncToFirebase(get());
            },
            deleteBahanBaku: (id) => {
                set((state) => ({ bahanBaku: state.bahanBaku.filter(b => b.id !== id) }));
                get().addLog(`Bahan Baku (ID: ${id}) dihapus.`, 'Konsumsi');
                syncToFirebase(get());
            },
            accBahanBaku: (id, status) => {
                set((state) => ({
                    bahanBaku: state.bahanBaku.map(b => b.id === id ? { ...b, statusAcc: status } : b)
                }));
                get().addLog(`Pengajuan Dana Bahan Baku (ID: ${id}) diperbarui menjadi ${status}.`, 'Bendahara');
                syncToFirebase(get());
            },

            menuProduk: [],
            addMenu: (menu) => {
                set((state) => ({ menuProduk: [...state.menuProduk, { ...menu, id: generateId() }] }));
                get().addLog(`Menu '${menu.name}' ditambahkan.`, 'Konsumsi');
                syncToFirebase(get());
            },
            updateMenu: (id, updates) => {
                set((state) => ({ menuProduk: state.menuProduk.map(m => m.id === id ? { ...m, ...updates } : m) }));
                get().addLog(`Menu (ID: ${id}) diperbarui.`, 'Konsumsi');
                syncToFirebase(get());
            },
            deleteMenu: (id) => {
                set((state) => ({ menuProduk: state.menuProduk.filter(m => m.id !== id) }));
                get().addLog(`Menu (ID: ${id}) dihapus.`, 'Konsumsi');
                syncToFirebase(get());
            },

            transaksi: [],
            addTransaksi: (t) => {
                set((state) => {
                    const menuProduk = state.menuProduk.map(m => 
                        m.id === t.menuId ? { ...m, stock: Math.max(0, m.stock - t.qty) } : m
                    );
                    return { 
                        transaksi: [...state.transaksi, { ...t, id: generateId(), time: getNowFormatted() }],
                        menuProduk 
                    };
                });
                get().addLog(`Transaksi baru dari ${t.sellerRole} untuk menu '${t.menuName}'.`, t.sellerRole);
                syncToFirebase(get());
            },

            peralatan: [],
            addPeralatan: (item) => {
                set((state) => {
                    const statusAcc = item.source === 'Sewa' ? 'Menunggu' : 'Disetujui';
                    return { peralatan: [...state.peralatan, { ...item, id: generateId(), statusAcc }] };
                });
                get().addLog(`Peralatan '${item.name}' ditambahkan.`, 'Logistik');
                syncToFirebase(get());
            },
            updatePeralatan: (id, updates) => {
                set((state) => ({ peralatan: state.peralatan.map(p => p.id === id ? { ...p, ...updates } : p) }));
                get().addLog(`Peralatan (ID: ${id}) diperbarui.`, 'Logistik');
                syncToFirebase(get());
            },
            deletePeralatan: (id) => {
                set((state) => ({ peralatan: state.peralatan.filter(p => p.id !== id) }));
                get().addLog(`Peralatan (ID: ${id}) dihapus.`, 'Logistik');
                syncToFirebase(get());
            },
            accPeralatan: (id, status) => {
                set((state) => ({
                    peralatan: state.peralatan.map(p => p.id === id ? { ...p, statusAcc: status } : p)
                }));
                get().addLog(`Pengajuan Dana Peralatan (ID: ${id}) diperbarui menjadi ${status}.`, 'Bendahara');
                syncToFirebase(get());
            },

            desain: [],
            addDesain: (item) => {
                set((state) => ({ desain: [...state.desain, { ...item, id: generateId(), time: getNowFormatted() }] }));
                get().addLog(`Media Promosi '${item.title}' diunggah.`, 'Desain');
                syncToFirebase(get());
            },
            updateDesainStatus: (id, status, feedback) => {
                set((state) => ({ desain: state.desain.map(d => d.id === id ? { ...d, status, feedback } : d) }));
                get().addLog(`Status Desain (ID: ${id}) diubah menjadi ${status}.`, 'Wali Kelas');
                syncToFirebase(get());
            },
            deleteDesain: (id) => {
                set((state) => ({ desain: state.desain.filter(d => d.id !== id) }));
                get().addLog(`Media Promosi (ID: ${id}) dihapus.`, 'Desain');
                syncToFirebase(get());
            },

            penampilan: { naskah: '', duration: 0, showTime: '' },
            setPenampilan: (data) => {
                set({ penampilan: data });
                get().addLog(`Data Penampilan diperbarui.`, 'Penampilan');
                syncToFirebase(get());
            },

            requestProperti: [],
            addRequestProperti: (req) => {
                set((state) => ({ requestProperti: [...state.requestProperti, { ...req, id: generateId() }] }));
                get().addLog(`Request Properti '${req.name}' oleh Penampilan.`, 'Penampilan');
                syncToFirebase(get());
            },
            updateRequestProperti: (id, status) => {
                set((state) => ({ requestProperti: state.requestProperti.map(r => r.id === id ? { ...r, status } : r) }));
                get().addLog(`Status Request Properti (ID: ${id}) diubah menjadi ${status}.`, 'Logistik');
                syncToFirebase(get());
            },

            pettyCash: [],
            addPettyCash: (pc) => {
                set((state) => ({ pettyCash: [...state.pettyCash, { ...pc, id: generateId() }] }));
                get().addLog(`Kas Kecil dikeluarkan: ${pc.description}`, 'Bendahara');
                syncToFirebase(get());
            },
            deletePettyCash: (id) => {
                set((state) => ({ pettyCash: state.pettyCash.filter(p => p.id !== id) }));
                syncToFirebase(get());
            },

            logs: [],
            addLog: (action, role) => set((state) => ({
                logs: [{ id: generateId(), timestamp: getNowFormatted(), action, role }, ...state.logs].slice(0, 1000)
            })),
            clearLogs: () => {
                set({ logs: [] });
                syncToFirebase(get());
            },

            resetData: (confirm) => {
                if (confirm === 'KONFIRMASI RESET') {
                    set({
                        standName: '',
                        waliKelasName: '',
                        modalAwal: 0,
                        profiles: defaultProfiles,
                        bahanBaku: [],
                        menuProduk: [],
                        transaksi: [],
                        peralatan: [],
                        desain: [],
                        penampilan: { naskah: '', duration: 0, showTime: '' },
                        requestProperti: [],
                        pettyCash: [],
                        logs: []
                    });
                    get().addLog('Semua Sistem Direset Ulang', 'System');
                    syncToFirebase(get()); // Menghapus cloud data di Firebase juga secara bersamaan!
                }
            },

            // Fungsi penangkap sinyal real-time untuk memperbarui layar device lain secara otomatis
            syncFromFirebase: (data) => set({
                standName: data.standName ?? '',
                waliKelasName: data.waliKelasName ?? '',
                modalAwal: data.modalAwal ?? 0,
                profiles: data.profiles ?? defaultProfiles,
                bahanBaku: data.bahanBaku ?? [],
                menuProduk: data.menuProduk ?? [],
                transaksi: data.transaksi ?? [],
                peralatan: data.peralatan ?? [],
                desain: data.desain ?? [],
                penampilan: data.penampilan ?? { naskah: '', duration: 0, showTime: '' },
                requestProperti: data.requestProperti ?? [],
                pettyCash: data.pettyCash ?? [],
                logs: data.logs ?? []
            })
        }),
        { 
            name: 'market-day-storage',
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => !['theme'].includes(key))
            ) as any
        }
    )
);

// Memicu sinkronisasi data otomatis antar perangkat dari database Firebase secara real-time
if (typeof window !== 'undefined') {
    onValue(ref(db, 'market-day-data/'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            useStore.getState().syncFromFirebase(data);
        }
    });
}
