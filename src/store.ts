import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
    Role, TeamProfile, BahanBaku, MenuProduk, Transaksi, 
    Peralatan, DesainItem, PenampilanData, PettyCash, AuditLog, RequestProperti 
} from './types';
import { generateId, getNowFormatted } from './lib/utils';

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

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            setTheme: (theme) => set({ theme }),

            standName: '',
            waliKelasName: '',
            modalAwal: 0,
            setStandName: (standName) => set({ standName }),
            setWaliKelasName: (waliKelasName) => set({ waliKelasName }),
            setModalAwal: (modalAwal) => set({ modalAwal }),

            profiles: defaultProfiles,
            setProfile: (role, profile) => set((state) => ({
                profiles: { ...state.profiles, [role]: profile }
            })),

            bahanBaku: [],
            addBahanBaku: (item) => set((state) => {
                const priceMatch = Number(item.buyPrice) * Number(item.quantity);
                const statusAcc = item.source === 'Kas' ? 'Menunggu' : 'Disetujui';
                state.addLog(`Bahan Baku '${item.name}' ditambahkan.`, 'Konsumsi');
                return {
                    bahanBaku: [...state.bahanBaku, { ...item, id: generateId(), totalPrice: priceMatch, statusAcc }]
                };
            }),
            updateBahanBaku: (id, updates) => set((state) => {
                state.addLog(`Bahan Baku (ID: ${id}) diperbarui.`, 'Konsumsi');
                return {
                    bahanBaku: state.bahanBaku.map(b => b.id === id ? { ...b, ...updates, totalPrice: (updates.buyPrice || b.buyPrice) * (updates.quantity || b.quantity) } : b)
                };
            }),
            deleteBahanBaku: (id) => set((state) => {
                state.addLog(`Bahan Baku (ID: ${id}) dihapus.`, 'Konsumsi');
                return { bahanBaku: state.bahanBaku.filter(b => b.id !== id) }
            }),
            accBahanBaku: (id, status) => set((state) => {
                state.addLog(`Pengajuan Dana Bahan Baku (ID: ${id}) diperbarui menjadi ${status}.`, 'Bendahara');
                return {
                    bahanBaku: state.bahanBaku.map(b => b.id === id ? { ...b, statusAcc: status } : b)
                };
            }),

            menuProduk: [],
            addMenu: (menu) => set((state) => {
                state.addLog(`Menu '${menu.name}' ditambahkan.`, 'Konsumsi');
                return { menuProduk: [...state.menuProduk, { ...menu, id: generateId() }] };
            }),
            updateMenu: (id, updates) => set((state) => {
                state.addLog(`Menu (ID: ${id}) diperbarui.`, 'Konsumsi');
                return { menuProduk: state.menuProduk.map(m => m.id === id ? { ...m, ...updates } : m) };
            }),
            deleteMenu: (id) => set((state) => {
                state.addLog(`Menu (ID: ${id}) dihapus.`, 'Konsumsi');
                return { menuProduk: state.menuProduk.filter(m => m.id !== id) };
            }),

            transaksi: [],
            addTransaksi: (t) => set((state) => {
                state.addLog(`Transaksi baru dari ${t.sellerRole} untuk menu '${t.menuName}'.`, t.sellerRole);
                const menu = state.menuProduk.find(m => m.id === t.menuId);
                const menuProduk = state.menuProduk.map(m => 
                    m.id === t.menuId ? { ...m, stock: Math.max(0, m.stock - t.qty) } : m
                );
                return { 
                    transaksi: [...state.transaksi, { ...t, id: generateId(), time: getNowFormatted() }],
                    menuProduk 
                };
            }),

            peralatan: [],
            addPeralatan: (item) => set((state) => {
                const statusAcc = item.source === 'Sewa' ? 'Menunggu' : 'Disetujui';
                state.addLog(`Peralatan '${item.name}' ditambahkan.`, 'Logistik');
                return { peralatan: [...state.peralatan, { ...item, id: generateId(), statusAcc }] };
            }),
            updatePeralatan: (id, updates) => set((state) => {
                state.addLog(`Peralatan (ID: ${id}) diperbarui.`, 'Logistik');
                return { peralatan: state.peralatan.map(p => p.id === id ? { ...p, ...updates } : p) };
            }),
            deletePeralatan: (id) => set((state) => {
                state.addLog(`Peralatan (ID: ${id}) dihapus.`, 'Logistik');
                return { peralatan: state.peralatan.filter(p => p.id !== id) };
            }),
            accPeralatan: (id, status) => set((state) => {
                state.addLog(`Pengajuan Dana Peralatan (ID: ${id}) diperbarui menjadi ${status}.`, 'Bendahara');
                return {
                    peralatan: state.peralatan.map(p => p.id === id ? { ...p, statusAcc: status } : p)
                };
            }),

            desain: [],
            addDesain: (item) => set((state) => {
                state.addLog(`Media Promosi '${item.title}' diunggah.`, 'Desain');
                return { desain: [...state.desain, { ...item, id: generateId(), time: getNowFormatted() }] };
            }),
            updateDesainStatus: (id, status, feedback) => set((state) => {
                state.addLog(`Status Desain (ID: ${id}) diubah menjadi ${status}.`, 'Wali Kelas');
                return { desain: state.desain.map(d => d.id === id ? { ...d, status, feedback } : d) };
            }),
            deleteDesain: (id) => set((state) => {
                state.addLog(`Media Promosi (ID: ${id}) dihapus.`, 'Desain');
                return { desain: state.desain.filter(d => d.id !== id) };
            }),

            penampilan: { naskah: '', duration: 0, showTime: '' },
            setPenampilan: (data) => set((state) => {
                state.addLog(`Data Penampilan diperbarui.`, 'Penampilan');
                return { penampilan: data };
            }),

            requestProperti: [],
            addRequestProperti: (req) => set((state) => {
                state.addLog(`Request Properti '${req.name}' oleh Penampilan.`, 'Penampilan');
                return { requestProperti: [...state.requestProperti, { ...req, id: generateId() }] };
            }),
            updateRequestProperti: (id, status) => set((state) => {
                state.addLog(`Status Request Properti (ID: ${id}) diubah menjadi ${status}.`, 'Logistik');
                return { requestProperti: state.requestProperti.map(r => r.id === id ? { ...r, status } : r) };
            }),

            pettyCash: [],
            addPettyCash: (pc) => set((state) => {
                state.addLog(`Kas Kecil dikeluarkan: ${pc.description}`, 'Bendahara');
                return { pettyCash: [...state.pettyCash, { ...pc, id: generateId() }] };
            }),
            deletePettyCash: (id) => set((state) => ({ pettyCash: state.pettyCash.filter(p => p.id !== id) })),

            logs: [],
            addLog: (action, role) => set((state) => ({
                logs: [{ id: generateId(), timestamp: getNowFormatted(), action, role }, ...state.logs].slice(0, 1000)
            })),
            clearLogs: () => set({ logs: [] }),

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
                }
            }
        }),
        { 
            name: 'market-day-storage',
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => !['theme'].includes(key)) // Persist everything except theme (or persist it, up to us)
            ) as any
        }
    )
);
